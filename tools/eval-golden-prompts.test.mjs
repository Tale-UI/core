import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

import { buildCodexExecArgs, buildCodexMcpConfigOverride } from './eval-golden-prompts-lib.mjs';

function withTempMcpConfig(config, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'tale-ui-codex-mcp-'));
  const filePath = join(dir, '.mcp.json');
  writeFileSync(filePath, JSON.stringify(config, null, 2));
  try {
    return fn(filePath);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('buildCodexMcpConfigOverride builds a repo-local override for the tale-ui MCP server', () => {
  withTempMcpConfig(
    {
      mcpServers: {
        'tale-ui': {
          command: 'node',
          args: ['tools/mcp-server.mjs'],
          env: {
            TALE_UI_MODE: 'eval',
          },
        },
      },
    },
    (filePath) => {
      const override = buildCodexMcpConfigOverride(filePath);
      assert.equal(
        override,
        'mcp_servers={"tale-ui" = {command = "node", args = ["tools/mcp-server.mjs"], env = {TALE_UI_MODE = "eval"}}}',
      );
    },
  );
});

test('buildCodexMcpConfigOverride rejects missing tale-ui server entries', () => {
  withTempMcpConfig(
    {
      mcpServers: {
        other: {
          command: 'node',
          args: ['tools/other.mjs'],
        },
      },
    },
    (filePath) => {
      assert.throws(() => buildCodexMcpConfigOverride(filePath), /requires "tale-ui" to exist/);
    },
  );
});

test('buildCodexMcpConfigOverride rejects unsupported MCP server shapes', () => {
  withTempMcpConfig(
    {
      mcpServers: {
        'tale-ui': {
          url: 'http://localhost:9000/mcp',
        },
      },
    },
    (filePath) => {
      assert.throws(() => buildCodexMcpConfigOverride(filePath), /only supports stdio MCP servers/);
    },
  );
});

test('buildCodexExecArgs includes MCP config overrides only for MCP runs', () => {
  const baseArgs = buildCodexExecArgs({
    model: 'gpt-5.4',
    outputFile: '/tmp/out.txt',
  });
  assert.deepEqual(baseArgs, [
    'exec',
    '--model',
    'gpt-5.4',
    '--output-last-message',
    '/tmp/out.txt',
    '--ephemeral',
    '-s',
    'read-only',
    '-',
  ]);

  const mcpArgs = buildCodexExecArgs({
    model: 'gpt-5.4',
    outputFile: '/tmp/out.txt',
    mcpConfigOverride:
      'mcp_servers={"tale-ui" = {command = "node", args = ["tools/mcp-server.mjs"]}}',
  });
  assert.deepEqual(mcpArgs, [
    'exec',
    '--model',
    'gpt-5.4',
    '--output-last-message',
    '/tmp/out.txt',
    '--ephemeral',
    '-s',
    'read-only',
    '-c',
    'mcp_servers={"tale-ui" = {command = "node", args = ["tools/mcp-server.mjs"]}}',
    '-',
  ]);
});
