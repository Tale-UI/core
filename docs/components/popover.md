# Popover

`import { Popover } from '@tale-ui/react/popover';`

A positioned overlay anchored to a trigger button, with optional arrow and close button.

## Parts

| Part | Description |
|------|-------------|
| `Popover.Root` | Manages open/close state. |
| `Popover.Trigger` | Button that toggles the popover. |
| `Popover.Popup` | Positioned overlay container. Accepts `placement` and `offset`. |
| `Popover.Arrow` | Arrow pointing to the trigger. Place inside `Popup` (auto-hoisted). |
| `Popover.Title` | Heading with `slot="title"`. |
| `Popover.Description` | Description paragraph. |
| `Popover.Close` | Button that closes the popover via `slot="close"`. |

## Basic Usage

```tsx
import { Popover } from '@tale-ui/react/popover';
import { Button } from '@tale-ui/react/button';

<Popover.Root>
  <Popover.Trigger>
    <Button>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Title>Popover Title</Popover.Title>
    <Popover.Description>
      This is a basic popover with a title and description.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

## Examples

### With Arrow

```tsx
<Popover.Root>
  <Popover.Trigger>
    <Button>With Arrow</Button>
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Arrow />
    <Popover.Title>Arrow Popover</Popover.Title>
    <Popover.Description>
      This popover includes an arrow pointing to the trigger.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

### With Close Button

```tsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Popup placement="bottom" offset={8}>
    <Popover.Close aria-label="Close">X</Popover.Close>
    <Popover.Title>Dismissible Popover</Popover.Title>
    <Popover.Description>
      Click the close button to dismiss this popover.
    </Popover.Description>
  </Popover.Popup>
</Popover.Root>
```

## CSS Classes

- `.tale-popover__popup` — Popover content container
- `.tale-popover__arrow` — Arrow element
- `.tale-popover__title` — Title heading
- `.tale-popover__description` — Description paragraph
- `.tale-popover__close` — Close button

## Notes

- **Trigger needs explicit `tale-button` classes.** `Popover.Trigger` applies no base class. Add `className="tale-button tale-button--{variant}"` for button styling.
- **`Popover.Close` is for the icon-only X button** (positioned top-right via `tale-popover__close`). For styled action buttons inside the popover, use `<Button>` instead.
- `Popover.Arrow` can be placed anywhere inside `Popup` -- it is automatically hoisted to be a direct child of the RA Popover (required by React Aria).
- Supported `placement` values: `"top"`, `"bottom"`, `"left"`, `"right"`.
- The popover is dismissable by default (clicking outside closes it).
