import { readFileSync } from 'fs';

export const CODEX_MCP_SERVER_NAME = 'tale-ui';

function formatTomlKey(key) {
  return /^[A-Za-z0-9_]+$/.test(key) ? key : JSON.stringify(key);
}

function toTomlLiteral(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map(toTomlLiteral).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .map(([key, nestedValue]) => `${formatTomlKey(key)} = ${toTomlLiteral(nestedValue)}`)
      .join(', ')}}`;
  }
  throw new Error(`Unsupported TOML literal value: ${String(value)}`);
}

function ensureStringArray(value, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(
      `Codex MCP requires "${field}" to be an array of strings for "${CODEX_MCP_SERVER_NAME}" in .mcp.json.`,
    );
  }
}

function normalizeCodexMcpServer(server) {
  if (!server || typeof server !== 'object' || Array.isArray(server)) {
    throw new Error(`Codex MCP requires "${CODEX_MCP_SERVER_NAME}" in .mcp.json to be an object.`);
  }
  if ('url' in server) {
    throw new Error(
      `Codex MCP only supports stdio MCP servers here; "${CODEX_MCP_SERVER_NAME}" in .mcp.json must use "command" and "args", not "url".`,
    );
  }
  if (typeof server.command !== 'string' || !server.command.trim()) {
    throw new Error(
      `Codex MCP requires "${CODEX_MCP_SERVER_NAME}.command" in .mcp.json to be a non-empty string.`,
    );
  }

  const normalized = {
    command: server.command,
    args: [],
  };

  if ('args' in server) {
    ensureStringArray(server.args, 'args');
    normalized.args = server.args;
  }

  if ('env' in server) {
    if (!server.env || typeof server.env !== 'object' || Array.isArray(server.env)) {
      throw new Error(
        `Codex MCP requires "${CODEX_MCP_SERVER_NAME}.env" in .mcp.json to be an object when present.`,
      );
    }
    for (const [key, value] of Object.entries(server.env)) {
      if (typeof value !== 'string') {
        throw new Error(
          `Codex MCP requires "${CODEX_MCP_SERVER_NAME}.env.${key}" in .mcp.json to be a string.`,
        );
      }
    }
    normalized.env = server.env;
  }

  if ('cwd' in server) {
    if (typeof server.cwd !== 'string' || !server.cwd.trim()) {
      throw new Error(
        `Codex MCP requires "${CODEX_MCP_SERVER_NAME}.cwd" in .mcp.json to be a non-empty string when present.`,
      );
    }
    normalized.cwd = server.cwd;
  }

  return normalized;
}

export function buildCodexMcpConfigOverride(mcpConfigPath) {
  let rawConfig;
  try {
    rawConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
  } catch (err) {
    throw new Error(`Codex MCP could not read ${mcpConfigPath}: ${err.message}`);
  }

  const server = rawConfig?.mcpServers?.[CODEX_MCP_SERVER_NAME];
  if (!server) {
    throw new Error(`Codex MCP requires "${CODEX_MCP_SERVER_NAME}" to exist in ${mcpConfigPath}.`);
  }

  const normalizedServer = normalizeCodexMcpServer(server);
  return `mcp_servers=${toTomlLiteral({ [CODEX_MCP_SERVER_NAME]: normalizedServer })}`;
}

export function buildCodexExecArgs({ model, outputFile, mcpConfigOverride = null }) {
  const args = [
    'exec',
    '--model',
    model,
    '--output-last-message',
    outputFile,
    '--ephemeral',
    '-s',
    'read-only',
  ];

  if (mcpConfigOverride) {
    args.push('-c', mcpConfigOverride);
  }

  args.push('-');
  return args;
}
