# Card

`import { Card } from '@tale-ui/react/card';`

A container component for grouping related content with visual separation. Supports multiple visual styles and structured sections.

## Parts

| Part | Description |
|------|-------------|
| `Card.Root` | Outer container (`<div>`). Accepts `variant` and `padding` props. |
| `Card.Header` | Top section for titles and actions (`<div>`). |
| `Card.Body` | Main content area (`<div>`). |
| `Card.Footer` | Bottom section for actions or metadata (`<div>`). |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'elevated' \| 'outlined' \| 'filled'` | `'outlined'` | Visual style |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding for all sections |

Also accepts all standard `<div>` HTML attributes.

### Header / Body / Footer

| Prop | Type | Default | Description |
|------|------|---------|-------------|

All parts accept standard `<div>` HTML attributes including `className`.

## Basic Usage

```tsx
<Card.Root>
  <Card.Header>
    <Text variant="title" size="m">Card Title</Text>
  </Card.Header>
  <Card.Body>
    <Text variant="text" size="m">Card content goes here.</Text>
  </Card.Body>
</Card.Root>
```

## Examples

### Outlined (Default)

```tsx
<Card.Root variant="outlined">
  <Card.Header>
    <Text variant="title" size="m">Project Settings</Text>
  </Card.Header>
  <Card.Body>
    <Text variant="text" size="m">Configure your project preferences.</Text>
  </Card.Body>
  <Card.Footer>
    <Row gap="s" justify="end">
      <Button>Cancel</Button>
      <Button variant="primary">Save</Button>
    </Row>
  </Card.Footer>
</Card.Root>
```

### Elevated

```tsx
<Card.Root variant="elevated">
  <Card.Body>
    <Text variant="text" size="m">
      An elevated card with a shadow for visual depth.
    </Text>
  </Card.Body>
</Card.Root>
```

### Filled

```tsx
<Card.Root variant="filled">
  <Card.Body>
    <Text variant="text" size="m">
      A filled card with a subtle background color.
    </Text>
  </Card.Body>
</Card.Root>
```

### Padding Sizes

```tsx
<Card.Root padding="sm">
  <Card.Body><Text>Small padding</Text></Card.Body>
</Card.Root>

<Card.Root padding="md">
  <Card.Body><Text>Medium padding (default)</Text></Card.Body>
</Card.Root>

<Card.Root padding="lg">
  <Card.Body><Text>Large padding</Text></Card.Body>
</Card.Root>
```

### Full Example with All Sections

```tsx
<Card.Root variant="outlined" padding="md">
  <Card.Header>
    <Row justify="between" align="center">
      <Text variant="title" size="m">Team Members</Text>
      <Badge variant="brand">3 active</Badge>
    </Row>
  </Card.Header>
  <Card.Body>
    <Column gap="s">
      <Text variant="text" size="m">Alice Johnson</Text>
      <Text variant="text" size="m">Bob Smith</Text>
      <Text variant="text" size="m">Carol Lee</Text>
    </Column>
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">View all</Button>
  </Card.Footer>
</Card.Root>
```

## CSS Classes

- `.tale-card` -- Root container
- `.tale-card--outlined` -- Outlined variant (border)
- `.tale-card--elevated` -- Elevated variant (box-shadow)
- `.tale-card--filled` -- Filled variant (background color)
- `.tale-card--sm` -- Small padding
- `.tale-card--md` -- Medium padding
- `.tale-card--lg` -- Large padding
- `.tale-card__header` -- Header section
- `.tale-card__body` -- Body section
- `.tale-card__footer` -- Footer section

## Pitfalls

<!-- pitfall: card-no-elevated-boolean -->
- **No `elevated` boolean prop** — use `variant="elevated"`; there is also no `variant="raised"`.
  - anti-pattern: `<Card.Root elevated>`
  - fix: `<Card.Root variant="elevated">`
  - complete example:
    ```tsx
    import { Card } from '@tale-ui/react/card';
    
    export function Example() {
      return (
        <Card.Root variant="elevated">
          <Card.Header>Title</Card.Header>
          <Card.Body>Content goes here.</Card.Body>
          <Card.Footer>Footer actions</Card.Footer>
        </Card.Root>
      );
    }
    ```

<!-- pitfall: card-header-no-title-props -->
- **`Card.Header` has no `title` or `description` props** — place `<Text>` or other components directly inside `Card.Header` as children.
  - anti-pattern: `<Card.Header title="Card Title" />`
  - fix: `<Card.Header><Text variant="heading">Card Title</Text></Card.Header>`

<!-- pitfall: card-body-footer-no-gap -->
<!-- multi-idea-ok -->
- **Card.Body and Card.Footer do NOT accept a gap prop** — for stacked content in Card.Body use `<Column gap="...">`, and for side-by-side actions in Card.Footer use `<Row gap="...">` inside these parts.
  - anti-pattern: `<Card.Body gap="m">`
  - anti-pattern: `<Card.Footer gap="s">`
  - fix: `<Card.Body><Column gap="s">…</Column></Card.Body>`
  - fix: `<Card.Footer><Row gap="s">…</Row></Card.Footer>`
<!-- pitfall: for-stat-cards-label-value -->
- **For stat cards, render `<Text color="muted">` inside `Card.Header` — wrap value/badge in `<Column>` inside `Card.Body`** — `Card.Header` has no `title` prop; place a `<Text color="muted">` child directly. `Card.Body` has no `gap` prop; wrap contents in `<Column gap="s">`. Use `<Row gap="m">` to lay out multiple stat cards side by side.
  - anti-pattern: `<Card.Header title="Revenue" />`
  - anti-pattern: `<Card.Body gap="s">`
  - fix: `<Card.Header><Text color="muted">Revenue</Text></Card.Header>`
  - fix: `<Card.Body><Column gap="s"><Text variant="display">$48,200</Text><Badge variant="success">+12%</Badge></Column></Card.Body>`

## Notes

- Custom component -- not built on a React Aria primitive.
- For side-by-side cards, wrapping each `Card.Root` in its own `<Column>` inside a `<Row>` is the recommended layout pattern.
- All parts are optional. Use only what you need.
- Default variant is `outlined`, default padding is `md`.
- The `padding` prop on `Root` controls internal spacing for all child sections via CSS.
