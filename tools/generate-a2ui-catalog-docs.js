#!/usr/bin/env node

/**
 * generate-a2ui-catalog-docs.js
 *
 * Generates catalog reference tables in A2UI documentation from the
 * live catalog.ts and icon-registry.ts source files. Uses sentinel
 * markers (<!-- BEGIN:TAG --> / <!-- END:TAG -->) to splice generated
 * content into manually-authored doc files.
 *
 * Usage:
 *   node tools/generate-a2ui-catalog-docs.js          # regenerate
 *   node tools/generate-a2ui-catalog-docs.js --check   # exit 1 if stale
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'packages/a2ui/src/catalog.ts');
const ICON_REGISTRY_PATH = path.join(ROOT, 'packages/a2ui/src/icon-registry.ts');

const isCheck = process.argv.includes('--check');

/* ─── Source Parsing ──────────────────────────────────────────────────────── */

function extractCatalogEntries(source) {
  const entries = [];
  let currentCategory = 'Uncategorized';

  // Split by the section comment markers: /* ── Category ──...── */
  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const catMatch = lines[i].match(/\/\*\s*──\s*(.+?)\s*──/);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    // Match catalog entry: `  TypeName: {`
    const entryMatch = lines[i].match(/^\s{2}(\w+):\s*\{$/);
    if (!entryMatch) continue;

    const typeName = entryMatch[1];

    // Collect all lines for this entry until we reach `} as CatalogEntry`
    let component = '?';
    let adapterProps = [];
    let j = i + 1;

    while (j < lines.length) {
      const line = lines[j];

      // End of entry marker
      if (line.match(/^\s*\}\s*as\s+CatalogEntry/)) break;

      // Extract component name
      const compMatch = line.match(/component:\s*(\S+),/);
      if (compMatch) component = compMatch[1];

      // Extract props from adapter body: props.XYZ
      for (const propMatch of line.matchAll(/props\.(\w+)/g)) {
        if (!adapterProps.includes(propMatch[1])) {
          adapterProps.push(propMatch[1]);
        }
      }

      j++;
    }

    entries.push({ typeName, component, adapterProps, category: currentCategory });
  }

  return entries;
}

function extractIconNames(source) {
  const names = [];
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) return names;
  for (const match of mapMatch[1].matchAll(/^\s+'?([\w-]+)'?\s*:/gm)) {
    names.push(match[1]);
  }
  return names;
}

function extractUsageHints(source) {
  const hints = [];
  const fnMatch = source.match(/function mapTextHint[\s\S]*?\n\}/);
  if (!fnMatch) return hints;
  for (const match of fnMatch[0].matchAll(/case '([^']+)':\s*return\s*\{\s*variant:\s*'([^']+)',\s*size:\s*'([^']+)',\s*as:\s*'([^']+)'/g)) {
    hints.push({ hint: match[1], variant: match[2], size: match[3], element: match[4] });
  }
  return hints;
}

const { PROP_VALUES, PROP_VALUE_OVERRIDES, SUB_PARTS } = require('./a2ui-catalog-metadata.js');

/* ─── Table Generation ────────────────────────────────────────────────────── */

/** Get allowed values string for a prop, considering per-type overrides. */
function propAllowedValues(typeName, propName) {
  return PROP_VALUE_OVERRIDES[`${typeName}.${propName}`] || PROP_VALUES[propName] || '';
}

/**
 * Generate detailed 3-column tables (Type | Prop | Allowed Values)
 * grouped by category. Used for system-prompt.md.
 */
function generateSystemPromptTables(entries) {
  const categories = new Map();
  for (const e of entries) {
    if (!categories.has(e.category)) categories.set(e.category, []);
    categories.get(e.category).push(e);
  }

  const sections = [];
  for (const [cat, items] of categories) {
    const rows = [];
    for (const e of items) {
      if (e.adapterProps.length === 0) {
        rows.push(`| **${e.typeName}** | (none) | |`);
      } else {
        for (let i = 0; i < e.adapterProps.length; i++) {
          const p = e.adapterProps[i];
          const vals = propAllowedValues(e.typeName, p);
          const typeCell = i === 0 ? `**${e.typeName}**` : '';
          rows.push(`| ${typeCell} | \`${p}\` | ${vals} |`);
        }
      }
    }

    sections.push(`### ${cat}\n\n| Type | Prop | Allowed Values |\n|------|------|---------------|\n${rows.join('\n')}`);
  }

  return sections.join('\n\n');
}

/** Generate catalog mapping table for integration guide */
function generateCatalogTable(entries) {
  const rows = entries.map((e) => {
    const props = e.adapterProps.length > 0
      ? e.adapterProps.map((p) => `\`${p}\``).join(', ')
      : '--';
    return `| \`${e.typeName}\` | \`${e.component}\` | ${props} |`;
  });

  return `| A2UI Type | Tale UI Component | Key A2UI Props |\n|-----------|-------------------|----------------|\n${rows.join('\n')}`;
}

/** Generate usageHint mapping table */
function generateHintTable(hints) {
  const rows = hints.map((h) =>
    `| \`${h.hint}\` | ${h.variant} (${h.size}) | \`${h.element}\` |`
  );
  return `| Hint | Maps to | HTML element |\n|------|---------|-------------|\n${rows.join('\n')}`;
}

/* ─── Splice ──────────────────────────────────────────────────────────────── */

/**
 * Replace content between sentinel markers in a file.
 * Markers: <!-- BEGIN:TAG -->\n...\n<!-- END:TAG -->
 */
function splice(content, tag, newContent) {
  const beginMarker = `<!-- BEGIN:${tag} -->`;
  const endMarker = `<!-- END:${tag} -->`;
  const beginIdx = content.indexOf(beginMarker);
  const endIdx = content.indexOf(endMarker);

  if (beginIdx === -1 || endIdx === -1) {
    return null; // markers not found
  }

  const before = content.slice(0, beginIdx + beginMarker.length);
  const after = content.slice(endIdx);

  return `${before}\n${newContent}\n${after}`;
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

function main() {
  const catalogSource = fs.readFileSync(CATALOG_PATH, 'utf8');
  const iconSource = fs.readFileSync(ICON_REGISTRY_PATH, 'utf8');

  const entries = extractCatalogEntries(catalogSource);
  const iconNames = extractIconNames(iconSource);
  const usageHints = extractUsageHints(catalogSource);

  if (entries.length === 0) {
    console.error('ERROR: Could not extract any catalog entries from catalog.ts');
    process.exit(1);
  }

  const standardCount = entries.filter((e) => !SUB_PARTS.has(e.typeName)).length;

  const targets = [
    {
      file: path.join(ROOT, 'packages/a2ui/src/agent/system-prompt.md'),
      splices: [
        { tag: 'A2UI_CATALOG_TABLES', content: generateSystemPromptTables(entries) },
      ],
    },
    {
      file: path.join(ROOT, 'docs/a2ui-integration.md'),
      splices: [
        { tag: 'A2UI_CATALOG_TABLES', content: generateCatalogTable(entries) + '\n\n**Text `usageHint` values:**\n\n' + generateHintTable(usageHints) },
      ],
    },
  ];

  let stale = false;

  for (const target of targets) {
    const relPath = path.relative(ROOT, target.file);
    if (!fs.existsSync(target.file)) {
      console.log(`SKIP: ${relPath} does not exist`);
      continue;
    }

    let content = fs.readFileSync(target.file, 'utf8');
    let changed = false;

    for (const { tag, content: newContent } of target.splices) {
      const result = splice(content, tag, newContent);
      if (result === null) {
        console.log(`SKIP: ${relPath} missing sentinel markers for ${tag}`);
        continue;
      }
      if (result !== content) {
        content = result;
        changed = true;
      }
    }

    if (changed) {
      if (isCheck) {
        console.log(`STALE: ${relPath} — run \`node tools/generate-a2ui-catalog-docs.js\` to update`);
        stale = true;
      } else {
        fs.writeFileSync(target.file, content);
        console.log(`UPDATED: ${relPath}`);
      }
    } else {
      console.log(`OK: ${relPath}`);
    }
  }

  // Summary
  console.log(`\nCatalog: ${entries.length} entries (${standardCount} standard), ${iconNames.length} icons, ${usageHints.length} usageHints`);

  if (isCheck && stale) {
    process.exit(1);
  }
}

main();
