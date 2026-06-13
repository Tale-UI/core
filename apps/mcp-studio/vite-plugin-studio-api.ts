/**
 * vite-plugin-studio-api.ts
 *
 * Dev-server middleware that exposes /api/* routes for the Studio.
 * Imports directly from tools/mcp-core.mjs and tools/providers.mjs
 * so the Studio and the MCP stdio server share the same code path.
 *
 * Routes:
 *   GET  /api/mcp/list_components
 *   GET  /api/mcp/get_component?name=X
 *   POST /api/mcp/plan_ui              { prompt }
 *   GET  /api/mcp/get_recipe?slug=X
 *   GET  /api/mcp/list_recipes
 *   POST /api/mcp/search_components    { query }
 *   POST /api/mcp/search_docs          { query }
 *   POST /api/generate                 { prompt, model?, maxTurns? }
 *   POST /api/write-pitfall            { component, slug, summary, detail, antiPattern, fix, completeExample }
 *   GET  /api/shape-audit              (streams output via SSE)
 */

import type { Plugin, ViteDevServer } from 'vite';
import { execFile, spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function extractCode(text: string): string {
  const fenced = text.match(
    /^[ \t]*```[ \t]*(?:tsx?|jsx?|typescript|javascript)?[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/m,
  );
  if (fenced) {return fenced[1].trim();}
  const importIdx = text.indexOf('import ');
  if (importIdx !== -1) {return text.slice(importIdx).trim();}
  return text.trim();
}
const ROOT = resolve(__dirname, '..', '..');
const TOOLS = join(ROOT, 'tools');
const DOCS_COMPONENTS = join(ROOT, 'docs', 'components');
const SNIPPET_PATH = join(ROOT, 'docs', 'consumer-claude-md-snippet.md');
const GOLDEN_PROMPTS_DIR = join(TOOLS, 'golden-prompts');

// Lazy-loaded ESM modules (Node can't statically import .mjs from .ts)
 
let coreModule: any = null;
 
let providersModule: any = null;

async function getCore() {
  if (!coreModule) {coreModule = await import(join(TOOLS, 'mcp-core.mjs') as unknown as string);}
  return coreModule;
}

async function getProviders() {
  if (!providersModule) {providersModule = await import(join(TOOLS, 'providers.mjs') as unknown as string);}
  return providersModule;
}

function json(res: NodeResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(body);
}

 
type NodeRequest = any;
 
type NodeResponse = any;

function readBody(req: NodeRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function buildPitfallBlock(fields: {
  slug: string;
  summary: string;
  detail: string;
  antiPattern: string;
  fix: string;
  completeExample: string;
}): string {
  const lines: string[] = [
    `<!-- pitfall: ${fields.slug} -->`,
    `- **${fields.summary}**${fields.detail ? ` — ${fields.detail}` : ''}`,
    `  - anti-pattern: \`${fields.antiPattern}\``,
    `  - fix: \`${fields.fix}\``,
  ];
  if (fields.completeExample.trim()) {
    lines.push('  - complete example:');
    lines.push('');
    lines.push('    ```tsx');
    for (const line of fields.completeExample.split('\n')) {
      lines.push(`    ${line}`);
    }
    lines.push('    ```');
  }
  return lines.join('\n');
}

function insertPitfallIntoDoc(docPath: string, block: string): void {
  let content = readFileSync(docPath, 'utf8');
  if (!content.includes('\n## Pitfalls\n')) {
    // Insert before ## Notes if present, otherwise append at end
    if (content.includes('\n## Notes\n')) {
      content = content.replace('\n## Notes\n', `\n## Pitfalls\n\n${block}\n\n## Notes\n`);
    } else {
      content = `${content.trimEnd()  }\n\n## Pitfalls\n\n${block}\n`;
    }
  } else {
    // Append new pitfall before the first following ## section (or at end of Pitfalls section)
    content = content.replace(
      /(\n## Pitfalls\n)([\s\S]*?)(\n## |\n$|$)/,
      (_match, heading, body, next) => `${heading}${body}\n${block}\n${next}`,
    );
  }
  writeFileSync(docPath, content, 'utf8');
}

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: NodeRequest, res: NodeResponse, next: () => void) => {
        try {
        const url = new URL(req.url, 'http://localhost');

        // ── GET /api/mcp/list_components ─────────────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/mcp/list_components') {
          const core = await getCore();
          const result = core.listComponentsCore();
          return json(res, 200, { text: result.text, isError: result.isError ?? false });
        }

        // ── GET /api/mcp/get_component?name=X ───────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/mcp/get_component') {
          const name = url.searchParams.get('name') ?? '';
          if (!name) {return json(res, 400, { error: 'name query param required' });}
          const core = await getCore();
          const result = core.getComponentCore(name);
          return json(res, result.isError ? 404 : 200, { text: result.text, isError: result.isError ?? false });
        }

        // ── POST /api/mcp/plan_ui ────────────────────────────────────────────
        if (req.method === 'POST' && url.pathname === '/api/mcp/plan_ui') {
          const body = JSON.parse(await readBody(req));
          if (!body.prompt) {return json(res, 400, { error: 'prompt required' });}
          const core = await getCore();
          const result = core.planUiCore(body.prompt);
          return json(res, 200, { text: result.text });
        }

        // ── GET /api/mcp/get_recipe?slug=X ───────────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/mcp/get_recipe') {
          const slug = url.searchParams.get('slug') ?? '';
          if (!slug) {return json(res, 400, { error: 'slug query param required' });}
          const core = await getCore();
          const result = core.getRecipeCore(slug);
          return json(res, result.isError ? 404 : 200, { text: result.text, isError: result.isError ?? false });
        }

        // ── GET /api/mcp/list_recipes ────────────────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/mcp/list_recipes') {
          const core = await getCore();
          const result = core.listRecipesCore();
          return json(res, 200, { text: result.text });
        }

        // ── POST /api/mcp/search_components ─────────────────────────────────
        if (req.method === 'POST' && url.pathname === '/api/mcp/search_components') {
          const body = JSON.parse(await readBody(req));
          if (!body.query) {return json(res, 400, { error: 'query required' });}
          const core = await getCore();
          const result = core.searchComponentsCore(body.query);
          return json(res, 200, { text: result.text });
        }

        // ── POST /api/mcp/search_docs ────────────────────────────────────────
        if (req.method === 'POST' && url.pathname === '/api/mcp/search_docs') {
          const body = JSON.parse(await readBody(req));
          if (!body.query) {return json(res, 400, { error: 'query required' });}
          const core = await getCore();
          const result = core.searchDocsCore(body.query);
          return json(res, 200, { text: result.text });
        }

        // ── GET /api/golden-prompts ──────────────────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/golden-prompts') {
          const indexPath = join(GOLDEN_PROMPTS_DIR, 'index.json');
          const index = JSON.parse(readFileSync(indexPath, 'utf8')) as { prompts: Array<{ slug: string }> };
          const prompts = index.prompts.map(({ slug }) => {
            const raw = readFileSync(join(GOLDEN_PROMPTS_DIR, `${slug}.json`), 'utf8');
            return JSON.parse(raw);
          });
          return json(res, 200, prompts);
        }

        // ── POST /api/generate ───────────────────────────────────────────────
        if (req.method === 'POST' && url.pathname === '/api/generate') {
          const body = JSON.parse(await readBody(req));
          if (!body.prompt) {return json(res, 400, { error: 'prompt required' });}
          try {
            const providers = await getProviders();
            const snippetRaw = readFileSync(SNIPPET_PATH, 'utf8');
            // Strip preamble before ## UI Components (mirrors eval-golden-prompts.mjs)
            const snippetContent = snippetRaw.replace(/^[\s\S]*?(?=^## UI Components)/m, '');
            const systemPrompt = `You are a React developer working on a project that uses Tale UI components.\n\n${snippetContent}\n\n---\n\nWhen asked to create UI, generate a single self-contained TypeScript/TSX code block.\nRules:\n- Return ONLY the code block, no explanation before or after.\n- Export a function named \`Example\` as the default export.\n- Use Tale UI components exclusively — no raw HTML layout elements where a Tale UI layout component exists.\n- Do not include stylesheet imports.\n- Do not add inline styles for visual treatment (colors, borders, shadows) — only layout styles (width, height, spacing) are permitted.\n- Follow all import, composition, and pitfall rules listed above exactly.`;
            const result = await providers.callClaudeWithMcp(body.prompt, {
              model: body.model ?? 'sonnet',
              systemPrompt,
              maxTurns: body.maxTurns ?? 10,
            });
            return json(res, 200, { text: extractCode(result) });
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return json(res, 500, { error: message });
          }
        }

        // ── POST /api/write-pitfall ──────────────────────────────────────────
        if (req.method === 'POST' && url.pathname === '/api/write-pitfall') {
          const body = JSON.parse(await readBody(req));
          const { component, slug, summary, detail = '', antiPattern, fix, completeExample = '' } = body;
          if (!component || !slug || !summary || !antiPattern || !fix) {
            return json(res, 400, { error: 'component, slug, summary, antiPattern, and fix are required' });
          }
          const docPath = join(DOCS_COMPONENTS, `${component.toLowerCase().replace(/([A-Z])/g, (m: string) => `-${m.toLowerCase()}`).replace(/^-/, '')}.md`);
          // Write the pitfall block
          const block = buildPitfallBlock({ slug, summary, detail, antiPattern, fix, completeExample });
          let rollbackContent: string | null = null;
          try {
            rollbackContent = readFileSync(docPath, 'utf8');
            insertPitfallIntoDoc(docPath, block);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return json(res, 500, { error: `Failed to write doc: ${message}` });
          }
          // Run registry:generate + pitfalls:shape
          const cmd = 'pnpm';
          const genArgs = ['--dir', ROOT, 'registry:generate'];
          const shapeArgs = ['--dir', ROOT, 'pitfalls:shape'];
          try {
            await new Promise<void>((resolve, reject) => {
              execFile(cmd, genArgs, { cwd: ROOT }, (err, stdout, stderr) => {
                if (err) {reject(new Error(`registry:generate failed:\n${stderr || stdout}`));}
                else {resolve();}
              });
            });
            await new Promise<void>((resolve, reject) => {
              execFile(cmd, shapeArgs, { cwd: ROOT }, (err, stdout, stderr) => {
                if (err) {reject(new Error(`pitfalls:shape failed:\n${stderr || stdout}`));}
                else {resolve();}
              });
            });
            return json(res, 200, { ok: true, block });
          } catch (err) {
            // Roll back the file write
            if (rollbackContent !== null) {writeFileSync(docPath, rollbackContent, 'utf8');}
            const message = err instanceof Error ? err.message : String(err);
            return json(res, 422, { error: message, rolledBack: true });
          }
        }

        // ── GET /api/shape-audit (SSE stream) ───────────────────────────────
        if (req.method === 'GET' && url.pathname === '/api/shape-audit') {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.flushHeaders?.();

          const child = spawn('pnpm', ['--dir', ROOT, 'pitfalls:shape'], { cwd: ROOT, shell: false });
          const send = (line: string) => res.write(`data: ${JSON.stringify(line)}\n\n`);

          child.stdout.on('data', (d: Buffer) => {
            for (const line of d.toString().split('\n')) {if (line) {send(line);}}
          });
          child.stderr.on('data', (d: Buffer) => {
            for (const line of d.toString().split('\n')) {if (line) {send(line);}}
          });
          child.on('close', (code: number) => {
            send(`__done__:${code}`);
            res.end();
          });
          return;
        }

        next();
        } catch (err) {
          if (!res.headersSent) {
            json(res, 500, { error: err instanceof Error ? err.message : String(err) });
          }
        }
      });
    },
  };
}
