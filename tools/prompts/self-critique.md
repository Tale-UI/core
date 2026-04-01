# Tale UI — Self-Critique Prompt

Use this as a second-pass prompt to validate AI-generated Tale UI code.

---

## Prompt

You are reviewing code that uses `@tale-ui/react` components. Check it against the component registry and fix every issue found.

### Step 1: List all imports

For each `@tale-ui/react/*` import in the code, verify:
- [ ] The import path exists (check `registry/components.json` slugs)
- [ ] The imported name matches what the package exports
- [ ] Namespace components are imported as a namespace (`import { Dialog } from '...'`), not destructured parts

### Step 2: Verify component usage

For each component used in JSX:
- [ ] **Namespace vs simple** — If the component is compound (check `kind` in registry), it MUST use `.Root` / `.Trigger` / etc. If simple, it must NOT use `.Root`.
- [ ] **Props exist** — Every prop passed exists on the component (check `props` in registry or the `.d.ts` file). No invented props.
- [ ] **Required props present** — Any required props (especially `alt` on Image, `aria-label` on IconButton) are provided.
- [ ] **Correct children** — Components that need children have them; self-closing components (`Dialog.Close`, `Popover.Close`, `NumberField.Increment`) don't have unnecessary children.

### Step 3: Check common pitfalls

- [ ] No `<Button>` nested inside a Trigger (Triggers render their own button)
- [ ] `Drawer.Root` uses `open`/`onOpenChange`, not `isOpen`
- [ ] `Drawer.Backdrop` is a sibling of `Drawer.Popup`, not a wrapper
- [ ] `Dialog.Backdrop` wraps `Dialog.Popup` (opposite of Drawer)
- [ ] `Icon` receives a component ref (`icon={Heart}`), not an instance (`icon={<Heart />}`)
- [ ] `Checkbox.Indicator` has a child `<Icon icon={Check} />`
- [ ] No `.Visual` exports used in interactive UI
- [ ] `Select.Root` has `placeholder`, not `Select.Value`
- [ ] `AlertDialog` has no `Close` button (force user to choose an action)
- [ ] `Calendar.PreviousButton`, `Calendar.Heading`, `Calendar.NextButton` are inside `Calendar.Header`
- [ ] `IconButton` defaults to `variant="ghost"` — not `"primary"` like `Button`
- [ ] `Meter.Indicator` and `ProgressBar.Indicator` both receive `value` (not just the Root)
- [ ] `ColorSlider` is NOT nested inside `ColorPicker.Root` (causes runtime error)
- [ ] `SearchField.ClearButton` has an explicit `<Icon icon={X} />` child (not auto-rendered)
- [ ] `Tabs.Indicator` is the last child inside `Tabs.List` (hoisted internally by RAC)
- [ ] Trigger styling is inconsistent — check `react-aria-deviations.md` for which triggers auto-apply `tale-button`

### Step 4: Check CSS

- [ ] No `--brand-*` tokens in component styles (use `--color-*`)
- [ ] No invalid shade numbers (`--neutral-15`, `--neutral-25`, `--neutral-35` don't exist)
- [ ] Uses `--space-*` tokens for spacing, not hardcoded values
- [ ] States styled via data attributes (`[data-disabled]`), not CSS classes

### Step 5: Fix and explain

For each issue found:
1. State the issue
2. Show the incorrect code
3. Show the corrected code
4. Explain why
