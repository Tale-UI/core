# Troubleshooting

## Custom theme from Scale app not applying

### Problem

The [Scale app](https://tale-ui.github.io/core/scale) generates theme CSS with two layers:

1. **Raw palette variables** on `:root` (e.g. `--ezuewfq-60`, `--llpm-80`) — these are internal values.
2. **Token mappings** inside scoped utility classes (e.g. `.color-ezuewfq`, `.neutral-llpm`) — these map the palette values to the `--brand-*` and `--neutral-default-*` tokens that components actually read.

```css
/* Generated output — palette values are on :root... */
:root {
  --ezuewfq-60: #00802c;
  /* ... */
}

/* ...but the token overrides are scoped to a class */
.color-ezuewfq {
  --brand-60: var(--ezuewfq-60);
  /* ... */
}
```

Because `--brand-*` and `--neutral-default-*` are set inside class selectors, they only take effect on elements that have those classes applied. If you paste the generated CSS as-is and don't add the classes anywhere, the token overrides never activate and the default theme remains unchanged.

### Fix

Replace the scoped class selectors with `:root` so the overrides apply globally. You can also inline the final hex values and remove the intermediate palette variables entirely:

```css
/* Before (doesn't work without adding classes to your HTML) */
:root {
  --ezuewfq-60: #00802c;
}
.color-ezuewfq {
  --brand-60: var(--ezuewfq-60);
}

/* After (applies globally) */
:root {
  --brand-60: #00802c;
}
```

Do the same for the neutral scale — move all `--neutral-default-*` assignments from the `.neutral-*` class into `:root`.

### Accent-mode themes (foreground pivot overrides)

Some colour scales are light enough that the default foreground colour doesn't meet contrast requirements. The Scale app handles this by generating **fg pivot overrides** — rules that flip `--color-60-fg`, `--color-40-fg`, etc. between light and dark text. These are also scoped to the utility class:

```css
/* Generated — scoped to class, won't apply globally */
:where(html:not([data-color-mode="dark"])) .color-avva {
  --color-60-fg: var(--color-100);
}

html[data-color-mode="dark"] .color-avva {
  --color-40-fg: var(--color-5);
  --color-50-fg: var(--color-5);
}
```

**Fix:** Remove the `.color-*` descendant selector so the overrides target `html` / `:root` directly:

```css
/* After — applies globally */
html:not([data-color-mode="dark"]) {
  --color-60-fg: var(--color-100);
}

html[data-color-mode="dark"] {
  --color-40-fg: var(--color-5);
  --color-50-fg: var(--color-5);
}
```

Do the same for any `@media (prefers-color-scheme: dark)` blocks — remove the `.color-*` class from the selector.

### Dark-mode accent background override ignored

The Scale app's second option includes a dark-mode `--neutral-5` override using `color-mix`:

```css
/* Generated — specificity (0,1,0) */
[data-color-mode="dark"] {
  --neutral-5: color-mix(in srgb, var(--avva-100) 50%, black);
}
```

This gets overridden by the core's dark-mode rule which uses `html[data-color-mode="dark"]` — specificity (0,1,1). The bare attribute selector `[data-color-mode="dark"]` at (0,1,0) loses.

**Fix:** Add `html` to match the core's specificity. Since your stylesheet loads after the core, cascade order then ensures your rule wins:

```css
/* After — specificity (0,1,1), wins via cascade order */
html[data-color-mode="dark"] {
  --neutral-5: color-mix(in srgb, var(--brand-100) 50%, black);
}
```

### Summary of changes when pasting Scale output

1. **`--brand-*` overrides** — move from `.color-*` class to `:root`
2. **`--neutral-default-*` overrides** — move from `.neutral-*` class to `:root`
3. **`--color-*-fg` pivot overrides** — remove the `.color-*` descendant from every selector
4. **Dark-mode `--neutral-5` accent override** — use `html[data-color-mode="dark"]` (not bare `[data-color-mode="dark"]`) to match the core's specificity
5. **Intermediate palette variables** (e.g. `--avva-60`) — can be inlined as hex values and removed
