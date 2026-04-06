# Cross-Component Pitfalls

Common mistakes that span multiple Tale UI components. Component-specific pitfalls live in
`docs/components/{name}.md ## Pitfalls` and are surfaced via `get_component`.

---

## Trigger Styling

Tale UI overlay triggers do not support `asChild`. Button-based triggers
(`Menu.Trigger`, `Popover.Trigger`, `Dialog.Trigger`, `AlertDialog.Trigger`,
`Drawer.Trigger`, `Tooltip.Trigger`) render their own `<button>` element.
`PreviewCard.Trigger` renders a `<span>`, and `ContextMenu.Trigger` renders a `<div>`.

<!-- pitfall: no-asChild-on-triggers -->
<!-- applies-to: Menu, Popover, Dialog, AlertDialog, Drawer, Tooltip, PreviewCard, ContextMenu -->
<!-- category: trigger-styling -->
- **Never use `asChild` on any Tale UI trigger** — Tale UI trigger components expose their own public structure and do not support `asChild`. Passing it causes TypeScript errors.
  - anti-pattern: `<Menu.Trigger asChild><Button variant="primary">File</Button></Menu.Trigger>`
  - fix: `<Menu.Trigger className="tale-button tale-button--primary tale-button--md">File</Menu.Trigger>`

<!-- pitfall: no-button-inside-trigger -->
<!-- applies-to: Menu, Popover, Dialog, AlertDialog, Drawer, Tooltip -->
<!-- category: trigger-styling -->
- **Never nest `<Button>` or `<IconButton>` inside a trigger** — this creates a `<button>` inside a `<button>` (invalid HTML) and breaks keyboard/pointer interactions. Style the trigger directly with BEM class names.
  - anti-pattern: `<Dialog.Trigger><Button variant="neutral">Open</Button></Dialog.Trigger>`
  - fix: `<Dialog.Trigger className="tale-button tale-button--neutral tale-button--md">Open</Dialog.Trigger>`

The trigger styling table below shows which triggers auto-apply `tale-button` and which need
explicit BEM class names:

<!-- trigger-table-start -->
| Trigger | Auto-applies tale-button | Notes |
|---|---|---|
| `Dialog.Trigger` | Yes | Add variant: `tale-button--primary` |
| `AlertDialog.Trigger` | Yes | Add variant: `tale-button--danger` |
| `Drawer.Trigger` | Yes | Add variant class |
| `Popover.Trigger` | Yes | Add variant class |
| `Menu.Trigger` | No | Add full BEM: `tale-button tale-button--neutral tale-button--md` |
| `Tooltip.Trigger` | No | Add full BEM or use `<IconButton>` pattern |
| `PreviewCard.Trigger` | No | Add full BEM |
| `ContextMenu.Trigger` | No | Wraps any child element; typically plain text or an element |
<!-- trigger-table-end -->

---

## Controlled State Patterns

<!-- pitfall: no-null-state-without-type -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, ColorArea, ColorSlider, ColorWheel, ColorPicker -->
<!-- category: controlled-state -->
- **Never write `useState(null)` without a type annotation for date/color components** — TypeScript infers the literal `null` type, making the setter incompatible with the component's `onChange` prop. Always annotate: `useState<Type | null>(null)`.
  - anti-pattern: `const [value, setValue] = useState(null);`
  - fix: `type T = Parameters<NonNullable<React.ComponentProps<typeof RangeCalendar.Root>['onChange']>>[0]; const [value, setValue] = useState<T | null>(null);`

<!-- pitfall: derive-date-type-from-props -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->
- **Derive date value types from component props, not third-party imports** — `DateValue`, `RangeValue`, and `ZonedDateTime` are not exported from any `@tale-ui/react/*` module. Importing them causes "has no exported member" TypeScript errors. Use the prop-derived pattern instead.
  - anti-pattern: `import type { DateValue } from '@tale-ui/react/calendar';`
  - fix: `type DateVal = Parameters<NonNullable<React.ComponentProps<typeof Calendar.Root>['onChange']>>[0];`

<!-- pitfall: no-native-date -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->
- **Never use native JavaScript `Date` objects with date components** — React Aria uses `DateValue` (an international date type), not native `Date`. Passing a `Date` object or a `[Date, Date]` tuple causes type errors and runtime failures.
  - anti-pattern: `<Calendar.Root value={new Date()} />`
  - fix: Use uncontrolled (`defaultValue` only) or derive the type from the component's `onChange` prop.

<!-- pitfall: no-internationalized-date-import -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->
- **Do not import `parseDate` from `@internationalized/date` unless it is a direct project dependency** — it is an internal package not available in consumer projects. Importing it causes "Cannot find module" TypeScript errors.
  - anti-pattern: `import { parseDate } from '@internationalized/date';`
  - fix: Use `defaultValue` with a plain date string, or install `@internationalized/date` explicitly as a dependency.

<!-- pitfall: no-locale-prop-on-calendar -->
<!-- applies-to: Calendar, RangeCalendar -->
<!-- category: controlled-state -->
- **Do not pass a `locale` prop to `Calendar.Root` or `RangeCalendar.Root`** — that prop does not exist and causes TypeScript errors. For locale support, wrap the component tree in `<I18nProvider locale="en-US">` from `@tale-ui/react/i18n-provider`.
  - anti-pattern: `<Calendar.Root locale="en-US" />`
  - fix: `<I18nProvider locale="en-US"><Calendar.Root /></I18nProvider>`

---

## Color State Imports

<!-- pitfall: color-imports-from-rac -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel, ColorField, ColorPicker, ColorSwatchPicker -->
<!-- category: color-state -->
- **Import `parseColor` and `Color` from `react-aria-components`, not `@internationalized/color`** — `@internationalized/color` is an internal dependency not available in consumer projects. Always use the `react-aria-components` exports.
  - anti-pattern: `import { parseColor } from '@internationalized/color';`
  - fix: `import { parseColor } from 'react-aria-components'; import type { Color } from 'react-aria-components';`

<!-- pitfall: color-swatch-string-only -->
<!-- applies-to: ColorSwatch -->
<!-- category: color-state -->
- **`ColorSwatch` always accepts a plain CSS string, not a `Color` object** — when `ColorSwatch` is driven by shared color state (a `Color` object from `useState`), serialize it first. Passing a raw `Color` object causes a TypeScript error.
  - anti-pattern: `<ColorSwatch color={colorObject} />`
  - fix: `<ColorSwatch color={colorObject.toString('css')} />`

<!-- pitfall: no-color-extract-channel -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel -->
<!-- category: color-state -->
- **Do not extract a numeric channel value and pass it as `value`** — color components expect a full `Color` object for `value`, not a number extracted from it (e.g. `color.hue`). Do not write a separate handler that reconstructs color from a number.
  - anti-pattern: `<ColorSlider.Root value={color.hue} onChange={h => setColor(parseColor(\`hsl(\${h}, 100%, 50%)\`))} />`
  - fix: `<ColorSlider.Root value={color} onChange={setColor} channel="hue" />`

<!-- pitfall: no-color-pojo-state -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel, ColorPicker -->
<!-- category: color-state -->
- **Do not initialize color state with a plain JS object** — `{ h: 200, s: 100, v: 100 }` is not a valid `Color` instance. Use `parseColor('hsl(200, 100%, 50%)')` to create a proper initial value.
  - anti-pattern: `useState({ h: 200, s: 100, v: 100, alpha: 1 })`
  - fix: `useState(parseColor('hsl(200, 100%, 50%)'))`

---

## React Aria Conventions

<!-- pitfall: minvalue-maxvalue-not-min-max -->
<!-- applies-to: Meter, ProgressBar, Slider, NumberField -->
<!-- category: react-aria -->
- **Use `minValue`/`maxValue` props, not `min`/`max`** — React Aria uses camelCase prop names. Passing `min={0} max={100}` causes "is not assignable to type RootProps" TypeScript errors.
  - anti-pattern: `<Meter.Root value={75} min={0} max={100}>`
  - fix: `<Meter.Root value={75} minValue={0} maxValue={100}>`

<!-- pitfall: selectedkey-not-value -->
<!-- applies-to: Select, Combobox, Tabs -->
<!-- category: react-aria -->
- **Use `selectedKey`/`onSelectionChange` for controlled selection, not `value`/`onChange`** — passing `value` to `Select.Root`, `Combobox.Root`, or `Tabs.Root` causes "is not assignable to type" TypeScript errors. React Aria uses selection keys.
  - anti-pattern: `<Select.Root value={selected} onChange={setSelected}>`
  - fix: `<Select.Root selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>`

<!-- pitfall: defaultexpandedkeys-not-defaultopen -->
<!-- applies-to: Accordion -->
<!-- category: react-aria -->
- **`Accordion.Root` uses `defaultExpandedKeys` (an array), not `defaultOpen` or `defaultValue`** — both `defaultOpen` and `defaultValue` are common React/HTML patterns that do not exist on `AccordionRootProps`; using them causes TypeScript errors.
  - anti-pattern: `<Accordion.Root defaultOpen={true}>`
  - fix: `<Accordion.Root defaultExpandedKeys={['item-id']}>`

<!-- pitfall: defaultselectedkey-not-defaultvalue-tabs -->
<!-- applies-to: Tabs -->
<!-- category: react-aria -->
- **`Tabs.Root` uses `defaultSelectedKey`, not `defaultValue`** — passing `defaultValue` causes "is not assignable to type RootProps" TypeScript errors.
  - anti-pattern: `<Tabs.Root defaultValue="overview">`
  - fix: `<Tabs.Root defaultSelectedKey="overview">`

---

## Import Path Patterns

<!-- pitfall: no-deep-subpath-imports -->
<!-- applies-to: * -->
<!-- category: imports -->
- **Never import from nested paths like `@tale-ui/react/button/Button.styled`** — only the package-level path (`@tale-ui/react/button`) is valid. Deep subpath imports cause "Cannot find module" TypeScript errors.
  - anti-pattern: `import { Button } from '@tale-ui/react/button/Button.styled';`
  - fix: `import { Button } from '@tale-ui/react/button';`

<!-- pitfall: usefilter-from-rac-not-react-aria -->
<!-- applies-to: Autocomplete -->
<!-- category: imports -->
- **Import `useFilter` from `react-aria-components`, not `react-aria`** — the two packages export different things. Using `react-aria` causes "Module has no exported member 'useFilter'" TypeScript errors.
  - anti-pattern: `import { useFilter } from 'react-aria';`
  - fix: `import { useFilter } from 'react-aria-components';`

<!-- pitfall: no-cross-import-checkbox-group -->
<!-- applies-to: Checkbox, CheckboxGroup -->
<!-- category: imports -->
- **`CheckboxGroup` and `Checkbox` have separate import paths — do not cross-import** — `CheckboxGroup` is at `@tale-ui/react/checkbox-group`; `Checkbox` is at `@tale-ui/react/checkbox`. Cross-importing causes "Module has no exported member" TypeScript errors.
  - anti-pattern: `import { CheckboxGroup } from '@tale-ui/react/checkbox';`
  - fix: `import { CheckboxGroup } from '@tale-ui/react/checkbox-group';`

<!-- pitfall: no-color-component-from-color-picker -->
<!-- applies-to: ColorArea, ColorSlider, ColorSwatch, ColorSwatchPicker -->
<!-- category: imports -->
- **Color sub-components are not exported from `@tale-ui/react/color-picker`** — each has its own import path. Importing from `color-picker` causes "has no exported member" TypeScript errors.
  - anti-pattern: `import { ColorArea, ColorSwatch } from '@tale-ui/react/color-picker';`
  - fix: `import { ColorArea } from '@tale-ui/react/color-area'; import { ColorSwatch } from '@tale-ui/react/color-swatch';`

<!-- pitfall: toggle-button-group-import-path -->
<!-- applies-to: ToggleButtonGroup -->
<!-- category: imports -->
- **`ToggleButtonGroup` is exported from `@tale-ui/react/toggle-button`, not `@tale-ui/react/toggle-button-group`** — there is no `toggle-button-group` module; importing from it causes "Cannot find module" TypeScript errors. Also valid: `@tale-ui/react/toggle-group`.
  - anti-pattern: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-button-group';`
  - fix: `import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';`

<!-- pitfall: textarea-hyphenated-path -->
<!-- applies-to: TextArea -->
<!-- category: imports -->
- **`TextArea` import path is hyphenated: `@tale-ui/react/text-area`** — using `@tale-ui/react/textarea` (no hyphen) causes "Cannot find module" TypeScript errors.
  - anti-pattern: `import { TextArea } from '@tale-ui/react/textarea';`
  - fix: `import { TextArea } from '@tale-ui/react/text-area';`

<!-- pitfall: no-label-component -->
<!-- applies-to: SelectNative -->
<!-- category: imports -->
- **There is no `@tale-ui/react/label` module and no `Label` component in Tale UI** — use a native `<label htmlFor="...">` HTML element instead.
  - anti-pattern: `import { Label } from '@tale-ui/react/label';`
  - fix: `<label htmlFor="country">Country</label>`

---

## Layout Patterns

<!-- pitfall: use-row-not-flex-div -->
<!-- applies-to: Row, Column -->
<!-- category: layout -->
- **Use `<Row>` for horizontal layouts instead of `<div style={{ display: 'flex' }}>`** — `Row` (from `@tale-ui/react/row`) applies the correct gap tokens and is the Tale UI convention. Similarly use `<Column>` for vertical stacks.
  - anti-pattern: `<div style={{ display: 'flex', gap: '8px' }}>`
  - fix: `<Row gap="s">`

<!-- pitfall: column-needs-explicit-import -->
<!-- applies-to: Column -->
<!-- category: layout -->
- **`Column` is never globally available — always import it explicitly** — `Column` is not re-exported from `@tale-ui/react/row` or any other module. Omitting the import causes "Cannot find name 'Column'" TypeScript errors.
  - anti-pattern: `<Column gap="m">` (without importing)
  - fix: `import { Column } from '@tale-ui/react/column';`

<!-- pitfall: row-justify-shorthand -->
<!-- applies-to: Row -->
<!-- category: layout -->
- **`Row` `justify` prop uses shorthand tokens, not CSS property values** — `'space-between'` is not valid. Use `'between'`.
  - anti-pattern: `<Row justify="space-between">`
  - fix: `<Row justify="between">`

<!-- pitfall: row-no-css-flex-props -->
<!-- applies-to: Row -->
<!-- category: layout -->
- **`Row` does not accept raw CSS flex properties like `alignItems`, `flexDirection`, or `flexWrap`** — passing these causes TypeScript errors. Use `style` for one-off overrides.
  - anti-pattern: `<Row alignItems="center">`
  - fix: `<Row style={{ alignItems: 'center' }}>`

<!-- pitfall: container-is-not-layout -->
<!-- applies-to: Container -->
<!-- category: layout -->
- **`Container` is a colour palette wrapper, not a layout component** — do not use it as a `<div>` replacement. Use `<Column>` for vertical stacks and `<Row>` for horizontal layouts.

<!-- pitfall: no-global-styles-on-semantic-html -->
<!-- applies-to: * -->
<!-- category: layout -->
- **Do not apply global styles to semantic HTML elements** — Tale UI components render `<section>`, `<header>`, `<button>`, etc. internally. Global rules targeting those elements will leak into overlays and popovers.

---

## Visual Exports

<!-- pitfall: no-visual-exports-for-interactive-ui -->
<!-- applies-to: Checkbox, Radio, Switch, ToggleButton -->
<!-- category: visual-exports -->
- **Never use `.Visual` exports for interactive UI** — `Checkbox.Visual`, `Radio.Visual`, `Switch.Visual`, and `ToggleButtonVisual` are `aria-hidden` building blocks for custom composition only. They have no keyboard/pointer interaction and no accessible labelling.

---

## Dark Mode

<!-- pitfall: dark-mode-attribute-required -->
<!-- applies-to: * -->
<!-- category: dark-mode -->
- **Always set `data-color-mode` to `"dark"` or `"light"` on `<html>` — never remove the attribute** — removing the attribute (instead of switching its value) causes all `--color-*` and `--neutral-*` tokens to revert to their light defaults even in dark mode.
  - anti-pattern: `document.documentElement.removeAttribute('data-color-mode');`
  - fix: `document.documentElement.setAttribute('data-color-mode', 'light');`

---

## General Conventions

<!-- pitfall: no-jsx-element-return-type -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **Never annotate component return types as `JSX.Element` or use `React.FC`** — this project uses the new JSX transform. Write plain functions with no return type annotation. Always include a space between `export` and `function`.
  - anti-pattern: `export const MyComponent: React.FC = () => { ... }`
  - fix: `export function MyComponent() { ... }`

<!-- pitfall: token-size-suffixes -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **CSS design tokens use `-s`/`-m`/`-l` suffixes; component `size` props use `-sm`/`-md`/`-lg`** — e.g. `--space-s` is a token, but `size="sm"` is a prop value. Token scale: `4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl`.

<!-- pitfall: gap-max-is-2xl -->
<!-- applies-to: Row, Column -->
<!-- category: typescript -->
- **Max `gap` value for `Row`/`Column` is `'2xl'`** — there is no `'3xl'` or `'4xl'` gap token. Using them produces no visible spacing (token is undefined).
  - anti-pattern: `<Row gap="3xl">`
  - fix: `<Row gap="2xl">`

<!-- pitfall: no-variant-on-html-elements -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **Do not add `variant`, `size`, or `color` props to native HTML elements** — these props only exist on Tale UI components. They are silently ignored on `<div>`, `<p>`, `<span>`, etc.

<!-- pitfall: use-image-not-img -->
<!-- applies-to: Image -->
<!-- category: typescript -->
- **Use `<Image>` from `@tale-ui/react/image` instead of `<img>`** — `Image` applies radius, lazy loading, and correct CSS. Use its `radius` prop (not `borderRadius`) and `width`/`height` (not `size`).
  - anti-pattern: `<img src="..." style={{ borderRadius: '50%' }} />`
  - fix: `<Image src="..." radius="full" width={40} height={40} />`

<!-- pitfall: no-heading-component -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **There is no `Heading` component in Tale UI** — for headings, use `<Text variant="heading" as="h2">`. Importing `{ Heading }` from any `@tale-ui/react/*` path causes "has no exported member 'Heading'" TypeScript errors.
  - anti-pattern: `import { Heading } from '@tale-ui/react';`
  - fix: `import { Text } from '@tale-ui/react/text'; ... <Text variant="heading" as="h2">Title</Text>`
