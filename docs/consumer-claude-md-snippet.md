# Tale UI — CLAUDE.md snippet for consuming projects

Copy the section below into your project's `CLAUDE.md` file.

---

## UI Components (@tale-ui/react)

This project uses `@tale-ui/react` for all UI components.

Before generating or modifying component code, you MUST:

1. **Read the setup guide** in `node_modules/@tale-ui/react/README.md` — it contains critical configuration (font-size base, style imports, dark mode, theme overrides) that will produce broken output if skipped.

2. **Check the JSDoc `@example` on each component's .d.ts export** before using it. Every component's Root export includes a `@example` block showing the correct import path, sub-parts, and composition pattern. Read the `.d.ts` file for each component you intend to use:

   ```
   node_modules/@tale-ui/react/esm/{name}/{Name}.styled.d.ts
   ```

   > **Exception:** A few components use `{Name}.d.ts` (not `.styled.d.ts`): `CSPProvider`, `CheckboxGroup`, `RadioGroup`, `Container`, and `mergeProps`.

   The `@example` block at the top of each file is the authoritative usage reference.

3. **For deeper details** (all props, all variants, advanced patterns), read the local component doc:

   ```
   node_modules/@tale-ui/react/docs/{name}.md
   ```

4. **Do not guess component APIs.** Always check the `@example` block first. Incorrect usage (wrong sub-part names, missing wrapper components, wrong import paths) causes build failures.

5. **Common pitfalls to avoid:**
   - **Namespace components** (use `<Component.Root>`, never `<Component>` directly): `Accordion`, `AlertDialog`, `Autocomplete`, `Avatar`, `Banner`, `Breadcrumbs`, `Calendar`, `Carousel`, `Checkbox`, `ColorArea`, `ColorField`, `ColorPicker`, `ColorSlider`, `ColorSwatch`, `ColorSwatchPicker`, `ColorWheel`, `Combobox`, `ContextMenu`, `DateField`, `DatePicker`, `DateRangePicker`, `Dialog`, `Disclosure`, `Drawer`, `EmptyState`, `Field`, `Fieldset`, `GridList`, `Input`, `Menu`, `Menubar`, `Meter`, `NavigationMenu`, `NumberField`, `Pagination`, `PaymentInput`, `PinInput`, `Popover`, `PreviewCard`, `ProgressBar`, `Radio`, `RangeCalendar`, `ScrollArea`, `SearchField`, `Select`, `Slider`, `Table`, `Tabs`, `TagGroup`, `TextArea`, `TextField`, `TimeField`, `Toolbar`, `Tooltip`, `Tree`. **Simple components** (direct use, no `.Root`): `AppStoreButton`, `Badge`, `Button`, `CheckboxGroup`, `ColorModeToggle`, `Container`, `DotIcon`, `DropZone`, `FeaturedIcon`, `FileTrigger`, `Form`, `Icon`, `IconButton`, `Link`, `RadioGroup`, `RatingBadge`, `RatingStars`, `SelectNative`, `Separator`, `SocialButton`, `SocialButtonGroup`, `Spinner`, `ToggleButton`, `ToggleButtonGroup`.
   - `Drawer.Root` uses `open`/`onOpenChange` (NOT `isOpen`) — it is a custom component, not built on React Aria Modal. Dialog and AlertDialog use `isOpen`.
   - `Drawer.Backdrop` must be a self-closing sibling of `Drawer.Popup` (`<Drawer.Backdrop />`), never a wrapper around it.
   - There is NO `Drawer.Actions` part (unlike `Dialog.Actions`). Wrap action buttons in a plain `<div>` with flex layout instead.
   - `Meter.Value` and `ProgressBar.Value` need children text (e.g. `<Meter.Value>60%</Meter.Value>`), not self-closing.
   - `NumberField.Increment` and `NumberField.Decrement` render their own lucide-react icons — use them self-closing.
   - `ToggleButtonGroup` requires `aria-label` or `aria-labelledby` for accessibility.
   - Dark mode: always set `data-color-mode` to `"dark"` or `"light"` — never remove the attribute to switch to light mode.
   - `Calendar.PreviousButton`, `Calendar.Heading`, and `Calendar.NextButton` must be wrapped in `Calendar.Header` — it provides the flex layout. Same rule applies to `RangeCalendar.Header`.
   - `Calendar.GridHeader` passes day name strings, not dates — use `Calendar.GridHeaderCell` inside it, not `Calendar.Cell`. Reserve `Calendar.Cell` for `Calendar.GridBody`.
   - `Calendar.Heading` must have no vertical margin or padding — do not add spacing to it or wrap it in an element that adds margins (e.g. `<h2>`).
   - Do NOT nest `ColorSlider` inside `ColorPicker.Root` — the context does not propagate and causes "Unknown color channel: hue" at runtime. Use `ColorArea` and `ColorSlider` as standalone components with shared `useState`.
   - `PaymentInput.CardIcon` auto-detects card type — use self-closing inside `PaymentInput.Group`. `PaymentInput.Input` auto-formats digits — do not manually format values.
   - `Avatar.Group` propagates size to children — do not set size on individual `Avatar.Root` inside a Group unless overriding.
   - `Avatar.Indicator` must wrap **outside** `Avatar.Root` (not inside it) because `.tale-avatar` has `overflow: hidden`. Pass the badge element via the `badge` prop. `Avatar.LabelGroup` propagates size to child avatars like `Avatar.Group`.
   - `Checkbox.Indicator` does NOT render a checkmark on its own — you must provide a child `<Icon icon={Check} size="sm" />` from `@tale-ui/react/icon` and `lucide-react`.
   - **Never use `.Visual` exports** (`Checkbox.Visual`, `Radio.Visual`, `Switch.Visual`, `ToggleButtonVisual`) for interactive UI. They are `aria-hidden` building blocks for custom component composition only — not for application screens.
   - `Dialog.Close` and `Popover.Close` auto-render an X icon — use them self-closing (`<Dialog.Close aria-label="Close" />`). Pass children only to override the default icon.
   - `Dialog.Backdrop` must **wrap** `Dialog.Popup` (opposite of Drawer).
   - `Select.Root` owns the `placeholder` prop — do NOT put `placeholder` on `Select.Value`.
   - `Combobox.Trigger` auto-renders a chevron icon — use it self-closing inside `Combobox.InputGroup`.
   - `SearchField.ClearButton` does NOT auto-render an icon — pass `<Icon icon={X} size="sm" />` as children (import from `@tale-ui/react/icon` and `lucide-react`).
   - **Trigger button styling** — Triggers render their own `<button>`, so never nest `<Button>` inside them. But they differ in how BEM classes are applied:

     | Trigger                                                | Auto-applies `tale-button`? | className you provide                                                                   |
     | ------------------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------- |
     | `Dialog.Trigger`                                       | Yes                         | `className="tale-button--primary"` (variant only)                                       |
     | `AlertDialog.Trigger`                                  | No                          | `className="tale-button tale-button--danger"` (base + variant)                          |
     | `Drawer.Trigger`, `Drawer.Close`                       | No                          | `className="tale-button tale-button--neutral"` (base + variant)                         |
     | `Popover.Trigger`, `Tooltip.Trigger`, `Menu.Trigger`   | No                          | `className="tale-button tale-button--neutral tale-button--md"` (base + variant + size)  |
     | `PreviewCard.Trigger`                                  | No                          | `className="tale-button tale-button--neutral"` (base + variant) or style as a link      |

   - **Icon and IconButton:**
     - `Icon` takes a component ref, not an instance: `<Icon icon={Heart} />` (correct) vs `<Icon icon={<Heart />} />` (wrong). Import icons from `lucide-react`.
     - `IconButton` requires `aria-label` for accessibility: `<IconButton aria-label="Delete"><Icon icon={Trash2} /></IconButton>`.
   - **Token size suffixes:** Tale UI uses `-s`, `-m`, `-l` (NOT Bootstrap-style `-sm`, `-md`, `-lg`). Full scale: `4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl`. Example: `--space-m` not `--space-md`.
   - **Layout utilities:** Tale UI provides layout utility classes (`.flex--row`, `.flex--col`, `.gap--m`, `.grid--3`, `.center--hv`, etc.) — use these instead of writing manual `display: flex` / `gap` declarations.
   - **AlertDialog vs Dialog:** `AlertDialog` uses `role="alertdialog"` and is for actions requiring explicit acknowledgement (deletions, confirmations). Do NOT add `<AlertDialog.Close />` (corner X icon) — it allows dismissal without choosing an action. Force the user to pick Cancel or Confirm. For general-purpose modals that can be freely dismissed, use `Dialog` instead.
   - **I18nProvider:** For locale/RTL support, wrap your app in `<I18nProvider locale="...">` from `@tale-ui/react/i18n-provider`. This affects date/time formatting, number formatting, and text direction for all Tale UI components.
   - **CSPProvider:** If your app uses a Content Security Policy, wrap your app in `<CSPProvider nonce={myNonce}>` from `@tale-ui/react/csp-provider` to apply the nonce to Tale UI's inline styles.
   - **Do not apply global styles to semantic HTML elements.** Tale UI components internally render `<section>`, `<header>`, and other semantic elements (via React Aria). Global rules like `section { padding: 1rem }` will leak into Dialog, Menu, Popover, and other overlay components and break their layout. Style with class selectors (`.my-section { ... }`) instead of element selectors. Tale UI includes a defensive CSS shield that resets `margin`, `padding`, and `border` on semantic elements directly inside `.tale-*` containers, but nested elements are not covered.

6. **Charts (separate package):** Install `@tale-ui/charts` and `recharts` separately. Import chart styles via `import '@tale-ui/charts/styles';`. Charts use the same compound parts pattern: `BarChart.Root`, `BarChart.Bar`, etc.

7. **Dark mode must persist between refreshes.** Every new app must:

   a. Add `class="tale-ui"` and `data-color-mode` to `<html>`:
   ```html
   <html class="tale-ui" data-color-mode="light">
   ```

   b. Include this inline script in `<head>` before any CSS or JS to avoid a flash of wrong theme:
   ```html
   <script>
     (function() {
       var mode = localStorage.getItem('color-mode')
         || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-color-mode', mode);
     })();
   </script>
   ```

   c. Use `ColorModeToggle` for the toggle UI — it handles `localStorage` and `data-color-mode` automatically:
   ```tsx
   import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

   <ColorModeToggle />
   ```
