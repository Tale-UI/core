# Troubleshooting — Tale UI Demo App

This document lists the errors encountered during development and how each was fixed.

---

## 1. Layout forced before page fully loaded (FOUC warning)

**Error:**
```
Layout was forced before the page was fully loaded. If stylesheets are not yet loaded
this may cause a flash of unstyled content. jquery.min.js:4:20140
```

**Cause:** The browser attempted layout before CSS had finished loading. This is a browser-level warning from a DevTools extension (jQuery-based), not from our code.

**Fix:** This is a benign warning, typically caused by browser extensions. No code change needed. If it persists, ensure `@tale-ui/react/styles` is imported at the top of the app entry before any component renders.

---

## 2. Missing `aria-label` accessibility warnings (x16)

**Error:**
```
If you do not provide a visible label, you must specify an aria-label or
aria-labelledby attribute for accessibility
```

**Cause:** Several components lacked either a visible `<Label>` sub-part or an `aria-label` prop. React Aria enforces this at runtime. The affected components were:

- `ToggleButtonGroup` — no label or `aria-label`
- `Table` — used `<Table>` directly instead of `<Table.Root>`, so the `aria-label` prop was not passed to the underlying `<table>` element

**Fix:**
- Added `aria-label="Text formatting"` to `<ToggleButtonGroup>`
- Changed `<Table aria-label="...">` to `<Table.Root aria-label="...">`

---

## 3. Hooks order error in `Drawer.Backdrop`

**Error:**
```
React has detected a change in the order of Hooks called by Drawer.Backdrop.
This will lead to bugs and errors if not fixed.

   Previous render            Next render
   ------------------------------------------------------
1. useContext                 useContext
2. undefined                  useCallback
```

**Cause:** `Drawer.Backdrop` was used as a wrapper around `Drawer.Popup` (like `Dialog.Backdrop`), but the Drawer component expects `Backdrop` to be a self-closing sibling — not a parent. Wrapping caused conditional hook execution inside the Backdrop component.

**Fix:** Changed from wrapping pattern to sibling pattern:

```diff
  <Drawer.Root>
    <Drawer.Trigger>Open Drawer</Drawer.Trigger>
-   <Drawer.Backdrop>
-     <Drawer.Popup>...</Drawer.Popup>
-   </Drawer.Backdrop>
+   <Drawer.Backdrop />
+   <Drawer.Popup>...</Drawer.Popup>
  </Drawer.Root>
```

---

## 4. "Element type is invalid" crash on interaction

**Error:**
```
Uncaught Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: object.
Check the render method of `App`.
```

**Cause:** `<Table>` was used as a JSX element directly. The `Table` export from `@tale-ui/react/table` is a namespace object (containing `.Root`, `.Header`, `.Body`, etc.), not a renderable component. Using it directly as `<Table>` passed the namespace object to React, which cannot render it.

**Fix:** Changed `<Table aria-label="...">` to `<Table.Root aria-label="...">` and the closing `</Table>` to `</Table.Root>`.

---

## 5. Missing favicon (404)

**Error:**
```
GET http://localhost:5175/favicon.ico [HTTP/1.1 404 Not Found 0ms]
```

**Cause:** The browser automatically requests `/favicon.ico` and no file existed.

**Fix:** Added an empty data-URI favicon in `index.html` to suppress the request:

```html
<link rel="icon" href="data:,">
```

---

## 6. NumberField Decrement/Increment children

**Original code:**
```jsx
<NumberField.Decrement>-</NumberField.Decrement>
<NumberField.Increment>+</NumberField.Increment>
```

**Fix:** Per the docs, these buttons render their own icons. Changed to self-closing:
```jsx
<NumberField.Decrement />
<NumberField.Increment />
```

---

## 7. Meter.Value and ProgressBar.Value need children

**Original code:**
```jsx
<Meter.Value />
<ProgressBar.Value />
```

**Cause:** These components are `aria-hidden` display elements — they require explicit text children to show the current value.

**Fix:** Provided explicit value text:
```jsx
<Meter.Value>30%</Meter.Value>
<ProgressBar.Value>60%</ProgressBar.Value>
```

---

## 8. Dark/light mode toggle has no visible effect

**Error:** Clicking the dark mode `Switch` toggle does not change the page theme.

**Cause:** Tale UI uses three states for colour mode, not two:

1. **No attribute** — respects `prefers-color-scheme` (browser/OS preference)
2. `data-color-mode="dark"` — forces dark mode
3. `data-color-mode="light"` — forces light mode

The original toggle removed the `data-color-mode` attribute to switch to "light":

```jsx
// Broken — removing the attribute falls back to prefers-color-scheme
useEffect(() => {
  if (dark) {
    document.documentElement.setAttribute('data-color-mode', 'dark');
  } else {
    document.documentElement.removeAttribute('data-color-mode');
  }
}, [dark]);
```

On a browser with dark mode preference, removing the attribute causes Tale UI to fall back to `@media (prefers-color-scheme: dark)` — which applies the dark theme again. The toggle was effectively switching from dark to dark.

**Fix:** Always set an explicit value — `"dark"` or `"light"` — so the attribute overrides the browser preference in both directions:

```jsx
const [dark, setDark] = useState(() => {
  const explicit = document.documentElement.getAttribute('data-color-mode');
  if (explicit) return explicit === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});

useEffect(() => {
  document.documentElement.setAttribute('data-color-mode', dark ? 'dark' : 'light');
}, [dark]);
```

The initial state also reads the browser preference via `matchMedia` so the toggle starts in the correct position.

---

## 9. Calendar: `TypeError: can't access property "calendar", date is undefined`

**Error:**
```
Uncaught TypeError: can't access property "calendar", date is undefined
    $11d87f3f76e88657$export$b4a036af3fc0b032 conversion.mjs:189
    $14e0f24ef4ac5c92$export$a18c89cbd24170ff queries.mjs:21
    CalendarCell Calendar.mjs:282
```

**Cause:** `Calendar.Cell` was used inside `Calendar.GridHeader` instead of `Calendar.GridHeaderCell`.

`Calendar.GridHeader` uses a render prop whose argument is a **day name string** (e.g. `"Mon"`), not a date object. `Calendar.Cell` expects a `date` prop containing a `CalendarDate` object from `@internationalized/date`. When `Calendar.Cell` is used in the header, `date` is `undefined`, so the internal code crashes trying to read `.calendar` on it.

**Incorrect:**
```jsx
<Calendar.GridHeader>
  {(day) => <Calendar.Cell>{day}</Calendar.Cell>}
</Calendar.GridHeader>
```

**Fix:** Use `Calendar.GridHeaderCell` for weekday labels in the header:
```jsx
<Calendar.GridHeader>
  {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
</Calendar.GridHeader>
```

`Calendar.Cell` should only be used inside `Calendar.GridBody`, where the render prop provides actual date objects:
```jsx
<Calendar.GridBody>
  {(date) => <Calendar.Cell date={date} />}
</Calendar.GridBody>
```

---

## Summary of files changed

| File | Changes |
|------|---------|
| `src/App.jsx` | Fixed Table.Root, Drawer.Backdrop, ToggleButtonGroup aria-label, NumberField buttons, Meter/ProgressBar values, dark mode toggle, Calendar GridHeaderCell |
| `index.html` | Added empty favicon |
