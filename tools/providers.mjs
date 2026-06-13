/**
 * providers.mjs
 *
 * Shared LLM provider utilities used by the Studio dev-server plugin.
 * The eval runner (eval-golden-prompts.mjs) has its own CLI-coupled copy
 * of these functions; this module is the parameterised version for
 * non-eval contexts (Studio /api/generate endpoint).
 */

import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { join , dirname, resolve } from 'path';
import { tmpdir } from 'os';
import { execFileSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..');

// Claude model shorthands → full model IDs
const CLAUDE_MODEL_ALIASES = {
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
  haiku: 'claude-haiku-4-5-20251001',
};

export function findClaude() {
  const candidates = [
    process.env.CLAUDE_PATH,
    join(process.env.HOME ?? '', '.local/bin/claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {return p;}
  }

  try {
    const result = execFileSync('which', ['claude'], { encoding: 'utf8' }).trim();
    if (result) {return result;}
  } catch {
    /* not on PATH */
  }
  return null;
}

/**
 * Call the Claude CLI with the Tale UI MCP server enabled.
 * Returns the raw text response (generated TSX or other output).
 *
 * @param {string} prompt - the user's prompt
 * @param {object} opts
 * @param {string} [opts.model]           - model shorthand or full ID (default: 'sonnet')
 * @param {string} [opts.systemPrompt]    - system prompt text (written to a temp file)
 * @param {string} [opts.mcpConfigPath]   - path to .mcp.json (default: ROOT/.mcp.json)
 * @param {number} [opts.maxTurns]        - max agent turns (default: 5)
 * @param {number} [opts.timeoutMs]       - timeout in ms (default: 180000)
 */
export function callClaudeWithMcp(prompt, opts = {}) {
  const {
    model: rawModel = 'sonnet',
    systemPrompt = '',
    mcpConfigPath = join(ROOT, '.mcp.json'),
    maxTurns = 10,
    timeoutMs = 180_000,
  } = opts;

  const model = CLAUDE_MODEL_ALIASES[rawModel] ?? rawModel;
  const claudeBin = findClaude();
  if (!claudeBin) {throw new Error('Claude CLI not found. Install via https://claude.ai/claude-code or set CLAUDE_PATH.');}
  if (!existsSync(mcpConfigPath)) {throw new Error(`MCP config not found at ${mcpConfigPath}`);}

  const systemFile = join(tmpdir(), `tale-ui-studio-system-${process.pid}-${Date.now()}.md`);
  writeFileSync(systemFile, systemPrompt, 'utf8');

  return new Promise((resolve, reject) => {
    const proc = spawn(claudeBin, [
      '--print',
      '--no-session-persistence',
      '--model', model,
      '--append-system-prompt-file', systemFile,
      '--output-format', 'json',
      '--mcp-config', mcpConfigPath,
      '--max-turns', String(maxTurns),
      '--allowedTools', 'mcp__tale-ui__plan_ui',
      '--allowedTools', 'mcp__tale-ui__get_component',
      '--allowedTools', 'mcp__tale-ui__search_components',
      '--allowedTools', 'mcp__tale-ui__list_components',
      '--allowedTools', 'mcp__tale-ui__get_recipe',
      '--allowedTools', 'mcp__tale-ui__search_docs',
      '--allowedTools', 'mcp__tale-ui__validate_code',
      '--',
      prompt,
    ], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => { stdout += d; });
    proc.stderr.on('data', d => { stderr += d; });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Claude CLI timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.on('close', code => {
      clearTimeout(timer);
      try { unlinkSync(systemFile); } catch { /* ignore cleanup errors */ }

      if (code !== 0) {
        return reject(new Error(
          `Claude CLI exited with code ${code}\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
        ));
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.is_error) {
          return reject(new Error(
            `Claude CLI reported is_error: ${parsed.result ?? 'no message'}\nstderr: ${stderr.slice(0, 500)}`,
          ));
        }
        resolve(parsed.result ?? '');
      } catch {
        reject(new Error(
          `Failed to parse Claude output (exit ${code})\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
        ));
      }
    });

    proc.on('error', err => {
      clearTimeout(timer);
      try { unlinkSync(systemFile); } catch { /* ignore */ }
      reject(err);
    });
  });
}
