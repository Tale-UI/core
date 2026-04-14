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

Before generating or modifying component code, you MUST:

1. **Read the setup guide** in \`node_modules/@tale-ui/react/README.md\` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Check the JSDoc \`@example\` on each component's .d.ts export** before using it. Every component's Root export includes a \`@example\` block showing the correct import path, sub-parts, and composition pattern. Read the \`.d.ts\` file for each component you intend to use:

   \`\`\`
   node_modules/@tale-ui/react/esm/{name}/{Name}.styled.d.ts
   \`\`\`

   The \`@example\` block at the top of each file is the authoritative usage reference.

3. **For deeper details** (all props, all variants, advanced patterns), read the local component doc:

   \`\`\`
   node_modules/@tale-ui/react/docs/components/{name}.md
   \`\`\`

4. **Do not guess component APIs.** Always check the \`@example\` block first. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures.

5. **Common pitfalls to avoid:**
   - \`Table\`, \`Drawer\`, \`Meter\`, \`ProgressBar\`, \`NumberField\`, etc. are namespace objects — always use \`<Component.Root>\`, never \`<Component>\` directly.
   - \`Drawer.Backdrop\` must be a self-closing sibling of \`Drawer.Popup\` (\`<Drawer.Backdrop />\`), never a wrapper around it.
   - \`Meter.Value\` and \`ProgressBar.Value\` need children text (e.g. \`<Meter.Value>60%</Meter.Value>\`), not self-closing.
   - \`NumberField.Increment\` and \`NumberField.Decrement\` render their own \`+\`/\`−\` icons — use them self-closing.
   - \`ToggleButtonGroup\` requires \`aria-label\` or \`aria-labelledby\` for accessibility.
   - Dark mode: always set \`data-color-mode\` to \`"dark"\` or \`"light"\` — never remove the attribute to switch to light mode.
   - \`Calendar.GridHeader\` passes day name strings, not dates — use \`Calendar.GridHeaderCell\` inside it, not \`Calendar.Cell\`. Reserve \`Calendar.Cell\` for \`Calendar.GridBody\`.
   - \`Calendar.Heading\` must have no vertical margin or padding — do not add spacing to it or wrap it in an element that adds margins (e.g. \`<h2>\`).
   - Do NOT nest \`ColorSlider\` inside \`ColorPicker.Root\` — the context does not propagate and causes "Unknown color channel: hue" at runtime. Use \`ColorArea\` and \`ColorSlider\` as standalone components with shared \`useState\`.
   - \`Checkbox.Indicator\` does NOT render a checkmark on its own — you must provide a child SVG icon.
   - \`AlertDialog.Trigger\`, \`Drawer.Trigger\`, and \`Drawer.Close\` do NOT auto-apply \`tale-button\` — you must add both \`tale-button\` and the variant class explicitly.
   - \`Dialog.Backdrop\` must **wrap** \`Dialog.Popup\` (opposite of Drawer).
   - Trigger components (\`Tooltip.Trigger\`, \`Menu.Trigger\`, \`Popover.Trigger\`, \`AlertDialog.Trigger\`, \`Drawer.Trigger\`, \`Dialog.Trigger\`, etc.) render their own \`<button>\` — never nest a \`<Button>\` inside them. Apply button styling via \`className="tale-button tale-button--{variant}"\` directly on the trigger.
   - \`Select.Root\` owns the \`placeholder\` prop — do NOT put \`placeholder\` on \`Select.Value\`.
   - **Token size suffixes:** Tale UI uses \`-s\`, \`-m\`, \`-l\` (NOT Bootstrap-style \`-sm\`, \`-md\`, \`-lg\`). Full scale: \`4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl\`. Example: \`--space-m\` not \`--space-md\`.
   - **Layout utilities:** Tale UI provides layout utility classes (\`.flex--row\`, \`.flex--col\`, \`.gap--m\`, \`.grid--3\`, \`.center--hv\`, etc.) — use these instead of writing manual \`display: flex\` / \`gap\` declarations.

6. **Dark mode must persist between refreshes.** Every new app must:

   a. Add \`class="tale-ui"\` and \`data-color-mode\` to \`<html>\`:
   \`\`\`html
   <html class="tale-ui" data-color-mode="light">
   \`\`\`

   b. Include this inline script in \`<head>\` before any CSS or JS to avoid a flash of wrong theme:
   \`\`\`html
   <script>
     (function() {
       var mode = localStorage.getItem('color-mode')
         || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-color-mode', mode);
     })();
   </script>
   \`\`\`

   c. Use \`ColorModeToggle\` for the toggle UI — it handles \`localStorage\` and \`data-color-mode\` automatically:
   \`\`\`tsx
   import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

   <ColorModeToggle />
   \`\`\`
`;

// ── Find project root ────────────────────────────────────────────────────────
// Walk up from cwd looking for the consuming project's root.
// Look for package.json OR node_modules (npm may auto-create package.json
// after postinstall runs, so node_modules is a more reliable marker).

function findProjectRoot(startDir) {
  let dir = startDir;
  while (true) {
    const hasPackageJson = fs.existsSync(path.join(dir, 'package.json'));
    const hasNodeModules = fs.existsSync(path.join(dir, 'node_modules'));
    if ((hasPackageJson || hasNodeModules) && !dir.includes('node_modules')) {
      return dir;
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
    console.log('✓ CLAUDE.md already contains Tale UI instructions. Skipping.');
  } else {
    // Append to existing file
    const separator = existing.endsWith('\n') ? '\n' : '\n\n';
    fs.writeFileSync(claudeMdPath, existing + separator + SNIPPET);
    console.log('✓ Appended Tale UI instructions to existing CLAUDE.md');
    console.log(`  → ${claudeMdPath}`);
  }
} else {
  // Create new file
  fs.writeFileSync(claudeMdPath, `# Project Instructions\n\n${SNIPPET}`);
  console.log('✓ Created CLAUDE.md with Tale UI instructions');
  console.log(`  → ${claudeMdPath}`);
}

// ── Write .mcp.json ──────────────────────────────────────────────────────────

const MCP_SERVER_KEY = 'tale-ui';
const MCP_SERVER_CONFIG = {
  command: 'node',
  args: ['./node_modules/@tale-ui/react/mcp-server.mjs'],
};

const mcpJsonPath = path.join(projectRoot, '.mcp.json');

let mcpJson = { mcpServers: {} };
if (fs.existsSync(mcpJsonPath)) {
  try {
    mcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
    if (!mcpJson.mcpServers) mcpJson.mcpServers = {};
  } catch { /* ignore parse errors, overwrite */ }
}

if (mcpJson.mcpServers[MCP_SERVER_KEY]) {
  console.log('✓ .mcp.json already contains the tale-ui MCP server. Nothing to do.');
} else {
  mcpJson.mcpServers[MCP_SERVER_KEY] = MCP_SERVER_CONFIG;
  fs.writeFileSync(mcpJsonPath, JSON.stringify(mcpJson, null, 2) + '\n');
  console.log('✓ Configured tale-ui MCP server in .mcp.json');
  console.log(`  → ${mcpJsonPath}`);
}
