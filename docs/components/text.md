# Text

`import { Text } from '@tale-ui/react/text';`

A typographic primitive for rendering text with design-system typography variants and color options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'display' \| 'heading' \| 'title' \| 'label' \| 'text' \| 'mono'` | `'text'` | Typography variant |
| `size` | `'xs' \| 's' \| 'm' \| 'l'` | `'m'` | Size within the chosen variant |
| `as` | `'p' \| 'span' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div' \| 'label'` | `'span'` | HTML element to render |
| `color` | `'default' \| 'muted' \| 'accent'` | `'default'` | Text color |

Also accepts all standard HTML attributes for the rendered element.

## Basic Usage

```tsx
<Text variant="heading" size="l">Welcome back</Text>
```

## Examples

### Variants

```tsx
<Text variant="display" size="l">Display</Text>
<Text variant="heading" size="l">Heading</Text>
<Text variant="title" size="l">Title</Text>
<Text variant="label" size="l">Label</Text>
<Text variant="text" size="l">Text</Text>
<Text variant="mono" size="l">Mono</Text>
```

### Sizes

```tsx
<Text variant="text" size="xs">Extra small</Text>
<Text variant="text" size="s">Small</Text>
<Text variant="text" size="m">Medium</Text>
<Text variant="text" size="l">Large</Text>
```

### Colors

```tsx
<Text color="default">Default color</Text>
<Text color="muted">Muted color</Text>
<Text color="accent">Accent color</Text>
```

### Semantic Elements

```tsx
<Text as="h1" variant="display" size="l">Page Title</Text>
<Text as="h2" variant="heading" size="l">Section Heading</Text>
<Text as="p" variant="text" size="m">Body paragraph text.</Text>
<Text as="label" variant="label" size="s">Form label</Text>
```

### Combined

```tsx
<Text as="h1" variant="display" size="l" color="accent">
  Hero Title
</Text>
<Text as="p" variant="text" size="m" color="muted">
  A supporting description rendered as a paragraph.
</Text>
<Text variant="mono" size="s" color="muted">
  const x = 42;
</Text>
```

## CSS Classes

- `.tale-text` -- Base
- `.tale-text--muted` -- Muted color variant
- `.tale-text--accent` -- Accent color variant
- Typography is applied via `text--{variant}-{size}` foundation classes (e.g. `text--heading-l`, `text--label-s`)

## Pitfalls

<!-- pitfall: text-no-bare-paragraph-tags -->
- **Never use bare `<p>` paragraph tags or `<span>` for visible text** — Tale UI's typography tokens (color, size, variant) are only applied through `Text`; bare paragraph tags are forbidden just like bare heading tags.
  - anti-pattern: `<p style={{ color: 'gray' }}>This action cannot be undone.</p>`
  - fix: `<Text color="muted">This action cannot be undone.</Text>`
  - complete example:
    ```tsx
    import { Text } from '@tale-ui/react/text';
    
    export function Example() {
      return (
        <>
          <Text variant="heading" size="l" as="h1">Page title</Text>
          <Text variant="text" color="muted">Secondary info</Text>
          <Text variant="mono" size="s" as="code">const x = 1;</Text>
        </>
      );
    }
    ```

<!-- pitfall: text-size-valid-values -->
- **`size` only accepts `'xs'`, `'s'`, `'m'`, `'l'`** — no other size tokens are valid.
  - anti-pattern: `<Text size="sm">Hello</Text>`
  - fix: `<Text size="s">Hello</Text>`

<!-- pitfall: text-mono-not-code -->
- **Monospace variant is `"mono"`, NOT `"code"`** — use `variant="mono"` for monospace text.
  - anti-pattern: `<Text variant="code">console.log(x)</Text>`
  - fix: `<Text variant="mono">console.log(x)</Text>`

<!-- pitfall: text-no-invalid-variants -->
- **No `'link'`, `'code'`, or `'caption'` variant** — valid values are `'display'`, `'heading'`, `'title'`, `'label'`, `'text'`, `'mono'`.
  - anti-pattern: `<Text variant="caption">Fine print</Text>`
  - fix: `<Text variant="label">Fine print</Text>`

<!-- pitfall: text-no-html-for-prop -->
- **No `htmlFor` prop on `Text`** — use `as="label"` and pass `htmlFor` as a standard HTML attribute.
  - anti-pattern: `<Text htmlFor="email">Email</Text>`
  - fix: `<Text as="label" htmlFor="email">Email</Text>`

<!-- pitfall: text-as-prop-valid-elements -->
- **`as` prop only accepts `'p'`, `'span'`, `'div'`, `'h1'`–`'h6'`, `'label'`** — not `'strong'`, `'code'`, `'pre'`, or other elements.
  - anti-pattern: `<Text as="strong">Bold</Text>`
  - fix: `<Text variant="label">Bold</Text>`

<!-- pitfall: text-color-valid-values -->
- **`color` only accepts `'default'`, `'muted'`, `'accent'`** — no other color values are valid.
  - anti-pattern: `<Text color="secondary">Note</Text>`
  - fix: `<Text color="muted">Note</Text>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Default variant is `text`, default size is `m`, default color is `default`.
- The `as` prop controls which HTML element is rendered (default `span`). Choose semantic elements for accessibility (e.g. `h1`-`h6` for headings, `p` for paragraphs).
- Typography styles (font-size, line-height, font-weight, letter-spacing) come from the design system's foundation typography classes, not from BEM modifiers.
