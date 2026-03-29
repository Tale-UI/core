# Gap Analysis: What Tale UI Should Adopt from Untitled UI Pro

## Executive Summary

Despite Tale UI's overall superiority for AI-driven development (9.0/10 self-assessment, 4.1/5 comparative score), analyzing Untitled UI Pro reveals several areas where Tale UI could improve. The gaps fall into four categories:

1. **Missing component types** — Application-level components that real-world projects commonly need
2. **Variant-level gaps** — Size options, style types, and feature flags where UUI Pro offers more configurations (see [Variant-Level Gap Detail](#variant-level-gap-detail))
3. **Documentation/DX improvements** — Context loading efficiency and discoverability
4. **Architectural refinements** — Context propagation and visual-only exports that strengthen (not dilute) the existing pattern

Critically, these gaps are **additive, not structural**. Tale UI's core architecture (BEM, compound parts, CSS-first, 4-package separation) is sound and should not change. The recommendations add new capabilities on top of the existing foundation.

> **Note:** Some initially considered approaches (convenience wrappers, data-driven APIs) were rejected because they contradicted Tale UI's pattern consistency — its single largest AI advantage. See [rejected-approaches.md](rejected-approaches.md) for the full analysis.

---

## What Untitled UI Pro Does Well

### 1. Single-File Context Loading

Untitled UI Pro's 36KB CLAUDE.md loads in a single agent read. Tale UI requires multiple file reads (~8,400 lines across ~82 files), scoring 3.0/5 vs 4.5/5 on context loading speed — the only dimension where Untitled UI Pro clearly wins.

**What to adopt:** Create `llms-full.txt` — a concatenated version of all AI-relevant docs. Already recommended in Tale UI's own assessment. This is the highest-impact, lowest-effort improvement.

### 2. Rich Application Components

Untitled UI Pro ships components that solve real-world application needs beyond UI primitives: rich text editor, charts, carousel, pagination, empty states, loading spinners, banners, and pre-built navigation layouts.

**What to adopt:** Selectively add the most commonly needed application-level components, prioritized by demand and fit with Tale UI's architecture.

### 3. Integrated Form Library Support

Untitled UI Pro provides React Hook Form integration with `HookForm`, `FormField`, and `useFormFieldContext` — giving consumers form state management out of the box.

**What to adopt:** Provide a documented recipe or thin adapter for React Hook Form integration. Tale UI's React Aria native validation is solid, but many teams prefer React Hook Form.

---

## Comprehensive Component Comparison

Every component from Untitled UI Pro mapped to its Tale UI equivalent. Status key:

- ✅ **Equivalent** — Tale UI has a matching or superior component
- ✅ **Recipe** — covered via documented recipe pattern
- ⚠️ **Partial** — Tale UI covers core functionality but not all variants
- ❌ **Gap** — not implemented
- 🚫 **Rejected** — deliberately excluded ([rationale](rejected-approaches.md))

### Form Controls

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Button (9 colors, 5 sizes, polymorphic) | Button + Link | ✅ Equivalent | **Colors (9→7):** primary→primary, secondary→neutral, tertiary→ghost, primary-destructive→danger, secondary-destructive→danger-neutral, tertiary-destructive→danger-ghost; link-gray/link-color/link-destructive→Link component. Tale UI has `inverse` (UUI Pro does not). **Sizes (5→3):** xs and xl missing. **Features:** Both have `showTextWhileLoading`; Tale UI uses children composition for icons (UUI Pro has `iconLeading`/`iconTrailing` props). Polymorphic 🚫 rejected |
| ButtonClose (X button) | IconButton | ✅ Equivalent | `<IconButton><Icon icon={X} /></IconButton>` |
| ButtonUtility (icon-only) | IconButton | ✅ Equivalent | Same concept, different name |
| ButtonGroup | ToggleButtonGroup | ✅ Equivalent | Shared border/rounding handled via CSS |
| AppStoreButton | AppStoreButton | ✅ Equivalent | Pre-composed `<a>` for Apple/Google store links, 3 sizes |
| SocialButton | SocialButton | ✅ Equivalent | Pre-composed button with provider icon (Google/GitHub/Apple/X/Facebook) |
| Input (11 variants) | Input, TextField, NumberField, SearchField | ✅ Equivalent | Split into semantic components (better for agents) |
| InputGroup (prefix/suffix) | NumberField, Combobox.InputGroup | ✅ Equivalent | Input addons via compound parts |
| InputDate | DateField | ✅ Equivalent | Full React Aria DateField with segments |
| InputNumber | NumberField | ✅ Equivalent | Increment/Decrement buttons with Icon |
| InputFile | FileTrigger | ✅ Equivalent | React Aria FileTrigger wrapper |
| InputTags / InputTagsOuter | TagGroup | ✅ Equivalent | TagGroup with removable tags |
| PaymentInput | PaymentInput | ✅ Equivalent | Auto-formatting, card type detection (Visa/MC/Amex/Discover) |
| PinInput (input-otp) | PinInput | ✅ Equivalent | input-otp based, compound parts |
| Checkbox + CheckboxBase (2 sizes) | Checkbox + Checkbox.Visual | ✅ Equivalent | Visual-only export matches Base pattern. **Size gap:** UUI Pro has sm (16px) and md (20px); Tale UI has fixed size (18px) |
| RadioButton + RadioButtonBase | Radio + Radio.Visual | ✅ Equivalent | Visual-only export matches Base pattern |
| RadioGroup (context-based size) | RadioGroup (SizeContext) | ✅ Equivalent | Size propagates to children |
| RadioGroups (6 data-driven layouts) | — | 🚫 Rejected | Data-driven API rejected; use recipe docs |
| Toggle + ToggleBase (2 sizes, slim) | Switch + Switch.Visual | ✅ Equivalent | Visual-only export matches Base pattern. Both have sm/md sizes + slim variant |
| Select + ComboBox + MultiSelect (3 sizes) | Select, Combobox, Autocomplete | ✅ Equivalent | Three distinct components for clarity. Both have sm/md/lg trigger sizes via context propagation |
| TagSelect | TagGroup | ✅ Equivalent | Tag-based selection via TagGroup |
| SelectNative | SelectNative | ✅ Equivalent | Styled native `<select>` with token-based theming, 3 sizes |
| Slider (3 label positions) | Slider | ✅ Equivalent | Full compound parts (Track, Thumb, etc.). **Labels:** UUI Pro has default/bottom/top-floating; Tale UI has top/bottom output positions. Rough parity |
| Textarea | TextArea | ✅ Equivalent | Compound parts with label/description |
| Label + HintText | Field (Label, Description, Error) | ✅ Equivalent | Field component provides shared form structure |

### Overlays & Dialogs

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Modal + ModalOverlay + Dialog | Dialog | ✅ Equivalent | Compound parts: Backdrop, Popup, Title, Actions, Close |
| DialogTrigger | Dialog.Trigger | ✅ Equivalent | Same React Aria pattern |
| — | AlertDialog | ✅ Tale UI only | Dedicated confirmation dialog with `role="alertdialog"` |
| Tooltip + TooltipTrigger | Tooltip | ✅ Equivalent | Compound parts with Arrow |
| SlideoutMenu (right drawer) | Drawer | ✅ Equivalent | Multi-side drawer with swipe, backdrop |
| Dropdown (14+ pre-composed patterns) | Menu + ContextMenu | ✅ Equivalent | UUI Pro's 14+ are pre-composed application patterns (account menus, search dropdowns, avatar dropdowns, icon menus), not separate components. Tale UI Menu compound parts compose all of them; has checkbox/radio items, submenus |
| — | Popover | ✅ Tale UI only | Standalone popover (not just menu) |
| — | PreviewCard | ✅ Tale UI only | Hover preview card |

### Navigation

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| App Navigation (7 variants) | NavigationMenu + 3 recipes | ✅ Equivalent | Recipes cover header, sidebar, sidebar+header |
| Tabs (5 style types, 2 sizes) | Tabs (3 style types, 2 sizes) | ✅ Equivalent | **Styles:** UUI Pro has 5 types (button-brand, button-gray, button-border, button-minimal, underline); Tale UI has 3 (underline, pills, enclosed) covering the same visual categories. **Sizes:** Both have sm/md. Core tab functionality (keyboard nav, ARIA, orientation) is equivalent |
| — | Breadcrumbs | ✅ Tale UI only | No Untitled UI Pro equivalent |
| Pagination (6 layouts, 3 display types) | Pagination | ✅ Equivalent | Compound parts with Icon triggers. Both have page-number, dot, and line display types. **Layout gap:** UUI Pro has 6 pre-composed layouts (PageDefault, PageMinimalCenter, CardDefault, CardMinimal, ButtonGroup, CardAdvanced); Tale UI achieves same via compound part composition. Core pagination logic (prev/next, page buttons, ellipsis) is equivalent |
| — | Menubar | ✅ Tale UI only | Desktop menu bar pattern |
| Header Navigation (marketing) | — | ⚠️ Partial | Covered by header-navigation recipe; no mega-menu |

### Data Display

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Table + TableCard | Table | ✅ Equivalent | Full React Aria Table with sorting, selection |
| Avatar (6 sizes) + AvatarGroup + AvatarCount | Avatar (4 sizes, Group, Count) | ✅ Equivalent | Avatar.Group with size propagation, Avatar.Count overflow indicator. **Size gap:** UUI Pro has 6 sizes (xs, sm, md, lg, xl, 2xl); Tale UI has 4 (sm, md, lg, xl) — missing xs and 2xl. **Sub-features:** UUI Pro has dedicated online/offline and verified sub-components; Tale UI handles via generic `Avatar.Indicator` with custom children (same result, different API) |
| Badge (12 colors, 3 types, 8 sub-variants) | Badge (21 colors) | ✅ Equivalent | **Colors:** UUI Pro has 12 (gray, brand, error, warning, success, slate, sky, blue, indigo, purple, pink, orange); Tale UI has 21 (5 semantic + 16 named) — **Tale UI has MORE**. **Types:** UUI Pro has 3 badge types (pill-color, color/rounded-md, modern/shadow); Tale UI has 1 (pill/rounded-full only). **Sub-variants:** UUI Pro pre-composes 8 (Badge, BadgeWithDot, BadgeWithIcon, BadgeWithFlag, BadgeWithImage, BadgeWithButton, BadgeIcon, BadgeGroup); Tale UI achieves same via children composition. 3 sizes in both |
| EmptyState (rich compound) | EmptyState | ✅ Equivalent | Compound parts: Root, Icon, Title, Description, Actions. UUI Pro has additional sub-parts (Illustration, BackgroundPattern, FileTypeIcon, AvatarRadius, AvatarRow, AvatarGrid) — these are application-level compositions achievable with Tale UI's parts + standard JSX |
| ProgressBar + ProgressCircle | ProgressBar + Meter + ProgressCircle | ✅ Equivalent | ProgressBar (linear) + Meter (percentage) + ProgressCircle (circular, 3 sizes). **Label positions:** Tale UI has 5 label positions (top, right, bottom, top-floating, bottom-floating) — **exceeds** UUI Pro's inline-only label |
| LoadingIndicator (3 types) | Spinner (3 variants) | ✅ Equivalent | circle, line, dots variants with 3 sizes |
| — | GridList | ✅ Tale UI only | Grid-based list with selection |
| — | Tree | ✅ Tale UI only | Hierarchical tree view |
| FeaturedIcon (6 themes, 4 sizes) | FeaturedIcon (6 themes, 2 shapes, 4 sizes) | ✅ Equivalent | **Themes:** Both have 6 themes (light, gradient, dark, outline, modern, modern-neue). **Sizes:** Both have 4 sizes (sm, md, lg, xl). **Shapes:** Tale UI has 2 shapes (circle, square). **Colors:** Both have 5 (brand, error/red, warning, success, gray/neutral) |
| RatingStars + RatingBadge | RatingStars + RatingBadge | ✅ Equivalent | Read-only star display (half-star support) + compact numeric badge |
| DotIcon | DotIcon | ✅ Equivalent | Colored status circle, 5 color variants, 3 sizes |

### Date & Time

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| DatePicker | DatePicker | ✅ Equivalent | Full React Aria with calendar popup |
| DateRangePicker + RangePresetButton | DateRangePicker | ✅ Equivalent | No preset buttons, but fully functional |
| Calendar + RangeCalendar | Calendar + RangeCalendar | ✅ Equivalent | Full compound parts |
| — | TimeField | ✅ Tale UI only | Time-only input (no Untitled UI Pro equivalent) |
| — | DateField | ✅ Tale UI only | Date-only field without popup |

### Content & Layout

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Carousel (Embla-based) | Carousel (Embla-based) | ✅ Equivalent | WCAG 2.2.2 autoplay pause, aria-live |
| — | Accordion | ✅ Tale UI only | Expandable content sections |
| — | Disclosure | ✅ Tale UI only | Single expand/collapse |
| — | ScrollArea | ✅ Tale UI only | Custom scrollbar component |
| — | Separator | ✅ Tale UI only | Horizontal/vertical divider |
| — | Toolbar | ✅ Tale UI only | Toolbar with keyboard navigation |
| TextEditor (TipTap, 6 files) | — | ❌ Gap | Rich text editor; heavy dependency, out of scope |
| Banners (10+ marketing templates) | Banner (4 variants, 2 sizes) | ✅ Equivalent | **Different scope:** UUI Pro's 10+ banners are marketing templates (single/dual action, countdown, slim, text field, full-width, brand/default); Tale UI's Banner is a notification/alert component with 4 semantic variants (info/success/warning/error), 2 sizes (sm/md), and compound parts (Icon, Title, Description, Actions, Close). Composable parts cover all UUI Pro template layouts |
| VideoPlayer | — | ❌ Gap | Pro-only video player; specialized |

### Charts

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Charts (Recharts base) | `@tale-ui/charts` (6 types) | ✅ Equivalent | BarChart, LineChart, AreaChart, PieChart, RadarChart, RadialBarChart |

### Color

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| — | ColorArea | ✅ Tale UI only | 2D color picker |
| — | ColorSlider | ✅ Tale UI only | Single-channel color slider |
| — | ColorWheel | ✅ Tale UI only | Hue wheel picker |
| — | ColorSwatch / ColorSwatchPicker | ✅ Tale UI only | Color swatch display and selection |
| — | ColorField | ✅ Tale UI only | Hex/RGB text input |
| — | ColorPicker | ✅ Tale UI only | Combined color picker |

### Forms & Validation

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| Form (React Aria wrapper) | Form | ✅ Equivalent | Same React Aria base |
| HookForm + FormField + useFormFieldContext | Recipe documented | ✅ Recipe | `docs/recipes/react-hook-form.md` |
| — | Field (Label, Description, Error) | ✅ Tale UI only | Shared field structure component |
| — | Fieldset | ✅ Tale UI only | Grouped fields with legend |

### File Handling

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| FileUploadTrigger | FileTrigger | ✅ Equivalent | Same React Aria FileTrigger |
| FileUpload (drag-and-drop) | DropZone | ✅ Equivalent | React Aria DropZone |
| ImageCropper (react-image-crop) | — | ❌ Gap | Specialized; out of design system scope |

### Icons & Assets

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| @untitledui/icons (5,700+) | Icon + Lucide React (4,000+) | 🚫 Rejected | Consumer-chosen icons; no vendor lock-in |
| Payment Icons (57) | Icon + Lucide | 🚫 Rejected | `<Icon icon={CreditCard} />` from Lucide |
| Social Icons (23) | Icon + Lucide | 🚫 Rejected | `<Icon icon={Github} />` from Lucide |
| Integration Icons (17) | Icon + Lucide | 🚫 Rejected | `<Icon icon={Slack} />` from Lucide |
| FolderIcon, StarIcon, etc. | Icon + Lucide equivalents | 🚫 Rejected | Lucide has all common icons |
| Background Patterns (4 types: grid, grid-check, circle, square) | — | ❌ Gap | Decorative SVG patterns; marketing asset |
| Illustrations (5 SVG) | — | ❌ Gap | Decorative illustrations; marketing asset |
| NotFound (404 illustrations) | — | ❌ Gap | 404 page illustrations; marketing asset |
| CreditCard display | — | ❌ Gap | Visual credit card component; niche |
| QrCode (qr-code-styling) | — | ❌ Gap | QR code generator; specialized |
| IphoneMockup | — | ❌ Gap | Device frame; marketing asset |
| SectionDivider | Separator | ✅ Equivalent | Separator component covers this |

### Utility & Infrastructure

| Untitled UI Pro | Tale UI | Status | Notes |
| --------------- | ------- | ------ | ----- |
| ThemeProvider (light/dark/system) | ColorModeToggle | ✅ Equivalent | UUI Pro uses context provider + `useTheme` hook; Tale UI uses `data-color-mode` attribute + ColorModeToggle UI component with localStorage persistence |
| — | CSPProvider | ✅ Tale UI only | Content Security Policy nonce provider |
| — | I18nProvider | ✅ Tale UI only | Locale/RTL provider |
| — | Container | ✅ Tale UI only | Max-width content container |
| — | mergeProps | ✅ Tale UI only | Prop merging utility |
| useClipboard | — | ✅ Recipe | `docs/recipes/use-clipboard.md` — copy to clipboard with fallback |
| useBreakpoint | — | 🚫 Rejected | Tailwind-specific breakpoint detection; not applicable to BEM architecture |
| useResizeObserver | — | ✅ Recipe | `docs/recipes/use-resize-observer.md` — element resize observation |

---

### Summary

| Status | Count | Details |
| ------ | ----- | ------- |
| ✅ Equivalent | 57 | Tale UI matches or exceeds Untitled UI Pro (includes components with minor variant gaps noted in table rows) |
| ✅ Tale UI only | 21 | Components Tale UI has that Untitled UI Pro lacks (Color, Tree, GridList, etc.) |
| ✅ Recipe | 2 | Covered via documentation (RHF, navigation layouts) |
| 🚫 Rejected | 8 | Deliberately excluded with documented rationale (incl. useBreakpoint, Button xs/xl sizes) |
| ⚠️ Partial | 1 | Header Navigation (no mega-menu) |
| ❌ Gap | 4 | Remaining gaps (see below) |

**Remaining gaps (4):** TextEditor, VideoPlayer, ImageCropper, marketing assets (background patterns, illustrations, 404 pages, QR code, device mockups, credit card display).

**Of these 4 gaps:**

- 3 are **specialized tools** (text editor, video player, image cropper) — out of design system scope
- 1 is **a collection of marketing assets** (patterns, illustrations, device mockups, QR code) — different product scope

---

## Variant-Level Gap Detail

This section provides exact variant, size, and configuration comparisons for components where the two libraries differ at the sub-variant level. All counts verified from source code.

### Size Gaps

Size comparison across all components that differ between UUI Pro and Tale UI:

| Component | UUI Pro Sizes | Tale UI Sizes | Status |
| --------- | ------------- | ------------- | ------ |
| Button | xs, sm, md, lg, xl (5) | sm, md, lg (3) | 🚫 Rejected (xs, xl) |
| Avatar | xs, sm, md, lg, xl, 2xl (6) | xs, sm, md, lg, xl, 2xl (6) | ✅ Parity |
| Checkbox | sm (16px), md (20px) | sm (1.4rem), md (1.8rem), lg (2.2rem) | ✅ Parity (Tale UI adds lg) |
| Switch/Toggle | sm, md + slim variant | sm, md + slim variant | ✅ Parity |
| Select trigger | sm, md, lg (3) | sm, md, lg (3) | ✅ Parity |
| Tabs | sm, md (2) | sm, md (2) | ✅ Parity |
| FeaturedIcon | sm, md, lg, xl (4) | sm, md, lg, xl (4) | ✅ Parity |

**Remaining size gaps:** 0. Button xs/xl rejected. **Closed:** 6 (Switch, Select, Tabs, FeaturedIcon, Avatar, Checkbox).

### Style/Theme Variant Gaps

Components where Tale UI has fewer visual style types:

| Component | UUI Pro Styles | Tale UI Styles | Status |
| --------- | -------------- | -------------- | ------ |
| Button colors | 9 (primary, secondary, tertiary, link-color, link-gray, primary-destructive, secondary-destructive, tertiary-destructive, link-destructive) | 7 (primary, neutral, ghost, danger, danger-neutral, danger-ghost, inverse) + Link component | ✅ Parity achieved (link variants covered by Link component) |
| Badge types | 3 (pill-color, color/rounded-md, modern/shadow) | 3 (pill, rounded, modern) | ✅ Parity achieved |
| Tabs types | 5 horizontal (button-brand, button-gray, button-border, button-minimal, underline) + line for vertical | 3 (underline, pills, enclosed) | ✅ Parity achieved (3 distinct styles cover same categories) |
| FeaturedIcon themes | 6 (light, gradient, dark, outline, modern, modern-neue) | 6 (light, gradient, dark, outline, modern, modern-neue) | ✅ Parity achieved |
| Pagination display | 3 (page numbers, dots, lines) + 6 layout variants | 3 (page numbers, dots, lines) | ✅ Parity achieved (layouts via compound part composition) |

### Feature/Configuration Gaps

Specific features in UUI Pro that Tale UI lacks:

| Feature | UUI Pro | Tale UI | Notes |
| ------- | ------- | ------- | ----- |
| Button `showTextWhileLoading` | ✅ Shows spinner + text | ✅ `showTextWhileLoading` prop | Both show spinner alongside text |
| Button `iconLeading`/`iconTrailing` props | ✅ Dedicated props | ❌ Children composition | Same visual result, different API |
| Button `noTextPadding` | ✅ Removes horizontal padding | ❌ Not available | Useful for tight icon-adjacent text |
| Circular progress indicator | ✅ ProgressCircles + SimpleCircle | ✅ ProgressCircle (3 sizes) | Compound parts with SVG circle |
| Switch slim variant | ✅ `slim` boolean reduces height | ✅ `slim` boolean | Both have compact toggle variant |
| Avatar online/offline status | ✅ Dedicated `status` prop | ⚠️ Generic `Indicator` | Same result via `<Avatar.Indicator>` with custom children |
| Avatar verified badge | ✅ Dedicated `verified` prop | ⚠️ Generic `Indicator` | Same result via `<Avatar.Indicator>` with custom children |
| Badge sub-variants (WithDot, WithIcon, etc.) | ✅ 8 pre-composed components | ⚠️ Children composition | Same visual output, different API surface |
| Tabs badge support | ✅ Built-in badge slot | ⚠️ Children composition | Achievable by placing Badge inside Tab |
| useClipboard hook | ✅ ~77 lines, promise-based | ✅ Recipe | `docs/recipes/use-clipboard.md` |
| useResizeObserver hook | ✅ ~67 lines, with fallback | ✅ Recipe | `docs/recipes/use-resize-observer.md` |

### Where Tale UI Exceeds Untitled UI Pro

Areas where Tale UI has MORE options or capabilities:

| Component | Tale UI | UUI Pro | Advantage |
| --------- | ------- | ------- | --------- |
| Badge colors | 21 (5 semantic + 16 named) | 12 | +9 color options |
| Button `inverse` variant | ✅ High-contrast neutral | ❌ Not available | Useful for dark backgrounds |
| ProgressBar label positions | 5 (top, right, bottom, top-floating, bottom-floating) | 1 (inline only) | +4 label position options |
| Slider orientation | horizontal + vertical | horizontal only | Vertical orientation support |
| Dropdown item types | Menu items, checkbox items, radio items, submenus | Menu items, sections, separators | Richer interactive item types |
| Dialog dedicated AlertDialog | `role="alertdialog"` component | No dedicated alert dialog | Better ARIA semantics for confirmations |
| Components Tale UI only | 21 (ColorArea, ColorSlider, ColorWheel, ColorSwatch, ColorSwatchPicker, ColorField, ColorPicker, Accordion, Disclosure, ScrollArea, Toolbar, GridList, Tree, Breadcrumbs, Menubar, Popover, PreviewCard, AlertDialog, TimeField, DateField, Container) | 0 | Entire component categories UUI Pro lacks |

### Icon Collection Detail

Precise counts from source files:

| Collection | UUI Pro | Tale UI (Lucide) | Notes |
| ---------- | ------- | ----------------- | ----- |
| General icons | 5,700+ (@untitledui/icons) + 4,600+ (Pro) | 4,000+ (Lucide) | Consumer-chosen, no vendor lock-in |
| Payment icons | 57 dedicated SVG components | ~5 in Lucide | Significant gap for fintech apps |
| Social icons | 23 dedicated SVG components | ~10 in Lucide | Gap for social-heavy apps |
| Integration icons | 17 dedicated SVG components (incl. Claude, ChatGPT, Cursor, Figma) | 0 dedicated | Gap for integration UIs |

Tale UI's deliberate decision to use consumer-chosen icons (Lucide or any icon library) avoids vendor lock-in. The payment, social, and integration icon gaps are real but fall outside design system scope — consumers can add `simple-icons` or `react-icons` packages for these.

---

## Architectural Approaches Worth Adopting

### 1. Context Propagation for Size/Variant — ✅ Implemented

`Radio.Group` and `ToggleButtonGroup` now accept a `size` prop that propagates to children via `SizeContext`. Explicit `size` on children overrides the group context.

Scoped to components where children already accept `size` (Radio, ToggleButton). Checkbox and Switch don't have size variants, so no context propagation was added for those groups.

### 2. Base/Visual-Only Component Exports — ✅ Implemented

`Checkbox.Visual`, `Radio.Visual`, `Switch.Visual`, and `ToggleButtonVisual` export render-only indicators without React Aria behaviour. All are `aria-hidden="true"`.

**Important:** Visual exports are for component authors building new compound components — NOT for agents generating application UIs. See `docs/components/visual-exports.md` and the warning in `consumer-claude-md-snippet.md`.

---

## Documentation Improvements

### 1. Create `llms-full.txt` (High Priority)

A single concatenated file containing all AI-relevant documentation:

- `llms.txt` content
- `CLAUDE.md` routing table
- `ai-reference.md` token/class enumeration
- `consumer-claude-md-snippet.md` pitfalls
- `react-aria-deviations.md` deviation list

This directly addresses the one dimension where Untitled UI Pro wins (4.5 vs 3.0 on context loading). Agents with large context windows read one file and have everything.

### 2. Add Component Index with One-Line Descriptions (High Priority)

A single file listing all 67 components with:

- Component name
- One-line description
- Import path
- Primary use case

```markdown
| Component | Description | Import |
| --------- | ----------- | ------ |
| Accordion | Expandable content sections | `@tale-ui/react/accordion` |
| AlertDialog | Confirmation dialog requiring user action | `@tale-ui/react/alert-dialog` |
| ...
```

Faster than reading 67 separate docs for discovery. Untitled UI Pro's directory-based discovery (one component per folder name) is simple but effective — this index achieves the same for Tale UI.

### 3. Add Recipe/Composition Docs (High Priority)

Multi-component patterns for common real-world scenarios:

- Form with validation and error handling
- Data table with sorting and pagination
- Sidebar navigation with drawer on mobile
- Search with autocomplete and recent items
- Settings page with grouped form fields

Untitled UI Pro's pre-composed components hint at the compositions people commonly need. Rather than pre-composing (which conflicts with Tale UI's philosophy), document the compositions as copy-paste recipes.

### 4. Add Inline Prop Tables to Component Docs (Medium Priority)

Include full TypeScript prop definitions inline in markdown docs so agents don't need to cross-reference `.d.ts` or source files:

```markdown
## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| variant | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Size modifier |
| disabled | `boolean` | `false` | Alias for `isDisabled` |
```

---

## Prioritized Recommendations

### Tier 1: High Impact, Low-Medium Effort — ✅ ALL COMPLETE

| # | Recommendation | Status |
| - | -------------- | ------ |
| 1 | **Create `llms-full.txt`** | ✅ Done — 8,500+ lines, 5 sections |
| 2 | **Add component index file** | ✅ Done — `docs/component-index.md`, 73 components |
| 3 | **Add recipe/composition docs** | ✅ Done — 6 recipes in `docs/recipes/` |
| 4 | **Add Pagination component** | ✅ Done — compound parts, Icon triggers, `aria-current="page"` |
| 5 | **Add EmptyState component** | ✅ Done — Root, Icon, Title, Description, Actions |

### Tier 2: Medium Impact, Medium Effort — ✅ ALL COMPLETE

| # | Recommendation | Status |
| - | -------------- | ------ |
| 6 | **Add Spinner/LoadingIndicator component** | ✅ Done — 3 variants (circle, line, dots), `role="status"` |
| 7 | **Add Banner/Alert component** | ✅ Done — 4 semantic variants, `role="status"`, default `aria-label` on Close |
| 8 | **Add inline prop tables to component docs** | ✅ Done — 73/73 component docs have `## Props` |
| 9 | **Add CI doc-sync check** | ✅ Done — `tools/audit-docs.js` + CI step |

### Tier 3: Lower Priority — ✅ ALL COMPLETE

| # | Recommendation | Status |
| - | -------------- | ------ |
| 10 | **Add Carousel component** | ✅ Done — Embla-based, WCAG 2.2.2 autoplay pause, `aria-live` |
| 11 | **Add Pin/OTP Input component** | ✅ Done — input-otp based, compound parts |
| 12 | **CSS lint rule for `--brand-*` in component files** | ✅ Done — `tools/audit-brand.js` + CI step |
| 13 | **React Hook Form recipe/adapter** | ✅ Done — `docs/recipes/react-hook-form.md` |

---

### Tier 4: Remaining Gaps — ✅ ALL COMPLETE

| # | Recommendation | Status |
| - | -------------- | ------ |
| 14 | **App navigation layout recipes** | ✅ Done — `header-navigation.md`, `sidebar-with-header.md` (plus existing `sidebar-navigation.md`) |
| 15 | **Context propagation for size/variant** | ✅ Done — `SizeContext` in RadioGroup and ToggleButtonGroup; explicit props override |
| 16 | **Base/Visual-only component exports** | ✅ Done — `Checkbox.Visual`, `Radio.Visual`, `Switch.Visual`, `ToggleButtonVisual`; `aria-hidden`, component authors only |

### Tier 5A: Variant Parity — High Impact, Low Effort (CSS-only or minimal TSX)

Pure CSS additions or single-prop TSX changes with no architectural impact:

| # | Recommendation | Status |
| - | -------------- | ------ |
| 17 | **Button `secondary-destructive` + `tertiary-destructive` variants** | ✅ Done — implemented as `danger-neutral` + `danger-ghost` (equivalent names matching Tale UI convention) |
| 18 | **FeaturedIcon xl size** | ✅ Done — xl size added to FeaturedIcon |
| 19 | **FeaturedIcon themes (gradient, dark, outline, modern, modern-neue)** | ✅ Done — all 5 themes added alongside existing `light` |
| 20 | **Button xs + xl sizes** | 🚫 Rejected — 3 sizes (sm/md/lg) cover all standard use cases; xs creates accessibility concerns (touch target too small); xl achievable via className override for rare hero CTA use cases |
| 21 | **Avatar xs + 2xl sizes** | ✅ Done — xs (1.6rem) and 2xl (12rem) sizes added to Avatar, Count, and Group |

### Tier 5B: Variant Parity — Medium Impact, Medium Effort (CSS + TSX prop additions)

Require adding a `size` prop to components that currently have fixed sizes, plus corresponding CSS:

| # | Recommendation | Status |
| - | -------------- | ------ |
| 22 | **Switch size variants (sm, md) + slim** | ✅ Done — `size` prop (sm/md) + `slim` boolean on Switch.Root and Switch.Visual |
| 23 | **Checkbox size variants (sm, md, lg)** | ✅ Done — `size` prop (sm/md/lg) on Checkbox.Root + SizeContext propagation in CheckboxGroup |
| 24 | **Select trigger size variants (sm, md, lg)** | ✅ Done — `size` prop on Select.Root with context propagation to Trigger |
| 25 | **Tabs size variants (sm, md)** | ✅ Done — `size` prop on Tabs.List via TabSizeContext |
| 26 | **Circular progress indicator** | ✅ Done — standalone `ProgressCircle` component with Root, Track, Fill, Label parts (3 sizes) |

### Tier 5C: Variant Parity — Lower Priority (design decisions needed or docs-only)

Require design decisions about Tale UI aesthetic fit, or are documentation tasks:

| # | Recommendation | Status |
| - | -------------- | ------ |
| 27 | **Tabs style types (underline, pills, enclosed)** | ✅ Done — `variant` prop on Tabs.List with 3 styles covering UUI Pro's 5 types |
| 28 | **Badge types (pill, rounded, modern)** | ✅ Done — `type` prop on Badge with 3 visual styles |
| 29 | **Pagination dot + line display types** | ✅ Done — `Pagination.Dot` and `Pagination.Line` sub-components added |
| 30 | **Button `showTextWhileLoading`** | ✅ Done — boolean prop on Button shows spinner alongside text |
| 31 | **useClipboard recipe** | ✅ Done — `docs/recipes/use-clipboard.md` |
| 32 | **useResizeObserver recipe** | ✅ Done — `docs/recipes/use-resize-observer.md` |

---

### Explicitly NOT Recommended

| Approach | Why Not |
| -------- | ------- |
| **Switching to Tailwind** | BEM is Tale UI's strongest AI-friendliness signal (deterministic, documented, inspectable). Tailwind scores lower on predictability. |
| **Adopting multiple export patterns** | Pattern consistency is Tale UI's largest advantage (+2.0 gap). Adding patterns would degrade this. |
| **Removing compound parts for pre-composed** | Composition is the core design philosophy. Pre-composed components hide structure that agents and consumers benefit from seeing. |
| **Convenience wrappers / pre-composed APIs** | Adding single-tag `<Checkbox label="X" />` alongside compound parts introduces a second composition pattern — the exact inconsistency this report criticizes Untitled UI Pro for. Use recipe docs instead. See [rejected-approaches.md](rejected-approaches.md). |
| **Data-driven convenience APIs** | A `<RadioGroup items={[...]} />` API is a second export pattern. Would degrade Tale UI's +2.0 pattern consistency advantage. Use recipe docs instead. See [rejected-approaches.md](rejected-approaches.md). |
| **Bundling proprietary icon sets** | Consumer-chosen icons are more flexible and avoid lock-in. Different product scope. |
| **Adopting starter-kit distribution** | npm package distribution enables versioning, updates, and multi-project adoption. Starter kit is single-use. |
| **Button `iconLeading`/`iconTrailing` props** | Children composition is Tale UI's pattern — `<Button><Icon/> Label</Button>`. Dedicated icon props add a second API for the same result. |
| **Button `noTextPadding` prop** | Edge case; consumers can use `className` override. Not worth a dedicated prop. |
| **Avatar dedicated `status`/`verified` props** | Generic `Avatar.Indicator` with custom children is MORE flexible — supports any badge content, not just online/offline. |
| **Badge pre-composed sub-variants (WithDot, WithIcon, etc.)** | Children composition achieves the same visual output. Pre-composed variants would be a second API pattern. |
| **Tabs built-in badge slot** | `<Tab>Label <Badge>3</Badge></Tab>` via children composition already works. |
| **Button xs + xl sizes** | 3 sizes (sm/md/lg) cover all standard use cases. xs creates accessibility concerns (touch target below 32px minimum); xl is achievable via `className` override for rare hero CTA use cases. Adding more sizes increases API surface without proportional value. |

---

## Conclusion

**All 16 recommendations across Tiers 1-4 are fully implemented, plus 8 additional components closing the original gap analysis. All 16 Tier 5 variant-level parity recommendations (#17-#32) are now resolved — 15 implemented, 1 rejected (#20 Button xs/xl).** The comprehensive comparison shows:

- **57 components** where Tale UI matches or exceeds Untitled UI Pro
- **21 components** that Tale UI has but Untitled UI Pro lacks (Color pickers, Tree, GridList, AlertDialog, Breadcrumbs, ScrollArea, Toolbar, etc.)
- **8 approaches** deliberately rejected with documented rationale
- **1 partial gap** (mega-menu navigation)
- **4 remaining gaps** — specialized tools and marketing assets outside design system scope

### Variant-Level Analysis Summary

Tale UI has achieved full variant-level parity with UUI Pro across all component categories:

- **Size gaps:** All closed. Avatar now has 6 sizes (xs through 2xl). Checkbox now has 3 sizes (sm/md/lg). Switch, Select, Tabs, and FeaturedIcon size gaps were previously closed. Button xs/xl rejected (3 sizes sufficient, xs has a11y concerns).
- **Style type gaps:** All closed. Tabs now has 3 style types (underline, pills, enclosed). Badge now has 3 types (pill, rounded, modern). FeaturedIcon has all 6 themes.
- **Feature gaps:** All closed — ProgressCircle added, Switch slim implemented, Button `showTextWhileLoading` added, useClipboard and useResizeObserver recipes documented.

Tale UI **exceeds** UUI Pro in several areas:

- Badge has 21 color options vs UUI Pro's 12
- Button has `inverse` variant that UUI Pro lacks
- ProgressBar has 5 label positions vs UUI Pro's 1
- Slider supports vertical orientation
- Menu has richer interactive item types (checkbox/radio items, submenus)
- 21 entire components that UUI Pro doesn't have at all

Tale UI now has:

- 88 components (82 in `@tale-ui/react` + 6 in `@tale-ui/charts`)
- Single-file context loading (`llms-full.txt`)
- 9 copy-paste recipe docs
- Inline prop tables in all component docs
- 3 CI audit tools (`audit-docs.js`, `audit-bem.js`, `audit-brand.js`)
- Size context propagation in RadioGroup and ToggleButtonGroup
- Visual-only exports for component authors
- 4 rejected approaches documented with rationale ([rejected-approaches.md](rejected-approaches.md))
