#!/usr/bin/env node
/**
 * tale-ui-setup
 *
 * Adds Tale UI agent instructions to the consuming project's CLAUDE.md.
 * Run once after installing @tale-ui/react:
 *
 *   npx tale-ui-setup
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const MARKER = '## UI Components (@tale-ui/react)';

const SNIPPET = `## UI Components (@tale-ui/react)

This project uses \`@tale-ui/react\` for all UI components.

**IMPORTANT: Do NOT read .d.ts type definition files to learn component APIs.** They do not show correct import paths, composition patterns, or required wrapper components, and will lead to broken code. Always fetch the official documentation instead.

Before generating or modifying component code, you MUST:

1. **Read the setup guide** in \`node_modules/@tale-ui/react/README.md\` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Fetch the component's documentation** before using it. Each component has a detailed guide with correct imports, sub-parts, props, and working examples. Fetch the doc for every component you intend to use:

   \`\`\`
   https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/{name}.md
   \`\`\`

   For example, before using Button, Select, and DatePicker, fetch all three:
   - \`https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/button.md\`
   - \`https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/select.md\`
   - \`https://raw.githubusercontent.com/Tale-UI/core/main/docs/components/date-picker.md\`

   Available components: accordion, alert-dialog, autocomplete, avatar, breadcrumbs, button, calendar, checkbox, checkbox-group, color-area, color-field, color-picker, color-slider, color-swatch, color-swatch-picker, color-wheel, combobox, context-menu, date-field, date-picker, date-range-picker, dialog, disclosure, drawer, drop-zone, field, fieldset, file-trigger, form, grid-list, input, link, menu, menubar, meter, navigation-menu, number-field, popover, preview-card, progress-bar, radio, range-calendar, scroll-area, search-field, select, separator, slider, switch, table, tabs, tag-group, text-area, text-field, time-field, toggle-button, toolbar, tooltip, tree.

3. **Do not guess component APIs.** Fetch the documentation first — every time. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures that are harder to debug than reading the docs upfront.
`;

// ── Find project root ────────────────────────────────────────────────────────
// Walk up from cwd looking for package.json (the consuming project's root).

function findProjectRoot(startDir) {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      // Skip node_modules — keep walking up
      if (!dir.includes('node_modules')) {
        return dir;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // filesystem root
    dir = parent;
  }
  return startDir; // fallback to cwd
}

const projectRoot = findProjectRoot(process.cwd());

// Skip in workspace/monorepo development (e.g. pnpm install in the tale-ui repo itself)
const projectPkgPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(projectPkgPath)) {
  try {
    const projectPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
    if (projectPkg.name === '@tale-ui/react' || projectPkg.name === '@tale-ui/monorepo') {
      process.exit(0);
    }
  } catch { /* ignore parse errors */ }
}

const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

// ── Check existing CLAUDE.md ─────────────────────────────────────────────────

if (fs.existsSync(claudeMdPath)) {
  const existing = fs.readFileSync(claudeMdPath, 'utf8');

  if (existing.includes(MARKER)) {
    console.log('✓ CLAUDE.md already contains Tale UI instructions. Nothing to do.');
    process.exit(0);
  }

  // Append to existing file
  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(claudeMdPath, existing + separator + SNIPPET);
  console.log('✓ Appended Tale UI instructions to existing CLAUDE.md');
} else {
  // Create new file
  fs.writeFileSync(claudeMdPath, `# Project Instructions\n\n${SNIPPET}`);
  console.log('✓ Created CLAUDE.md with Tale UI instructions');
}

console.log(`  → ${claudeMdPath}`);
