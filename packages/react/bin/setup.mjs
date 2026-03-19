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
   node_modules/@tale-ui/react/docs/{name}.md
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

6. **Dark mode must persist between refreshes.** Every new app must:

   a. Include this inline script in \`<head>\` before any CSS or JS to avoid a flash of wrong theme:
   \`\`\`html
   <script>
     (function() {
       var mode = localStorage.getItem('color-mode')
         || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-color-mode', mode);
     })();
   </script>
   \`\`\`

   b. Use \`ColorModeToggle\` for the toggle UI — it handles \`localStorage\` and \`data-color-mode\` automatically:
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
