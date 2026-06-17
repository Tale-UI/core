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
 *   GET  /api/models
 *   POST /api/models                   { straicoApiKey? }
 *   POST /api/generate                 { prompt, provider?, model?, maxTurns?, straicoApiKey? }
 *   POST /api/a2ui/chat                { messages, provider?, model?, maxTurns?, straicoApiKey? }
 *   POST /api/write-pitfall            { component, slug, summary, detail, antiPattern, fix, completeExample }
 *   GET  /api/shape-audit              (streams output via SSE)
 */
import { execFile, spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
function extractCode(text) {
    const fenced = text.match(/^[ \t]*```[ \t]*(?:tsx?|jsx?|typescript|javascript)?[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/m);
    if (fenced) {
        return fenced[1].trim();
    }
    const importIdx = text.indexOf('import ');
    if (importIdx !== -1) {
        return text.slice(importIdx).trim();
    }
    return text.trim();
}
const ROOT = resolve(__dirname, '..', '..');
const TOOLS = join(ROOT, 'tools');
const DOCS_COMPONENTS = join(ROOT, 'docs', 'components');
const SNIPPET_PATH = join(ROOT, 'docs', 'consumer-claude-md-snippet.md');
const GOLDEN_PROMPTS_DIR = join(TOOLS, 'golden-prompts');
const A2UI_SYSTEM_PROMPT_PATH = join(ROOT, 'packages', 'a2ui', 'src', 'agent', 'system-prompt.md');
const A2UI_RESPONSE_INSTRUCTIONS = [
    '',
    '## Response Format',
    '',
    'You MUST respond with a JSON array of A2UI messages. Do not include markdown fences, explanatory text, or anything else around the JSON. Your entire response must be a valid JSON array.',
    '',
    'Each response should start with a beginRendering message, followed by one or more surfaceUpdate messages, and optionally dataModelUpdate messages.',
    '',
    'Use surfaceId "main" for all surfaces.',
    '',
    '**dataModelUpdate format.** If you include dataModelUpdate messages, each MUST have `surfaceId`, `path` (string), and `value`:',
    '',
    '```json',
    '{ "type": "dataModelUpdate", "surfaceId": "main", "path": "fieldName", "value": "fieldValue" }',
    '```',
    '',
    'Alternatively, use a `data` object to set multiple values at once:',
    '',
    '```json',
    '{ "type": "dataModelUpdate", "surfaceId": "main", "data": { "field1": "value1", "field2": "value2" } }',
    '```',
    '',
    'Do NOT omit both `path` and `data` — one of them is required.',
    '',
    '**CRITICAL: Component format.** Each component in the surfaceUpdate components array MUST use this exact structure:',
    '',
    '```json',
    '{ "id": "myId", "component": { "TypeName": { ...props, "children": ["childId1", "childId2"] } } }',
    '```',
    '',
    'Do NOT use `"type"`, `"props"`, or top-level `"children"` fields. The component type name and all its props, including children IDs, go INSIDE the `"component"` object.',
    '',
    'When the user asks you to modify the current UI, send a complete new set of messages that replaces the current surface.',
    '',
    'When a user action is dispatched back to you, prefixed with [Action], respond with updated A2UI messages if the UI should change, or a brief JSON array with a Text component acknowledging the action.',
    '',
    '**CRITICAL: Response size limits.** Keep responses under 80 component nodes per surfaceUpdate. If the user asks for a very large UI, build a focused representative UI, close the JSON array properly, and add a final Text component explaining that more sections are available on request.',
    '',
    'NEVER sacrifice valid JSON for completeness. A working UI with fewer components is always better than a truncated response.',
].join('\n');
// Lazy-loaded ESM modules (Node can't statically import .mjs from .ts)
let coreModule = null;
let providersModule = null;
let a2uiSystemPrompt = null;
async function getCore() {
    if (!coreModule) {
        coreModule = await import(join(TOOLS, 'mcp-core.mjs'));
    }
    return coreModule;
}
async function getProviders() {
    if (!providersModule) {
        providersModule = await import(join(TOOLS, 'providers.mjs'));
    }
    return providersModule;
}
function json(res, status, data) {
    const body = JSON.stringify(data);
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(body);
}
function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}
function getA2UISystemPrompt() {
    if (!a2uiSystemPrompt) {
        a2uiSystemPrompt = readFileSync(A2UI_SYSTEM_PROMPT_PATH, 'utf8') + A2UI_RESPONSE_INSTRUCTIONS;
    }
    return a2uiSystemPrompt;
}
function normalizeA2UIChatMessages(rawMessages) {
    if (!Array.isArray(rawMessages)) {
        return [];
    }
    return rawMessages.flatMap((message) => {
        if (!message || typeof message !== 'object') {
            return [];
        }
        const record = message;
        if (record.role !== 'user' && record.role !== 'assistant') {
            return [];
        }
        if (typeof record.content !== 'string' || !record.content.trim()) {
            return [];
        }
        return [{ role: record.role, content: record.content }];
    });
}
function buildA2UIChatPrompt(messages) {
    const transcript = messages
        .map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}:\n${message.content}`)
        .join('\n\n');
    return `Conversation so far:\n\n${transcript}\n\nRespond to the latest user message with only the A2UI JSON array.`;
}
function buildPitfallBlock(fields) {
    const lines = [
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
function insertPitfallIntoDoc(docPath, block) {
    let content = readFileSync(docPath, 'utf8');
    if (!content.includes('\n## Pitfalls\n')) {
        // Insert before ## Notes if present, otherwise append at end
        if (content.includes('\n## Notes\n')) {
            content = content.replace('\n## Notes\n', `\n## Pitfalls\n\n${block}\n\n## Notes\n`);
        }
        else {
            content = `${content.trimEnd()}\n\n## Pitfalls\n\n${block}\n`;
        }
    }
    else {
        // Append new pitfall before the first following ## section (or at end of Pitfalls section)
        content = content.replace(/(\n## Pitfalls\n)([\s\S]*?)(\n## |\n$|$)/, (_match, heading, body, next) => `${heading}${body}\n${block}\n${next}`);
    }
    writeFileSync(docPath, content, 'utf8');
}
export function studioApiPlugin() {
    return {
        name: 'studio-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
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
                        if (!name) {
                            return json(res, 400, { error: 'name query param required' });
                        }
                        const core = await getCore();
                        const result = core.getComponentCore(name);
                        return json(res, result.isError ? 404 : 200, {
                            text: result.text,
                            isError: result.isError ?? false,
                        });
                    }
                    // ── POST /api/mcp/plan_ui ────────────────────────────────────────────
                    if (req.method === 'POST' && url.pathname === '/api/mcp/plan_ui') {
                        const body = JSON.parse(await readBody(req));
                        if (!body.prompt) {
                            return json(res, 400, { error: 'prompt required' });
                        }
                        const core = await getCore();
                        const result = core.planUiCore(body.prompt);
                        return json(res, 200, { text: result.text });
                    }
                    // ── GET /api/mcp/get_recipe?slug=X ───────────────────────────────────
                    if (req.method === 'GET' && url.pathname === '/api/mcp/get_recipe') {
                        const slug = url.searchParams.get('slug') ?? '';
                        if (!slug) {
                            return json(res, 400, { error: 'slug query param required' });
                        }
                        const core = await getCore();
                        const result = core.getRecipeCore(slug);
                        return json(res, result.isError ? 404 : 200, {
                            text: result.text,
                            isError: result.isError ?? false,
                        });
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
                        if (!body.query) {
                            return json(res, 400, { error: 'query required' });
                        }
                        const core = await getCore();
                        const result = core.searchComponentsCore(body.query);
                        return json(res, 200, { text: result.text });
                    }
                    // ── POST /api/mcp/search_docs ────────────────────────────────────────
                    if (req.method === 'POST' && url.pathname === '/api/mcp/search_docs') {
                        const body = JSON.parse(await readBody(req));
                        if (!body.query) {
                            return json(res, 400, { error: 'query required' });
                        }
                        const core = await getCore();
                        const result = core.searchDocsCore(body.query);
                        return json(res, 200, { text: result.text });
                    }
                    // ── GET /api/golden-prompts ──────────────────────────────────────────
                    if (req.method === 'GET' && url.pathname === '/api/golden-prompts') {
                        const indexPath = join(GOLDEN_PROMPTS_DIR, 'index.json');
                        const index = JSON.parse(readFileSync(indexPath, 'utf8'));
                        const prompts = index.prompts.map(({ slug }) => {
                            const raw = readFileSync(join(GOLDEN_PROMPTS_DIR, `${slug}.json`), 'utf8');
                            return JSON.parse(raw);
                        });
                        return json(res, 200, prompts);
                    }
                    // ── GET/POST /api/models ────────────────────────────────────────────
                    if ((req.method === 'GET' || req.method === 'POST') && url.pathname === '/api/models') {
                        const body = req.method === 'POST' ? JSON.parse((await readBody(req)) || '{}') : {};
                        const providers = await getProviders();
                        const result = await providers.listAvailableModels({
                            straicoApiKey: body.straicoApiKey ?? '',
                        });
                        return json(res, 200, result);
                    }
                    // ── POST /api/generate ───────────────────────────────────────────────
                    if (req.method === 'POST' && url.pathname === '/api/generate') {
                        const body = JSON.parse(await readBody(req));
                        if (!body.prompt) {
                            return json(res, 400, { error: 'prompt required' });
                        }
                        try {
                            const providers = await getProviders();
                            const core = await getCore();
                            const snippetRaw = readFileSync(SNIPPET_PATH, 'utf8');
                            // Strip preamble before ## UI Components (mirrors eval-golden-prompts.mjs)
                            const snippetContent = snippetRaw.replace(/^[\s\S]*?(?=^## UI Components)/m, '');
                            const plan = core.planUiCore(body.prompt).text;
                            const systemPrompt = `You are a React developer working on a project that uses Tale UI components.\n\n${snippetContent}\n\n---\n\nWhen asked to create UI, generate a single self-contained TypeScript/TSX code block.\nRules:\n- Return ONLY the code block, no explanation before or after.\n- Export a named function called \`Example\`: \`export function Example() { ... }\`.\n- Use Tale UI components exclusively — no raw HTML layout elements where a Tale UI layout component exists.\n- Use only documented Tale UI imports and namespace subcomponents from the reference above; never invent aliases, default imports, or subparts such as \`Card.Title\` or \`Select.Option\` unless they are explicitly documented.\n- Do not include stylesheet imports.\n- Do not add inline styles for visual treatment (colors, borders, shadows) — only layout styles (width, height, spacing) are permitted.\n- Follow all import, composition, and pitfall rules listed above exactly.`;
                            const generatePrompt = `User request:\n${body.prompt}\n\n${plan}\n\nGenerate the TSX now. Use the plan's recommended components, exact documented parts, and pitfalls as hard constraints.`;
                            const provider = body.provider ?? 'claude';
                            const result = await providers.callProvider(generatePrompt, {
                                provider,
                                model: body.model ?? (provider === 'claude' ? 'sonnet' : undefined),
                                systemPrompt,
                                maxTurns: body.maxTurns ?? 10,
                                straicoApiKey: body.straicoApiKey ?? '',
                            });
                            return json(res, 200, { text: extractCode(result) });
                        }
                        catch (err) {
                            const message = err instanceof Error ? err.message : String(err);
                            return json(res, 500, { error: message });
                        }
                    }
                    // ── POST /api/a2ui/chat ─────────────────────────────────────────────
                    if (req.method === 'POST' && url.pathname === '/api/a2ui/chat') {
                        const body = JSON.parse(await readBody(req));
                        const messages = normalizeA2UIChatMessages(body.messages);
                        if (messages.length === 0) {
                            return json(res, 400, { error: 'messages required' });
                        }
                        try {
                            const providers = await getProviders();
                            const provider = body.provider ?? 'claude';
                            const result = await providers.callProvider(buildA2UIChatPrompt(messages), {
                                provider,
                                model: body.model ?? (provider === 'claude' ? 'sonnet' : undefined),
                                systemPrompt: getA2UISystemPrompt(),
                                maxTurns: body.maxTurns ?? 10,
                                straicoApiKey: body.straicoApiKey ?? '',
                            });
                            return json(res, 200, { text: result, truncated: false });
                        }
                        catch (err) {
                            const message = err instanceof Error ? err.message : String(err);
                            return json(res, 500, { error: message });
                        }
                    }
                    // ── POST /api/write-pitfall ──────────────────────────────────────────
                    if (req.method === 'POST' && url.pathname === '/api/write-pitfall') {
                        const body = JSON.parse(await readBody(req));
                        const { component, slug, summary, detail = '', antiPattern, fix, completeExample = '', } = body;
                        if (!component || !slug || !summary || !antiPattern || !fix) {
                            return json(res, 400, {
                                error: 'component, slug, summary, antiPattern, and fix are required',
                            });
                        }
                        const docPath = join(DOCS_COMPONENTS, `${component
                            .toLowerCase()
                            .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
                            .replace(/^-/, '')}.md`);
                        // Write the pitfall block
                        const block = buildPitfallBlock({
                            slug,
                            summary,
                            detail,
                            antiPattern,
                            fix,
                            completeExample,
                        });
                        let rollbackContent = null;
                        try {
                            rollbackContent = readFileSync(docPath, 'utf8');
                            insertPitfallIntoDoc(docPath, block);
                        }
                        catch (err) {
                            const message = err instanceof Error ? err.message : String(err);
                            return json(res, 500, { error: `Failed to write doc: ${message}` });
                        }
                        // Run registry:generate + pitfalls:shape
                        const cmd = 'pnpm';
                        const genArgs = ['--dir', ROOT, 'registry:generate'];
                        const shapeArgs = ['--dir', ROOT, 'pitfalls:shape'];
                        try {
                            await new Promise((resolve, reject) => {
                                execFile(cmd, genArgs, { cwd: ROOT }, (err, stdout, stderr) => {
                                    if (err) {
                                        reject(new Error(`registry:generate failed:\n${stderr || stdout}`));
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            });
                            await new Promise((resolve, reject) => {
                                execFile(cmd, shapeArgs, { cwd: ROOT }, (err, stdout, stderr) => {
                                    if (err) {
                                        reject(new Error(`pitfalls:shape failed:\n${stderr || stdout}`));
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            });
                            return json(res, 200, { ok: true, block });
                        }
                        catch (err) {
                            // Roll back the file write
                            if (rollbackContent !== null) {
                                writeFileSync(docPath, rollbackContent, 'utf8');
                            }
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
                        const child = spawn('pnpm', ['--dir', ROOT, 'pitfalls:shape'], {
                            cwd: ROOT,
                            shell: false,
                        });
                        const send = (line) => res.write(`data: ${JSON.stringify(line)}\n\n`);
                        child.stdout.on('data', (d) => {
                            for (const line of d.toString().split('\n')) {
                                if (line) {
                                    send(line);
                                }
                            }
                        });
                        child.stderr.on('data', (d) => {
                            for (const line of d.toString().split('\n')) {
                                if (line) {
                                    send(line);
                                }
                            }
                        });
                        child.on('close', (code) => {
                            send(`__done__:${code}`);
                            res.end();
                        });
                        return;
                    }
                    next();
                }
                catch (err) {
                    if (!res.headersSent) {
                        json(res, 500, { error: err instanceof Error ? err.message : String(err) });
                    }
                }
            });
        },
    };
}
