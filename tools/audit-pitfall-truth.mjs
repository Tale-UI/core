#!/usr/bin/env node
/**
 * Pitfall Truth Audit
 *
 * Verifies that pitfall claims are supported by the current component
 * implementation. Unlike the consistency audit, this script checks for
 * contradictions between pitfall wording and source behavior.
 *
 * Current checks cover:
 *   1. Absolute "do not add `<Component.Part>`" claims for parts that exist
 *   2. Shared trigger claims that say all listed triggers render `<button>`
 *   3. Shared nested-button claims applied to triggers that are not buttons
 *   4. "Use self-closing" / "do not pass children" claims for parts that
 *      explicitly support custom children with a fallback icon/value
 *   5. Known unsupported absolute guidance that is not source-enforced
 *
 * Run: node tools/audit-pitfall-truth.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(scriptDir, '..');
const REGISTRY_PATH = path.join(ROOT, 'registry/components.json');
const PITFALLS_PATH = path.join(ROOT, 'registry/pitfalls.json');
const REACT_SRC = path.join(ROOT, 'packages/react/src');
const DOCS_COMPONENTS_DIR = path.join(ROOT, 'docs/components');
const SHARED_PITFALLS_DOC = path.join(ROOT, 'docs/pitfalls.md');

const PASCAL_OVERRIDES = {
  'csp-provider': 'CSPProvider',
  'i18n-provider': 'I18nProvider',
  'toggle-group': 'ToggleButtonGroup',
  'merge-props': 'mergeProps',
};

const UNSUPPORTED_ABSOLUTES = {
  'card-root-not-direct-row-child':
    'This is layout guidance, but the current `Row` and `Card.Root` implementations do not enforce or reject this pattern.',
};

/**
 * Hard-coded slug → required summary token table.
 * Each entry asserts that the named slug's summary MUST contain the given token
 * (case-insensitive). Used to catch cases where the summary has been replaced
 * by an injected "Import X from..." bullet that doesn't match the slug's intent.
 */
const SLUG_SUMMARY_TOKENS = {
  'icon-button-aria-label-required': 'aria-label',
  'link-no-isexternal-prop': 'isExternal',
  'spinner-label-is-aria-not-visible': 'label',
};

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function kebabToPascal(kebab) {
  if (PASCAL_OVERRIDES[kebab]) {
    return PASCAL_OVERRIDES[kebab];
  }

  return kebab
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join('');
}

function mapRefTypeToTag(refType) {
  if (!refType) {
    return null;
  }
  if (refType.includes('HTMLButtonElement')) {
    return 'button';
  }
  if (refType.includes('HTMLDivElement')) {
    return 'div';
  }
  if (refType.includes('HTMLSpanElement')) {
    return 'span';
  }
  if (refType.includes('HTMLInputElement')) {
    return 'input';
  }
  if (refType.includes('HTMLLabelElement')) {
    return 'label';
  }
  if (refType.includes('SVGSVGElement')) {
    return 'svg';
  }
  if (refType.includes('HTMLElement')) {
    return 'element';
  }

  return null;
}

function findStyledFile(slug) {
  const dir = path.join(REACT_SRC, slug);
  const pascal = kebabToPascal(slug);
  const candidates = [
    path.join(dir, `${pascal}.styled.tsx`),
    path.join(dir, `${pascal}.tsx`),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function buildPartInfo(styledContent, componentName, partName) {
  const escapedName = escapeRegExp(componentName);
  const escapedPart = escapeRegExp(partName);
  const pattern = new RegExp(
    `(?:const|export const)\\s+(\\w+)\\s*=\\s*React\\.forwardRef<([^,>]+),[\\s\\S]*?\\.displayName\\s*=\\s*['"]${escapedName}\\.${escapedPart}['"]`,
    'm',
  );
  const match = styledContent.match(pattern);

  if (!match) {
    return { refType: null, htmlTag: null, hasChildrenFallback: false };
  }

  const block = match[0];
  const refType = match[2].trim();

  return {
    refType,
    htmlTag: mapRefTypeToTag(refType),
    hasChildrenFallback: /children\s*\?\?/.test(block),
  };
}

function resolveQualifiedPart(component, token) {
  if (!token) {
    return null;
  }

  if (token.startsWith(`${component.name}.`)) {
    const part = token.slice(component.name.length + 1);
    return (component.parts || []).includes(part) ? part : null;
  }

  if (/^[A-Z]/.test(token) && (component.parts || []).includes(token)) {
    return token;
  }
  return null;
}

function getTargetParts(component, entry) {
  const text = buildText(entry);
  const parts = new Set();

  for (const match of text.matchAll(/`([^`]+)`/g)) {
    const resolved = resolveQualifiedPart(component, match[1]);
    if (resolved) {
      parts.add(resolved);
    }
  }

  for (const match of text.matchAll(/<([A-Z][A-Za-z0-9]+)\.(\w+)/g)) {
    if (match[1] === component.name) {
      parts.add(match[2]);
    }
  }

  return [...parts];
}

function buildText(entry) {
  return [
    entry.summary || '',
    entry.detail || '',
    ...(entry.antiPatterns || []),
    ...(entry.fixes || []),
  ].join('\n');
}

function isAbsoluteChildrenClaim(text) {
  return /is self-closing|use self-closing|use it self-closing|do NOT pass|do not pass|reserve it for the corner|reserve it for the icon-only/i.test(text);
}

function hasButtonTriggerClaim(text) {
  return /render their own [`'<]*button[`'>]* element|render their own <button> element/i.test(text);
}

function hasNestedButtonReason(text) {
  return /button>\s*inside\s*a\s*<button>|button inside a button/i.test(text);
}

function getComponentDocPath(slug) {
  return path.join(DOCS_COMPONENTS_DIR, `${slug}.md`);
}

const registry = JSON.parse(readFile(REGISTRY_PATH));
const pitfalls = JSON.parse(readFile(PITFALLS_PATH) || '{"crossComponentPitfalls":[],"generalConventions":[]}');

const componentMap = new Map(registry.components.map(component => [component.name, component]));
const styledContentCache = new Map();
const partInfoCache = new Map();
const issues = [];

function getStyledContent(slug) {
  if (!styledContentCache.has(slug)) {
    const styledPath = findStyledFile(slug);
    styledContentCache.set(slug, styledPath ? readFile(styledPath) : null);
  }
  return styledContentCache.get(slug);
}

function getPartInfo(component, partName) {
  const cacheKey = `${component.slug}:${partName}`;
  if (!partInfoCache.has(cacheKey)) {
    const styledContent = getStyledContent(component.slug);
    partInfoCache.set(
      cacheKey,
      styledContent
        ? buildPartInfo(styledContent, component.name, partName)
        : { refType: null, htmlTag: null, hasChildrenFallback: false },
    );
  }
  return partInfoCache.get(cacheKey);
}

function recordIssue({ kind, id, message, file }) {
  issues.push({ kind, id, message, file });
}

for (const component of registry.components) {
  for (const entry of component.pitfalls || []) {
    const text = buildText(entry);
    const docPath = getComponentDocPath(component.slug);

    if (UNSUPPORTED_ABSOLUTES[entry.id]) {
      recordIssue({
        kind: 'pitfall',
        id: entry.id,
        file: docPath,
        message: UNSUPPORTED_ABSOLUTES[entry.id],
      });
    }

    const doNotAddMatch = text.match(/Do not add `([^`]+)`/i);
    if (doNotAddMatch) {
      const forbiddenPart = resolveQualifiedPart(component, doNotAddMatch[1]);
      if (forbiddenPart) {
        recordIssue({
          kind: 'pitfall',
          id: entry.id,
          file: docPath,
          message: `Claims "${doNotAddMatch[1]}" should not be added, but that part is exported by the component.`,
        });
      }
    }

    const targetParts = getTargetParts(component, entry);
    if (isAbsoluteChildrenClaim(text)) {
      for (const partName of targetParts) {
        const info = getPartInfo(component, partName);
        if (info.hasChildrenFallback) {
          recordIssue({
            kind: 'pitfall',
            id: entry.id,
            file: docPath,
            message: `${component.name}.${partName} supports custom children with a fallback, so the pitfall wording is too absolute.`,
          });
        }
      }
    }
  }
}

for (const entry of [...pitfalls.crossComponentPitfalls, ...pitfalls.generalConventions]) {
  const text = buildText(entry);
  const appliesTo = entry.appliesTo || [];

  if (appliesTo.length === 0) {
    continue;
  }

  if (hasButtonTriggerClaim(text) || hasNestedButtonReason(text)) {
    const nonButtonTriggers = [];

    for (const componentName of appliesTo) {
      const component = componentMap.get(componentName);
      if (!component) {
        continue;
      }
      const triggerInfo = getPartInfo(component, 'Trigger');
      if (triggerInfo.htmlTag && triggerInfo.htmlTag !== 'button') {
        nonButtonTriggers.push(`${componentName}.Trigger (${triggerInfo.htmlTag})`);
      }
    }

    if (nonButtonTriggers.length > 0) {
      recordIssue({
        kind: 'cross-pitfall',
        id: entry.id,
        file: SHARED_PITFALLS_DOC,
        message: `Reasoning assumes button triggers, but these triggers are not buttons: ${nonButtonTriggers.join(', ')}.`,
      });
    }
  }
}

// ── Slug/summary token assertions (SLUG_SUMMARY_TOKENS table) ───────────────
for (const component of registry.components) {
  for (const pitfall of (component.pitfalls || [])) {
    const expectedToken = SLUG_SUMMARY_TOKENS[pitfall.id];
    if (!expectedToken) continue;
    const summaryLower = (pitfall.summary || '').toLowerCase();
    if (!summaryLower.includes(expectedToken.toLowerCase())) {
      const docFile = path.join(DOCS_COMPONENTS_DIR, `${component.name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`).replace(/^-/, '')}.md`);
      recordIssue({
        kind: 'slug-summary-mismatch',
        id: pitfall.id,
        file: docFile,
        message: `Summary "${pitfall.summary.slice(0, 80)}" does not contain expected token "${expectedToken}" implied by slug.`,
      });
    }
  }
}

if (issues.length === 0) {
  const componentPitfallCount = registry.components.reduce((count, component) => count + (component.pitfalls?.length || 0), 0);
  const sharedPitfallCount = (pitfalls.crossComponentPitfalls?.length || 0) + (pitfalls.generalConventions?.length || 0);
  process.stdout.write(
    `✅ Pitfall truth OK - checked ${componentPitfallCount} component pitfalls and ${sharedPitfallCount} shared pitfalls.\n`,
  );
  process.exit(0);
}

console.error(`❌ Pitfall truth audit found ${issues.length} issue(s):\n`);
for (const issue of issues) {
  console.error(`- [${issue.kind}] ${issue.id}: ${issue.message}`);
  console.error(`  ${issue.file}`);
}
process.exit(1);
