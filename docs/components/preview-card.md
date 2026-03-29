# PreviewCard

`import { PreviewCard } from '@tale-ui/react/preview-card';`

A hover-triggered popover card for previewing content linked to a trigger element.

## Parts

| Part | Description |
|------|-------------|
| `PreviewCard.Root` | Manages open/close state on hover. |
| `PreviewCard.Trigger` | Element that triggers the preview on hover. |
| `PreviewCard.Popup` | Positioned popover container. Accepts `placement` and `offset`. |
| `PreviewCard.Content` | Dialog content inside the popover. Requires `aria-label`. |
| `PreviewCard.Arrow` | Arrow pointing to the trigger. Place inside `Popup`. |

## Props

### Root

| Prop         | Type     | Default | Description                                  |
|--------------|----------|---------|----------------------------------------------|
| `delay`      | `number` | `400`   | Delay in ms before opening on hover          |
| `closeDelay` | `number` | `300`   | Delay in ms before closing after hover ends  |

All other parts accept standard HTML attributes plus an optional `className`. `Popup` accepts React Aria `Popover` props (`placement`, `offset`, etc.).

## Basic Usage

```tsx
import { PreviewCard } from '@tale-ui/react/preview-card';

<PreviewCard.Root>
  <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
  <PreviewCard.Popup placement="bottom" offset={8}>
    <PreviewCard.Content aria-label="Preview">
      <div style={{ maxWidth: '280px' }}>
        <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Preview Title</h4>
        <p style={{ margin: 0, fontSize: 'var(--text-s-font-size)' }}>
          This is a preview card with some descriptive text content that appears on hover.
        </p>
      </div>
    </PreviewCard.Content>
  </PreviewCard.Popup>
</PreviewCard.Root>
```

## Examples

### With Image

```tsx
<PreviewCard.Root>
  <PreviewCard.Trigger>Preview with image</PreviewCard.Trigger>
  <PreviewCard.Popup placement="bottom" offset={8}>
    <PreviewCard.Content aria-label="Image preview">
      <div style={{ maxWidth: '300px' }}>
        <div style={{ width: '100%', height: '120px', background: 'var(--neutral-20)' }}>
          Image placeholder
        </div>
        <div style={{ padding: 'var(--space-xs)' }}>
          <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Card with Image</h4>
          <p style={{ margin: 0, fontSize: 'var(--text-s-font-size)' }}>
            A preview card that includes an image area above the text content.
          </p>
        </div>
      </div>
    </PreviewCard.Content>
  </PreviewCard.Popup>
</PreviewCard.Root>
```

### With Arrow

```tsx
<PreviewCard.Root>
  <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
  <PreviewCard.Popup placement="bottom" offset={8}>
    <PreviewCard.Arrow />
    <PreviewCard.Content aria-label="Preview">
      <div style={{ maxWidth: '280px' }}>
        <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>Preview Title</h4>
        <p style={{ margin: 0, fontSize: 'var(--text-s-font-size)' }}>
          This preview card includes an arrow pointing to the trigger.
        </p>
      </div>
    </PreviewCard.Content>
  </PreviewCard.Popup>
</PreviewCard.Root>
```

## CSS Classes

- `.tale-preview-card__trigger` — Trigger element
- `.tale-preview-card__popup` — Popover container
- `.tale-preview-card__arrow` — Arrow element
- `.tale-preview-card` — Dialog content

## Notes

- **Trigger needs explicit styling.** `PreviewCard.Trigger` applies `tale-preview-card__trigger` (no visual styling). Add `className="tale-button tale-button--{variant}"` for button styling, or style it as a link.
- The card opens on hover, not on click. Use `Popover` if you need click-to-open behavior.
- `PreviewCard.Content` requires an `aria-label` since there is no built-in Title part.
- `PreviewCard.Arrow` can be placed anywhere inside `Popup` — it renders the pointer towards the trigger.
