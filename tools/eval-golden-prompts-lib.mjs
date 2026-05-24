import { readFileSync } from 'fs';
import { execFileSync } from 'child_process';

export const CODEX_MCP_SERVER_NAME = 'tale-ui';

export class ProviderQuotaError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProviderQuotaError';
  }
}

export function isProviderQuotaMessage(message = '') {
  const text = String(message).toLowerCase();
  return (
    /\byou'?re out of (?:extra )?usage\b/.test(text) ||
    /\bout of (?:extra )?usage\b/.test(text) ||
    /\b(?:usage|quota|credit|billing) (?:limit|cap|quota) (?:reached|exceeded|exhausted)\b/.test(
      text,
    ) ||
    /\b(?:reached|exceeded|exhausted) (?:your )?(?:usage|quota|credit|billing) (?:limit|cap|quota)\b/.test(
      text,
    ) ||
    /\binsufficient[_ -]quota\b/.test(text) ||
    /\bout of credits?\b/.test(text) ||
    /\bno more (?:claude|codex|provider )?quota\b/.test(text) ||
    /\bresets? \d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/.test(text)
  );
}

export function isProviderQuotaError(error) {
  return error instanceof ProviderQuotaError || isProviderQuotaMessage(error?.message ?? error);
}

export function providerQuotaError(message, context = {}) {
  const prefixParts = [context.provider, context.phase, context.slug].filter(Boolean);
  const prefix = prefixParts.length > 0 ? `${prefixParts.join(' ')}: ` : '';
  return new ProviderQuotaError(`${prefix}provider quota exhausted: ${String(message).trim()}`);
}

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

function normalizeStdioMcpServer(server, serverName, contextLabel) {
  if (!server || typeof server !== 'object' || Array.isArray(server)) {
    throw new Error(`${contextLabel} requires "${serverName}" in .mcp.json to be an object.`);
  }
  if ('url' in server) {
    throw new Error(
      `${contextLabel} only supports stdio MCP servers here; "${serverName}" in .mcp.json must use "command" and "args", not "url".`,
    );
  }
  if (typeof server.command !== 'string' || !server.command.trim()) {
    throw new Error(
      `${contextLabel} requires "${serverName}.command" in .mcp.json to be a non-empty string.`,
    );
  }

  const normalized = {
    command: server.command,
    args: [],
  };

  if ('args' in server) {
    if (!Array.isArray(server.args) || server.args.some((item) => typeof item !== 'string')) {
      throw new Error(
        `${contextLabel} requires "args" to be an array of strings for "${serverName}" in .mcp.json.`,
      );
    }
    normalized.args = server.args;
  }

  if ('env' in server) {
    if (!server.env || typeof server.env !== 'object' || Array.isArray(server.env)) {
      throw new Error(
        `${contextLabel} requires "${serverName}.env" in .mcp.json to be an object when present.`,
      );
    }
    for (const [key, value] of Object.entries(server.env)) {
      if (typeof value !== 'string') {
        throw new Error(
          `${contextLabel} requires "${serverName}.env.${key}" in .mcp.json to be a string.`,
        );
      }
    }
    normalized.env = server.env;
  }

  if ('cwd' in server) {
    if (typeof server.cwd !== 'string' || !server.cwd.trim()) {
      throw new Error(
        `${contextLabel} requires "${serverName}.cwd" in .mcp.json to be a non-empty string when present.`,
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

  const normalizedServer = normalizeStdioMcpServer(server, CODEX_MCP_SERVER_NAME, 'Codex MCP');
  return `mcp_servers=${toTomlLiteral({ [CODEX_MCP_SERVER_NAME]: normalizedServer })}`;
}

export function loadTaleUiMcpServerSpec(mcpConfigPath) {
  let rawConfig;
  try {
    rawConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
  } catch (err) {
    throw new Error(`Local MCP could not read ${mcpConfigPath}: ${err.message}`);
  }

  const server = rawConfig?.mcpServers?.[CODEX_MCP_SERVER_NAME];
  if (!server) {
    throw new Error(`Local MCP requires "${CODEX_MCP_SERVER_NAME}" to exist in ${mcpConfigPath}.`);
  }

  return normalizeStdioMcpServer(server, CODEX_MCP_SERVER_NAME, 'Local MCP');
}

/* ─── Deterministic scorers (shared by eval-golden-prompts.mjs + eval-fix-review.mjs) ── */

export const ALLOWED_IMPORT_PREFIXES = [
  '@tale-ui/react',
  '@tale-ui/charts',
  'react',
  'lucide-react',
  '@internationalized/',
];

const ALLOWED_LAYOUT_STYLE_PROPS = new Set([
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'bottom',
  'display',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'gap',
  'gridArea',
  'gridAutoColumns',
  'gridAutoFlow',
  'gridAutoRows',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'gridTemplateAreas',
  'gridTemplateColumns',
  'gridTemplateRows',
  'height',
  'inset',
  'insetBlock',
  'insetBlockEnd',
  'insetBlockStart',
  'insetInline',
  'insetInlineEnd',
  'insetInlineStart',
  'justifyContent',
  'justifyItems',
  'justifySelf',
  'left',
  'margin',
  'marginBlock',
  'marginBlockEnd',
  'marginBlockStart',
  'marginBottom',
  'marginInline',
  'marginInlineEnd',
  'marginInlineStart',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'overflowX',
  'overflowY',
  'padding',
  'paddingBlock',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingBottom',
  'paddingInline',
  'paddingInlineEnd',
  'paddingInlineStart',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'placeContent',
  'placeItems',
  'placeSelf',
  'position',
  'right',
  'top',
  'whiteSpace',
  'width',
  'zIndex',
]);

const INLINE_STYLE_PROMPT_BYPASS_RE =
  /\b(inline styles?|style prop|style props|style=\{|custom css|custom styles?|custom classes?|className)\b/i;

/**
 * Extract the first fenced code block (tsx/ts/jsx/js) from text,
 * or fall back to everything from the first `import` onwards.
 */
export function extractCode(text) {
  // Accept tsx/ts/jsx/js/typescript/javascript, optional whitespace before language,
  // CRLF or LF, optional leading indentation, and bare ``` fences.
  const fenced = text.match(
    /^[ \t]*```[ \t]*(?:tsx?|jsx?|typescript|javascript)?[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/m,
  );
  if (fenced) return fenced[1].trim();
  // Fallback: slice from first import, but only if an import actually exists.
  // Returning prose as "code" produces confusing L2 "missing components" failures.
  const importIdx = text.indexOf('import ');
  if (importIdx !== -1) return text.slice(importIdx).trim();
  // No code block and no import → return empty string so callers can detect it.
  return '';
}

/**
 * L1 policy supplement: disallow non-layout inline styles on JSX components.
 * Layout-only sizing/positioning styles remain allowed.
 * @param {string} code
 * @param {{ prompt?: string }} opts
 */
export function checkComponentStylePolicy(code, { prompt = '' } = {}) {
  if (INLINE_STYLE_PROMPT_BYPASS_RE.test(prompt)) {
    return { pass: true, errors: [] };
  }

  const errors = [];
  const componentStyleRegex =
    /<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)[^>]*?\bstyle=\{\{([\s\S]*?)\}\}[^>]*?>/g;

  for (const match of code.matchAll(componentStyleRegex)) {
    const tag = match[1];
    const styleBody = match[2];
    const styleProps = [
      ...new Set(
        [...styleBody.matchAll(/(?:['"])?([A-Za-z_$][\w$-]*)(?:['"])?\s*:/g)].map((m) => m[1]),
      ),
    ];

    if (styleProps.length === 0) {
      continue;
    }

    const disallowedProps = styleProps.filter((prop) => !ALLOWED_LAYOUT_STYLE_PROPS.has(prop));

    if (disallowedProps.length === 0) {
      continue;
    }

    const line = code.slice(0, match.index ?? 0).split('\n').length;
    errors.push(
      `Line ${line}: ${tag} has non-layout inline styles (${disallowedProps.join(', ')}). ` +
        'Use Tale UI defaults, variants, or wrapper CSS instead.',
    );
  }

  return { pass: errors.length === 0, errors };
}

/**
 * L1: Validity — run validate-generated.mjs on the code.
 * @param {string} code
 * @param {{ root: string, validatorPath: string, prompt?: string }} opts
 */
export function checkL1(code, { root, validatorPath, prompt = '' }) {
  const stylePolicy = checkComponentStylePolicy(code, { prompt });

  try {
    const result = execFileSync(process.execPath, [validatorPath, '--code', code, '--json'], {
      cwd: root,
      timeout: 30000,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const parsed = JSON.parse(result);
    const errors = [
      ...(parsed.registryErrors ?? []),
      ...(parsed.typescriptErrors ?? []).map((e) => `Line ${e.line}: ${e.message}`),
      ...stylePolicy.errors,
    ];
    return { pass: errors.length === 0, errors };
  } catch (err) {
    try {
      const parsed = JSON.parse(err.stdout || '{}');
      const errors = [
        ...(parsed.registryErrors ?? []),
        ...(parsed.typescriptErrors ?? []).map((e) => `Line ${e.line}: ${e.message}`),
        ...stylePolicy.errors,
      ];
      return { pass: errors.length === 0, errors };
    } catch {
      return {
        pass: false,
        errors: [...stylePolicy.errors, (err.stdout || err.message || 'Validator failed').trim()],
      };
    }
  }
}

/**
 * L2: Component coverage — every tag must appear as an identifier in the code.
 * @param {string} code
 * @param {string[]} tags
 */
export function checkL2(code, tags) {
  const missing = tags.filter((tag) => !code.includes(tag));
  return { pass: missing.length === 0, missing };
}

/**
 * L3: Import cleanliness — no imports from outside the allowed prefixes.
 * @param {string} code
 * @param {{ allowedPrefixes?: string[] }} opts
 */
export function checkL3(code, { allowedPrefixes = ALLOWED_IMPORT_PREFIXES } = {}) {
  const importLines = [...code.matchAll(/^import\s+.*?\s+from\s+['"]([^'"]+)['"]/gm)];
  const forbidden = importLines
    .map((m) => m[1])
    .filter((pkg) => !allowedPrefixes.some((prefix) => pkg.startsWith(prefix)));
  return { pass: forbidden.length === 0, forbidden };
}

/**
 * Run all three deterministic checks against a code string.
 * @param {string} code
 * @param {{ tags: string[], root: string, validatorPath: string, prompt?: string }} opts
 * @returns {{ allPass: boolean, l1: object, l2: object, l3: object }}
 */
export function scoreCode(code, { tags, root, validatorPath, prompt = '' }) {
  const l1 = checkL1(code, { root, validatorPath, prompt });
  const l2 = checkL2(code, tags);
  const l3 = checkL3(code);
  return { allPass: l1.pass && l2.pass && l3.pass, l1, l2, l3 };
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
