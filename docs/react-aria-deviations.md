# React Aria Deviations

Tale UI wraps React Aria Components (RAC) but adds, changes, or replaces behaviour in several places. This document is the single reference for every deviation a consumer or agent needs to know about.

## Quick Reference

| Deviation                                      | Impact                                   | Details                                                                       |
| ---------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| Drawer uses `open`, not `isOpen`               | **High** — wrong prop silently fails     | [Drawer-specific differences](#drawer-specific-differences)                   |
| Drawer.Backdrop is a sibling, not a wrapper    | **High** — wrong nesting breaks close    | [Backdrop/Popup nesting](#backdoppopup-nesting-rules)                         |
| IconButton defaults to `variant="ghost"`       | **Medium** — unexpected appearance       | [variant prop](#variant-prop)                                                 |
| Never nest `<Button>` inside a Trigger         | **High** — invalid HTML `<button><button>` | [Trigger styling](#trigger-button-styling-differences)                        |
| Checkbox.Indicator needs explicit Icon child   | **Medium** — missing checkmark           | [Auto-rendered icons](#auto-rendered-icons)                                   |
| Pass `value` to both Meter.Root AND Indicator  | **Medium** — bar appears empty           | [Meter/ProgressBar](#meter-and-progressbar-value-passing)                     |
| 20+ parts auto-render Lucide icons             | **Low** — override by passing children   | [Auto-rendered icons](#auto-rendered-icons)                                   |
| 7 components are NOT built on React Aria       | **Medium** — no RAC keyboard/ARIA        | [Not built on RAC](#components-not-built-on-react-aria)                       |
| AlertDialog should NOT have a Close button     | **Medium** — defeats acknowledgement UX  | [AlertDialog vs Dialog](#alertdialog-vs-dialog-semantics)                     |
| ColorPicker cannot nest ColorSlider            | **High** — runtime error                 | [ColorPicker bug](#colorpicker-nesting-bug)                                   |

---

## Components NOT built on React Aria

These components are fully custom — they do not use React Aria and do not inherit its keyboard navigation, ARIA attributes, or focus management.

| Component | What it uses instead |
|-----------|---------------------|
| **Drawer** | Custom context + plain HTML `<button>` / `<div>` elements with manual transition state |
| **NavigationMenu** | Plain `<nav>`, `<ul>`, `<li>`, `<button>`, `<a>` HTML elements |
| **ScrollArea** | Plain `<div>` elements with CSS-driven scrollbar styling |
| **Avatar** | Plain `<span>` / `<img>` elements |
| **Icon** | Renders the Lucide SVG component directly with BEM sizing classes |
| **Container** | Plain `<div>` that sets `--color-*` CSS custom properties |
| **ColorModeToggle** | Wraps RAC Switch but removes `isSelected`/`onChange` (managed internally) and adds side effects (localStorage, `data-color-mode` on `<html>`) |

### Drawer-specific differences

Drawer's API intentionally diverges from Dialog/AlertDialog:

- Uses **`open`** / `onOpenChange`, NOT `isOpen` / `onOpenChange`.
- `Drawer.Backdrop` must be a **self-closing sibling** of `Drawer.Popup`, not a wrapper around it (opposite of `Dialog.Backdrop`).
- There is **no `Drawer.Actions`** part. Wrap action buttons in a plain `<div>`.
- Trigger and Close are plain `<button>` elements, not RAC Button.
- Custom sub-parts with no RAC equivalent: `Drawer.Handle`, `Drawer.SwipeArea`.

### NavigationMenu-specific differences

- No automatic keyboard navigation or ARIA widget behaviour.
- Consumer must manage dropdown open/close state manually.
- `NavigationMenu.Icon` auto-renders a ChevronDown from Lucide.

---

## Custom props not in React Aria

### `variant` prop

Added to **Button** and **IconButton**. RAC does not have a variant concept.

| Component | Values | Default |
|-----------|--------|---------|
| Button | `'primary'` \| `'neutral'` \| `'ghost'` \| `'danger'` | `'primary'` |
| IconButton | `'primary'` \| `'neutral'` \| `'ghost'` \| `'danger'` | **`'ghost'`** (not `'primary'`) |

### `size` prop

Added to multiple components. RAC does not have a size concept — Tale UI maps it to BEM modifier classes.

| Component | Values | Default | Emits `--md`? |
|-----------|--------|---------|---------------|
| Button, IconButton | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Yes |
| ToggleButton | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Yes |
| Avatar | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` | Yes |
| Radio | `'sm'` \| `'md'` \| `'lg'` | `'md'` | No |
| Input | `'sm'` \| `'md'` \| `'lg'` | `'md'` | No |
| Icon | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` | `'md'` | No |

> **`--md` modifier note:** Button, IconButton, ToggleButton, and Avatar always emit `--md` in the class list (CSS targets it for sizing). Radio, Input, and Icon omit `--md` from the DOM — the base class provides default sizing directly.

### `orientation` prop on CheckboxGroup

RAC's RadioGroup supports `orientation` natively and sets `data-orientation`. RAC's CheckboxGroup does **not**. Tale UI adds this prop to CheckboxGroup and renders `data-orientation` on the DOM so CSS can style horizontal layout.

### `disabled` alias on Button

Button accepts `disabled` as a convenience alias for RAC's `isDisabled`.

### `aria-label` enforcement on IconButton

TypeScript requires either `aria-label` or `aria-labelledby`. Omitting both is a compile error.

---

## Auto-rendered icons

Several components render default icons when no children are provided. Pass children to override.

| Component.Part | Default icon | Lucide import |
|----------------|-------------|---------------|
| `Dialog.Close` | X (close) | `lucide-react` |
| `AlertDialog.Close` | X (close) | `lucide-react` |
| `Popover.Close` | X (close) | `lucide-react` |
| `Combobox.Trigger` | ChevronDown | `lucide-react` |
| `Combobox.ChipRemove` | X (close) | `lucide-react` |
| `Select.Icon` | ChevronDown | `lucide-react` |
| `DatePicker.Trigger` | Calendar | `lucide-react` |
| `DateRangePicker.Trigger` | Calendar | `lucide-react` |
| `NumberField.Increment` | Plus | `lucide-react` |
| `NumberField.Decrement` | Minus | `lucide-react` |
| `Calendar.PreviousButton` | ChevronLeft | `lucide-react` |
| `Calendar.NextButton` | ChevronRight | `lucide-react` |
| `RangeCalendar.PreviousButton` | ChevronLeft | `lucide-react` |
| `RangeCalendar.NextButton` | ChevronRight | `lucide-react` |
| `Accordion.Trigger` | ChevronDown (appended) | `lucide-react` |
| `NavigationMenu.Icon` | ChevronDown | `lucide-react` |
| `Carousel.PreviousTrigger` | ChevronLeft | `lucide-react` |
| `Carousel.NextTrigger` | ChevronRight | `lucide-react` |
| `PaymentInput.CardIcon` | CreditCard | `lucide-react` |
| `RatingStars` | Star (repeated per rating value) | `lucide-react` |
| `Popover.Arrow` | Triangle SVG | inline |
| `Tooltip.Arrow` | Triangle SVG | inline |
| `PreviewCard.Arrow` | Triangle SVG | inline |
| `Menu.Arrow` | Triangle SVG | inline |

**Exception — `Checkbox.Indicator`** does NOT auto-render a checkmark. You must provide one:

```tsx
<Checkbox.Indicator>
  <Icon icon={Check} size="sm" />
</Checkbox.Indicator>
```

**Exception — `SearchField.ClearButton`** does NOT auto-render an icon:

```tsx
<SearchField.ClearButton>
  <Icon icon={X} size="sm" />
</SearchField.ClearButton>
```

---

## Trigger button styling differences

In RAC, triggers are plain unstyled buttons. Tale UI auto-applies BEM classes, but **inconsistently** across components:

| Trigger | Auto-applies `tale-button`? | What you add via `className` |
|---------|:---------------------------:|------------------------------|
| `Dialog.Trigger` | Yes | Variant only: `"tale-button--primary"` |
| `AlertDialog.Trigger` | No | Base + variant: `"tale-button tale-button--danger"` |
| `Drawer.Trigger` / `Drawer.Close` | No | Base + variant: `"tale-button tale-button--neutral"` |
| `Menu.Trigger` | No | Base + variant + size: `"tale-button tale-button--neutral tale-button--md"` |
| `Popover.Trigger` | No | Base + variant + size |
| `Tooltip.Trigger` | No | Base + variant + size |
| `PreviewCard.Trigger` | No | Base + variant, or style as link |

Never nest `<Button>` inside a trigger — triggers render their own `<button>`.

---

## Hardcoded close button styling

`Dialog.Close`, `AlertDialog.Close`, and `Popover.Close` apply fixed BEM classes that cannot be removed, only extended:

```
tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-dialog__close
tale-icon-button tale-icon-button--sm tale-button tale-button--ghost tale-popover__close
```

These are designed for the corner X icon pattern. For action buttons (Cancel, Confirm), use standalone `<Button>` with `onPress={() => setOpen(false)}` or `slot="close"`.

---

## Arrow and Indicator hoisting

Three components automatically extract specific children and render them at a different DOM level than where the consumer places them. This is required by RAC's internal structure.

| Component | Hoisted child | Why |
|-----------|--------------|-----|
| `Popover.Popup` | `Popover.Arrow` | RAC requires `OverlayArrow` as a direct child of `Popover`, not `Dialog` |
| `PreviewCard.Popup` | `PreviewCard.Arrow` | Same reason — arrow must be sibling of dialog content |
| `Tabs.List` | `Tabs.Indicator` | RAC `TabList` filters out non-collection children |

**Consumer impact:** Place the hoisted child as a direct child of the parent listed above. Deeply nesting it inside wrapper `<div>`s will break hoisting.

---

## Meter and ProgressBar value passing

RAC's Meter and ProgressBar expose `percentage` via render props, not context. Tale UI's custom `Indicator` sub-part computes its width independently.

**You must pass `value` to both Root and Indicator:**

```tsx
<Meter.Root value={60}>
  <Meter.Track>
    <Meter.Indicator value={60} />
  </Meter.Track>
</Meter.Root>
```

Omitting `value` on `Indicator` defaults to 0 — the bar will appear empty.

`ProgressBar.Indicator` also supports `value={null}` for indeterminate state (sets `data-indeterminate`).

---

## Custom sub-parts (no RAC equivalent)

These parts are Tale UI additions that don't exist in React Aria Components:

| Component | Custom parts |
|-----------|-------------|
| Dialog | `Actions` |
| Drawer | `Handle`, `SwipeArea` |
| Slider | `Header`, `Control`, `Indicator` |
| Meter | `Header`, `Label`, `Value`, `Indicator`, `Track` |
| ProgressBar | `Header`, `Label`, `Value`, `Indicator`, `Track` |
| Combobox | `InputGroup`, `Chips`, `Chip`, `ChipRemove`, `ItemIndicator`, `Empty` |
| Select | `ItemText`, `ItemIndicator` |
| Radio | `Dot` |
| Field | `Control`, `Item` |
| SearchField | `ClearButton` |
| Menu | `MenuList`, `Arrow`, `CheckboxItem`, `RadioItem`, `LinkItem` |
| Tabs | `Indicator` |

---

## ColorPicker nesting bug

Do **not** nest `ColorSlider` inside `ColorPicker.Root`. RAC's ColorPicker context does not propagate the shared color value correctly, causing:

```
Uncaught Error: Unknown color channel: hue
```

Use standalone components with shared state instead:

```tsx
const [color, setColor] = useState(parseColor('hsb(200, 100%, 100%)'));

<ColorArea.Root value={color} onChange={setColor}>
  <ColorArea.Thumb />
</ColorArea.Root>

<ColorSlider.Root channel="hue" value={color} onChange={setColor}>
  ...
</ColorSlider.Root>
```

---

## Backdrop/Popup nesting rules

| Component | Backdrop relationship to Popup |
|-----------|-------------------------------|
| `Dialog` | Backdrop **wraps** Popup: `<Dialog.Backdrop><Dialog.Popup>...</Dialog.Popup></Dialog.Backdrop>` |
| `AlertDialog` | Backdrop **wraps** Popup (same as Dialog) |
| `Drawer` | Backdrop is a **self-closing sibling**: `<Drawer.Backdrop /><Drawer.Popup>...</Drawer.Popup>` |

Getting this wrong causes the backdrop to remain visible after close.

---

## AlertDialog vs Dialog semantics

`AlertDialog` renders with `role="alertdialog"` and is reserved for actions that **require explicit acknowledgement** — destructive operations, confirmations, or critical warnings. `Dialog` uses the standard `role="dialog"` and is appropriate for general-purpose modals.

**Key difference — close button behaviour:**

- **Dialog**: Include `<Dialog.Close aria-label="Close" />` (corner X icon) — users can freely dismiss.
- **AlertDialog**: **Omit** `AlertDialog.Close` by default. The user should be forced to choose between the explicit actions (e.g. Cancel / Delete). Adding a corner X button allows dismissal without acknowledgement, which defeats the purpose of an alert dialog.

If you do include `AlertDialog.Close`, it **must** behave identically to the safe/non-destructive action (Cancel). Never wire it to the destructive action.

Both components export a `Close` part, but the intended usage differs based on the dialog's semantic role.
