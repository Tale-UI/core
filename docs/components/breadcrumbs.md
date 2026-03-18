# Breadcrumbs

`import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';`

A navigation trail showing the current page location within a hierarchy.

## Parts

| Part | Description |
|------|-------------|
| `Breadcrumbs.Root` | Ordered list container (`<ol>`). |
| `Breadcrumbs.Item` | A single breadcrumb entry (`<li>`). |
| `Breadcrumbs.Link` | The clickable link inside an item. Omit `href` for the current (last) item. |

## Basic Usage

```tsx
<Breadcrumbs.Root>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link>Widget</Breadcrumbs.Link>
  </Breadcrumbs.Item>
</Breadcrumbs.Root>
```

## Examples

### Long Path

```tsx
<Breadcrumbs.Root>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Category</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Subcategory</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link>Widget Pro</Breadcrumbs.Link>
  </Breadcrumbs.Item>
</Breadcrumbs.Root>
```

## CSS Classes

- `.tale-breadcrumbs` — Base
- `.tale-breadcrumbs__item` — List item
- `.tale-breadcrumbs__link` — Link element

## Notes

- Omit the `href` prop on the last `Breadcrumbs.Link` to mark it as the current page.
- Built on React Aria `Breadcrumbs`, `Breadcrumb`, and `Link` components.
- The last item in the breadcrumb trail automatically receives `data-current`, which styles it as non-interactive text.
