/**
 * providers.mjs
 *
 * Shared LLM provider utilities used by the Studio dev-server plugin.
 * The eval runner has related CLI-coupled code; this module is the
 * parameterised version for non-eval Studio contexts.
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { tmpdir } from 'os';
import { execFileSync, spawn, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
  buildCodexExecArgs,
  buildCodexMcpConfigOverride,
  isProviderQuotaMessage,
  providerQuotaError,
} from './eval-golden-prompts-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..');

const DEFAULT_MCP_CONFIG_PATH = join(ROOT, '.mcp.json');
const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
const DEFAULT_STRAICO_CHAT_URL = 'https://api.straico.com/v0/chat/completions';
const DEFAULT_STRAICO_MODELS_URL = 'https://api.straico.com/v2/models';

// Claude model shorthands -> full model IDs used by the Claude Code CLI.
export const CLAUDE_MODEL_ALIASES = {
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
  haiku: 'claude-haiku-4-5-20251001',
};

// Codex shorthands -> OpenAI model IDs used by the Codex CLI.
export const CODEX_MODEL_ALIASES = {
  'o4-mini': 'o4-mini',
  o3: 'o3',
  'o3-mini': 'o3-mini',
  'gpt-4.1': 'gpt-4.1',
  'gpt-4.1-mini': 'gpt-4.1-mini',
  'gpt-4.1-nano': 'gpt-4.1-nano',
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-5': 'gpt-5',
  'gpt-5-mini': 'gpt-5-mini',
  'gpt-5.4': 'gpt-5.4',
  'gpt-5.4-mini': 'gpt-5.4-mini',
};

// Straico shorthands -> Straico model strings (provider/model-name format).
export const STRAICO_MODEL_ALIASES = {
  sonnet: 'anthropic/claude-sonnet-4.5',
  'sonnet-4': 'anthropic/claude-sonnet-4',
  'sonnet-4.5': 'anthropic/claude-sonnet-4.5',
  opus: 'claude-opus-4-5',
  'opus-4': 'anthropic/claude-opus-4',
  'opus-4.5': 'claude-opus-4-5',
  haiku: 'claude-haiku-4-5-5',
  'gpt-4o': 'openai/gpt-4o-2024-11-20',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  'gpt-4.1': 'openai/gpt-4.1',
  'gpt-4.1-mini': 'openai/gpt-4.1-mini',
  'gpt-4.1-nano': 'openai/gpt-4.1-nano',
  'gpt-5': 'openai/gpt-5',
  'gpt-5-mini': 'openai/gpt-5-mini',
  o3: 'o3-2025-04-16',
  'o4-mini': 'openai/o4-mini',
  'gemini-flash': 'google/gemini-2.5-flash-lite',
  'gemini-pro': 'google/gemini-3.1-pro-preview',
  deepseek: 'deepseek/deepseek-chat-v3.1',
  'deepseek-r1': 'deepseek/deepseek-r1',
  llama4: 'meta-llama/llama-4-maverick',
  grok4: 'x-ai/grok-4',
  grok3: 'x-ai/grok-3-beta',
};

const CLAUDE_MODELS = [
  { id: 'sonnet', label: 'Claude Sonnet', source: 'configured' },
  { id: 'opus', label: 'Claude Opus', source: 'configured' },
  { id: 'haiku', label: 'Claude Haiku', source: 'configured' },
];

function withProvider(provider, model) {
  return {
    provider,
    value: `${provider}:${model.id}`,
    ...model,
  };
}

function providerStatus(id, label, available, detail, extra = {}) {
  return { id, label, available, detail, ...extra };
}

function execText(file, args, opts = {}) {
  return execFileSync(file, args, {
    encoding: 'utf8',
    timeout: opts.timeoutMs ?? 10_000,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

function execCombinedText(file, args, opts = {}) {
  const result = spawnSync(file, args, {
    encoding: 'utf8',
    timeout: opts.timeoutMs ?? 10_000,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
  if (result.error) {
    throw result.error;
  }
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `exit ${result.status}`).trim());
  }
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
}

function readJsonCommand(file, args, opts = {}) {
  const text = execText(file, args, opts);
  return JSON.parse(text);
}

function stringifyError(err) {
  return err instanceof Error ? err.message : String(err);
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function findOnPath(bin) {
  try {
    const result = execText('which', [bin], { timeoutMs: 3000 });
    if (result) {
      return result;
    }
  } catch {
    /* not on PATH */
  }
  return null;
}

export function findClaude() {
  const candidates = [
    process.env.CLAUDE_PATH,
    join(process.env.HOME ?? '', '.local/bin/claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {
      return p;
    }
  }
  return findOnPath('claude');
}

export function findCodex() {
  const candidates = [
    process.env.CODEX_PATH,
    join(process.env.HOME ?? '', '.local/bin/codex'),
    '/usr/local/bin/codex',
    '/opt/homebrew/bin/codex',
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {
      return p;
    }
  }
  return findOnPath('codex');
}

export function findOllama() {
  const candidates = [
    process.env.OLLAMA_PATH,
    join(process.env.HOME ?? '', '.local/bin/ollama'),
    '/usr/local/bin/ollama',
    '/opt/homebrew/bin/ollama',
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {
      return p;
    }
  }
  return findOnPath('ollama');
}

function getOllamaBaseUrl() {
  const host = process.env.OLLAMA_HOST ?? DEFAULT_OLLAMA_BASE_URL;
  return /^https?:\/\//.test(host) ? host.replace(/\/$/, '') : `http://${host.replace(/\/$/, '')}`;
}

function getClaudeAuthDetail(claudeBin) {
  try {
    const status = readJsonCommand(claudeBin, ['auth', 'status', '--json'], { timeoutMs: 5000 });
    if (status?.loggedIn) {
      return status.subscriptionType ? `signed in (${status.subscriptionType})` : 'signed in';
    }
    return 'not signed in';
  } catch {
    return 'CLI installed';
  }
}

function getCodexAuthDetail(codexBin) {
  try {
    const status = execCombinedText(codexBin, ['login', 'status'], { timeoutMs: 5000 });
    return status || 'CLI installed';
  } catch {
    return 'CLI installed';
  }
}

function normalizeCodexModel(model) {
  if (!isRecord(model) || typeof model.slug !== 'string') {
    return null;
  }
  return {
    id: model.slug,
    label: typeof model.display_name === 'string' ? model.display_name : model.slug,
    source: model.supported_in_api === false ? 'codex-cli' : 'codex-api',
  };
}

function listCodexModels(codexBin) {
  const catalog = readJsonCommand(codexBin, ['debug', 'models'], { timeoutMs: 15_000 });
  const rawModels = Array.isArray(catalog?.models) ? catalog.models : [];
  return rawModels
    .filter((model) => model?.visibility === 'list')
    .map(normalizeCodexModel)
    .filter(Boolean)
    .map((model) => withProvider('codex', model));
}

function normalizeOllamaModel(model) {
  if (!isRecord(model) || typeof model.name !== 'string') {
    return null;
  }
  const details = [];
  if (typeof model.size === 'number') {
    details.push(`${Math.round(model.size / 1024 / 1024 / 1024)} GB`);
  }
  if (typeof model.modified_at === 'string') {
    details.push(`modified ${model.modified_at.slice(0, 10)}`);
  }
  return {
    id: model.name,
    label: details.length > 0 ? `${model.name} (${details.join(', ')})` : model.name,
    source: 'ollama',
  };
}

async function fetchJson(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15_000);
  try {
    const response = await fetch(url, { ...opts, signal: controller.signal });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${response.status}: ${body.slice(0, 300)}`);
    }
    return await response.json();
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(`Request timed out: ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseOllamaList(text) {
  const lines = text.split('\n').slice(1);
  return lines
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean)
    .map((name) => withProvider('ollama', { id: name, label: name, source: 'ollama-cli' }));
}

async function listOllamaModels() {
  const baseUrl = getOllamaBaseUrl();
  try {
    const json = await fetchJson(`${baseUrl}/api/tags`, { timeoutMs: 5000 });
    const rawModels = Array.isArray(json?.models) ? json.models : [];
    return rawModels
      .map(normalizeOllamaModel)
      .filter(Boolean)
      .map((model) => withProvider('ollama', model));
  } catch (apiErr) {
    const ollamaBin = findOllama();
    if (!ollamaBin) {
      throw apiErr;
    }
    try {
      return parseOllamaList(execText(ollamaBin, ['list'], { timeoutMs: 10_000 }));
    } catch {
      throw apiErr;
    }
  }
}

function normalizeStraicoModel(model) {
  if (!isRecord(model)) {
    return null;
  }
  if (typeof model.model_type === 'string' && model.model_type !== 'chat') {
    return null;
  }

  const id =
    typeof model.id === 'string'
      ? model.id
      : typeof model.model === 'string'
        ? model.model
        : typeof model.slug === 'string'
          ? model.slug
          : null;
  if (!id) {
    return null;
  }

  const label =
    typeof model.name === 'string'
      ? model.name
      : typeof model.display_name === 'string'
        ? model.display_name
        : id;
  const provider =
    typeof model.provider === 'string'
      ? model.provider
      : id.includes('/')
        ? id.split('/')[0]
        : 'straico';
  return {
    id,
    label: provider === 'straico' ? label : `${label} (${provider})`,
    source: 'straico',
  };
}

async function listStraicoModels(apiKey) {
  if (!apiKey) {
    return [];
  }
  const json = await fetchJson(DEFAULT_STRAICO_MODELS_URL, {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
    timeoutMs: 20_000,
  });
  const rawModels = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.models)
      ? json.models
      : Array.isArray(json)
        ? json
        : [];
  return rawModels
    .map(normalizeStraicoModel)
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((model) => withProvider('straico', model));
}

export async function listAvailableModels(opts = {}) {
  const { straicoApiKey = '' } = opts;
  const providers = [];
  const models = [];
  const errors = {};

  const claudeBin = findClaude();
  providers.push(
    providerStatus(
      'claude',
      'Claude Code',
      Boolean(claudeBin),
      claudeBin ? getClaudeAuthDetail(claudeBin) : 'CLI not found',
    ),
  );
  if (claudeBin) {
    models.push(...CLAUDE_MODELS.map((model) => withProvider('claude', model)));
  }

  const codexBin = findCodex();
  providers.push(
    providerStatus(
      'codex',
      'Codex',
      Boolean(codexBin),
      codexBin ? getCodexAuthDetail(codexBin) : 'CLI not found',
    ),
  );
  if (codexBin) {
    try {
      models.push(...listCodexModels(codexBin));
    } catch (err) {
      errors.codex = stringifyError(err);
    }
  }

  try {
    const ollamaModels = await listOllamaModels();
    providers.push(
      providerStatus(
        'ollama',
        'Ollama',
        true,
        `${ollamaModels.length} local model${ollamaModels.length === 1 ? '' : 's'}`,
      ),
    );
    models.push(...ollamaModels);
  } catch (err) {
    errors.ollama = stringifyError(err);
    providers.push(providerStatus('ollama', 'Ollama', false, 'not reachable'));
  }

  if (straicoApiKey) {
    try {
      const straicoModels = await listStraicoModels(straicoApiKey);
      providers.push(
        providerStatus(
          'straico',
          'Straico',
          true,
          `${straicoModels.length} model${straicoModels.length === 1 ? '' : 's'}`,
          { requiresApiKey: true },
        ),
      );
      models.push(...straicoModels);
    } catch (err) {
      errors.straico = stringifyError(err);
      providers.push(
        providerStatus('straico', 'Straico', false, 'API key rejected or model list unavailable', {
          requiresApiKey: true,
        }),
      );
    }
  } else {
    providers.push(
      providerStatus('straico', 'Straico', false, 'API key required', { requiresApiKey: true }),
    );
  }

  return { providers, models, errors };
}

function resolveProviderModel(provider, rawModel) {
  if (provider === 'claude') {
    return CLAUDE_MODEL_ALIASES[rawModel] ?? rawModel ?? CLAUDE_MODEL_ALIASES.sonnet;
  }
  if (provider === 'codex') {
    return CODEX_MODEL_ALIASES[rawModel] ?? rawModel ?? 'gpt-5.4';
  }
  if (provider === 'straico') {
    return STRAICO_MODEL_ALIASES[rawModel] ?? rawModel;
  }
  return rawModel;
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
    mcpConfigPath = DEFAULT_MCP_CONFIG_PATH,
    maxTurns = 10,
    timeoutMs = 180_000,
  } = opts;

  const model = resolveProviderModel('claude', rawModel);
  const claudeBin = findClaude();
  if (!claudeBin) {
    throw new Error(
      'Claude CLI not found. Install via https://claude.ai/claude-code or set CLAUDE_PATH.',
    );
  }
  if (!existsSync(mcpConfigPath)) {
    throw new Error(`MCP config not found at ${mcpConfigPath}`);
  }

  const systemFile = join(tmpdir(), `tale-ui-studio-system-${process.pid}-${Date.now()}.md`);
  writeFileSync(systemFile, systemPrompt, 'utf8');

  return new Promise((resolve, reject) => {
    const proc = spawn(
      claudeBin,
      [
        '--print',
        '--no-session-persistence',
        '--model',
        model,
        '--append-system-prompt-file',
        systemFile,
        '--output-format',
        'json',
        '--mcp-config',
        mcpConfigPath,
        '--max-turns',
        String(maxTurns),
        '--allowedTools',
        'mcp__tale-ui__plan_ui',
        '--allowedTools',
        'mcp__tale-ui__get_component',
        '--allowedTools',
        'mcp__tale-ui__search_components',
        '--allowedTools',
        'mcp__tale-ui__list_components',
        '--allowedTools',
        'mcp__tale-ui__get_recipe',
        '--allowedTools',
        'mcp__tale-ui__search_docs',
        '--allowedTools',
        'mcp__tale-ui__validate_code',
        '--',
        prompt,
      ],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
    );

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => {
      stdout += d;
    });
    proc.stderr.on('data', (d) => {
      stderr += d;
    });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Claude CLI timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      try {
        unlinkSync(systemFile);
      } catch {
        /* ignore cleanup errors */
      }

      const outputDetails = [stdout, stderr].filter(Boolean).join('\n');
      if (isProviderQuotaMessage(outputDetails)) {
        return reject(providerQuotaError(outputDetails.slice(0, 500), { provider: 'Claude' }));
      }
      if (code !== 0) {
        return reject(
          new Error(
            `Claude CLI exited with code ${code}\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
          ),
        );
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.is_error) {
          return reject(
            new Error(
              `Claude CLI reported is_error: ${parsed.result ?? 'no message'}\nstderr: ${stderr.slice(0, 500)}`,
            ),
          );
        }
        resolve(parsed.result ?? '');
      } catch {
        reject(
          new Error(
            `Failed to parse Claude output (exit ${code})\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
          ),
        );
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      try {
        unlinkSync(systemFile);
      } catch {
        /* ignore */
      }
      reject(err);
    });
  });
}

export function callCodexWithMcp(prompt, opts = {}) {
  const {
    model: rawModel = 'gpt-5.4',
    systemPrompt = '',
    mcpConfigPath = DEFAULT_MCP_CONFIG_PATH,
    timeoutMs = 180_000,
  } = opts;

  const model = resolveProviderModel('codex', rawModel);
  const codexBin = findCodex();
  if (!codexBin) {
    throw new Error('Codex CLI not found. Install it or set CODEX_PATH.');
  }

  const outputFile = join(tmpdir(), `tale-ui-studio-codex-${process.pid}-${Date.now()}.txt`);
  const mcpConfigOverride = existsSync(mcpConfigPath)
    ? buildCodexMcpConfigOverride(mcpConfigPath)
    : null;
  const fullPrompt = `${systemPrompt}\n\n---\n\n${prompt}`;

  return new Promise((resolve, reject) => {
    const proc = spawn(codexBin, buildCodexExecArgs({ model, outputFile, mcpConfigOverride }), {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdin.write(fullPrompt);
    proc.stdin.end();

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => {
      stdout += d;
    });
    proc.stderr.on('data', (d) => {
      stderr += d;
    });

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`Codex CLI timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      try {
        const outputText = existsSync(outputFile) ? readFileSync(outputFile, 'utf8').trim() : '';
        const details = [outputText, stdout, stderr].filter(Boolean).join('\n');
        try {
          unlinkSync(outputFile);
        } catch {
          /* ignore cleanup errors */
        }
        if (isProviderQuotaMessage(details)) {
          return reject(providerQuotaError(details.slice(0, 500), { provider: 'Codex' }));
        }
        if (code !== 0) {
          return reject(
            new Error(
              `Codex CLI exited with code ${code}\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
            ),
          );
        }
        if (!outputText) {
          return reject(
            new Error(
              `Codex did not write output\nstderr: ${stderr.slice(0, 500)}\nstdout: ${stdout.slice(0, 500)}`,
            ),
          );
        }
        resolve(outputText);
      } catch (err) {
        reject(err);
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      try {
        unlinkSync(outputFile);
      } catch {
        /* ignore cleanup errors */
      }
      reject(err);
    });
  });
}

export async function callOllama(prompt, opts = {}) {
  const { model: rawModel, systemPrompt = '', timeoutMs = 180_000 } = opts;
  if (!rawModel) {
    throw new Error('Ollama model required. Select a local Ollama model first.');
  }

  const json = await fetchJson(`${getOllamaBaseUrl()}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: rawModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { temperature: 0.2 },
    }),
    timeoutMs,
  });

  const content = json?.message?.content ?? json?.response ?? '';
  if (!content) {
    throw new Error(`Ollama returned an empty response: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return content;
}

export async function callStraico(prompt, opts = {}) {
  const { model: rawModel, systemPrompt = '', straicoApiKey = '', timeoutMs = 120_000 } = opts;
  if (!straicoApiKey) {
    throw new Error('Straico API key required.');
  }
  if (!rawModel) {
    throw new Error('Straico model required.');
  }

  const model = resolveProviderModel('straico', rawModel);
  const json = await fetchJson(DEFAULT_STRAICO_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${straicoApiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
    timeoutMs,
  });

  const completion = json?.data?.completion ?? json?.completion ?? json;
  const content =
    completion?.choices?.[0]?.message?.content ??
    completion?.choices?.[0]?.text ??
    json?.choices?.[0]?.message?.content ??
    '';
  if (!content) {
    throw new Error(`Straico returned an empty response: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return content;
}

export function callProvider(prompt, opts = {}) {
  const provider = opts.provider ?? 'claude';
  if (provider === 'claude') {
    return callClaudeWithMcp(prompt, opts);
  }
  if (provider === 'codex') {
    return callCodexWithMcp(prompt, opts);
  }
  if (provider === 'ollama') {
    return callOllama(prompt, opts);
  }
  if (provider === 'straico') {
    return callStraico(prompt, opts);
  }
  throw new Error(`Unknown provider "${provider}".`);
}
