#!/usr/bin/env node

/**
 * audit-a2ui-catalog-docs.js
 *
 * Cross-checks A2UI documentation against the live catalog source.
 * Catches: wrong component counts, missing types in docs, wrong icon counts,
 * missing usageHint values in reference tables.
 *
 * No file modifications — purely diagnostic. Exit 1 if any check fails.
 *
 * Usage:
 *   node tools/audit-a2ui-catalog-docs.js
 *   node tools/audit-a2ui-catalog-docs.js --verbose
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'packages/a2ui/src/catalog.ts');
const ICON_REGISTRY_PATH = path.join(ROOT, 'packages/a2ui/src/icon-registry.ts');

const DOCS_TO_CHECK = [
  path.join(ROOT, 'packages/a2ui/src/agent/system-prompt.md'),
  path.join(ROOT, 'docs/a2ui-integration.md'),
  path.join(ROOT, 'docs/consumer-claude-md-snippet.md'),
  path.join(ROOT, 'packages/a2ui/README.md'),
];

const verbose = process.argv.includes('--verbose');

/* ─── Source Parsing ──────────────────────────────────────────────────────── */

function extractCatalogKeys(source) {
  const keys = [];
  for (const match of source.matchAll(/^\s{2}(\w+):\s*\{$/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

/** Standard types = all catalog keys minus Card sub-parts */
function getStandardTypes(keys) {
  const subParts = new Set([
    'CardHeader', 'CardBody', 'CardFooter', 'ListItem', 'RadioOption', 'SelectItem',
    'AvatarImage', 'AvatarFallback',
    'DisclosureTrigger', 'DisclosurePanel',
    'AccordionItem', 'AccordionHeader', 'AccordionTrigger', 'AccordionPanel',
    'MenuTrigger', 'MenuPopover', 'MenuItem', 'MenuSeparator',
  ]);
  return keys.filter((k) => !subParts.has(k));
}

function extractIconCount(source) {
  const mapMatch = source.match(/const iconMap[^{]*\{([\s\S]*?)\n\};/);
  if (!mapMatch) return 0;
  return (mapMatch[1].match(/^\s+'?[\w-]+'?\s*:/gm) || []).length;
}

function extractUsageHints(source) {
  const hints = [];
  for (const match of source.matchAll(/case '([^']+)':/g)) {
    hints.push(match[1]);
  }
  return hints;
}

/**
 * Extract adapter bodies and check that compound components
 * assemble their required sub-parts via React.createElement.
 */
function extractAdapterBodies(source) {
  const entries = [];
  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const entryMatch = lines[i].match(/^\s{2}(\w+):\s*\{$/);
    if (!entryMatch) continue;
    const typeName = entryMatch[1];
    let body = '';
    let j = i + 1;
    while (j < lines.length) {
      if (lines[j].match(/^\s*\}\s*as\s+CatalogEntry/)) break;
      body += lines[j] + '\n';
      j++;
    }
    entries.push({ typeName, body });
  }
  return entries;
}

/**
 * Compound components that MUST have specific sub-parts assembled
 * in their adapter's children. Maps A2UI type to required createElement
 * patterns that must appear in the adapter body.
 */
const REQUIRED_SUBPARTS = {
  Switch: ['Switch.Thumb'],
  Checkbox: ['Checkbox.Indicator'],
  TextInput: ['TextField.Label', 'TextField.Input'],
  Select: ['Select.Trigger', 'Select.Value', 'Select.Popover', 'Select.ListBox'],
  RadioOption: ['Radio.Indicator'],
  Banner: ['Banner.Title', 'Banner.Description'],
  TextAreaInput: ['TextArea.Label', 'TextArea.TextArea'],
  NumberInput: ['NumberField.Label', 'NumberField.Group', 'NumberField.Input', 'NumberField.Increment', 'NumberField.Decrement'],
  SliderInput: ['Slider.Label', 'Slider.Output', 'Slider.Track', 'Slider.Thumb'],
  SearchInput: ['SearchField.Label', 'SearchField.Input', 'SearchField.ClearButton'],
  MenuPopover: ['Menu.MenuList'],
};

/* ─── Checks ──────────────────────────────────────────────────────────────── */

const errors = [];
const info = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  } else if (verbose) {
    info.push(`  ✓ ${message}`);
  }
}

function main() {
  const catalogSource = fs.readFileSync(CATALOG_PATH, 'utf8');
  const iconSource = fs.readFileSync(ICON_REGISTRY_PATH, 'utf8');

  const allKeys = extractCatalogKeys(catalogSource);
  const standardKeys = getStandardTypes(allKeys);
  const iconCount = extractIconCount(iconSource);
  const usageHints = extractUsageHints(catalogSource);

  if (verbose) {
    console.log(`Source: ${allKeys.length} catalog entries (${standardKeys.length} standard), ${iconCount} icons, ${usageHints.length} usageHints\n`);
  }

  for (const docPath of DOCS_TO_CHECK) {
    const relPath = path.relative(ROOT, docPath);
    if (!fs.existsSync(docPath)) {
      errors.push(`${relPath}: file does not exist`);
      continue;
    }

    const content = fs.readFileSync(docPath, 'utf8');
    if (verbose) console.log(`Checking ${relPath}...`);

    // Check 1: All standard catalog types mentioned
    for (const key of standardKeys) {
      // Look for the type name in backticks, bold, or as a table cell
      const pattern = new RegExp(`\\b${key}\\b`);
      check(
        pattern.test(content),
        `${relPath}: mentions catalog type "${key}"`,
      );
    }

    // Check 2: Counts — look for patterns like "21 standard" or "21 A2UI"
    const countMatches = content.match(/(\d+)\s+(?:standard\s+)?A2UI\s+(?:standard\s+)?(?:component\s+)?types?/gi);
    if (countMatches) {
      for (const match of countMatches) {
        const num = parseInt(match.match(/(\d+)/)[1], 10);
        check(
          num === standardKeys.length,
          `${relPath}: A2UI type count ${num} matches source (${standardKeys.length})`,
        );
      }
    }

    // Check 3: Icon counts — look for patterns like "66 built-in" or "66 lucide"
    const iconCountMatches = content.match(/(\d+)\s+built-in/gi);
    if (iconCountMatches) {
      for (const match of iconCountMatches) {
        const num = parseInt(match.match(/(\d+)/)[1], 10);
        check(
          num === iconCount,
          `${relPath}: icon count ${num} matches source (${iconCount})`,
        );
      }
    }

    // Check 4: UsageHint completeness (only for files that have a hint mapping table)
    if (content.includes('| Hint | Maps to |') || content.includes('| `display-l`')) {
      for (const hint of usageHints) {
        check(
          content.includes(hint),
          `${relPath}: mentions usageHint "${hint}"`,
        );
      }
    }

    if (verbose) console.log('');
  }

  // Check 5: Compound component adapters assemble required sub-parts
  if (verbose) console.log('Checking compound component adapters...');
  const adapterBodies = extractAdapterBodies(catalogSource);
  for (const [a2uiType, requiredParts] of Object.entries(REQUIRED_SUBPARTS)) {
    const entry = adapterBodies.find((e) => e.typeName === a2uiType);
    if (!entry) {
      errors.push(`catalog.ts: missing adapter for compound type "${a2uiType}"`);
      continue;
    }
    for (const part of requiredParts) {
      check(
        entry.body.includes(part),
        `catalog.ts: "${a2uiType}" adapter assembles ${part}`,
      );
    }
  }
  if (verbose) console.log('');

  // Print results
  if (verbose) {
    for (const i of info) console.log(i);
    if (info.length > 0) console.log('');
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} issue(s) found:\n`);
    for (const e of errors) {
      console.log(`  ✗ ${e}`);
    }
    console.log('');
    process.exit(1);
  } else {
    const adapterCheckCount = Object.values(REQUIRED_SUBPARTS).flat().length;
    console.log(`✓ All A2UI catalog docs are in sync (${allKeys.length} types, ${iconCount} icons, ${usageHints.length} hints, ${adapterCheckCount} sub-part checks across ${DOCS_TO_CHECK.length} files)`);
  }
}

main();
