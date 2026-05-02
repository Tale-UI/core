# Switch

`import { Switch } from '@tale-ui/react/switch';`

A toggle switch component with a sliding thumb, built on React Aria's Switch.

## Parts

| Part | Description |
|------|-------------|
| `Switch.Root` | The switch label and toggle wrapper |
| `Switch.Thumb` | The sliding thumb indicator |

## Props

Accepts all React Aria `Switch` props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | -- | Additional CSS class name |

### Visual

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the switch visual appears on/checked |

`Switch.Visual` is `aria-hidden` — for component composition only, not application UI. See [Visual-Only Exports](visual-exports.md).

## Basic Usage

```tsx
<Switch.Root>
  <Switch.Thumb />
  Enable notifications
</Switch.Root>
```

## Examples

### Selected by Default

```tsx
<Switch.Root defaultSelected>
  <Switch.Thumb />
  Dark mode
</Switch.Root>
```

### Disabled

```tsx
<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled switch
</Switch.Root>
```

### Disabled and Selected

```tsx
<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled and on
</Switch.Root>
```

### All States

```tsx
<Switch.Root>
  <Switch.Thumb />
  Default (off)
</Switch.Root>

<Switch.Root defaultSelected>
  <Switch.Thumb />
  Default (on)
</Switch.Root>

<Switch.Root isDisabled>
  <Switch.Thumb />
  Disabled (off)
</Switch.Root>

<Switch.Root isDisabled defaultSelected>
  <Switch.Thumb />
  Disabled (on)
</Switch.Root>
```

## CSS Classes

- `.tale-switch` -- Base (root label)
- `.tale-switch__thumb` -- The sliding thumb element

## Pitfalls

<!-- pitfall: switch-no-label-indicator-sub-parts -->
<!-- multi-idea-ok -->
- **No Label or Indicator sub-parts — only Root and Thumb** — `Switch` has only `Switch.Root` and `Switch.Thumb`. Label text is placed as a direct child of `Switch.Root`, not in a sub-part.
  - anti-pattern: `<Switch.Label>Enable</Switch.Label>`
  - fix: `<Switch.Root><Switch.Thumb />Enable</Switch.Root>`
  - complete example:
    ```tsx
    import { Switch } from '@tale-ui/react/switch';
    
    export function Example() {
      return (
        <Switch.Root>
          <Switch.Thumb />
          Enable notifications
        </Switch.Root>
      );
    }
    ```

<!-- cross-pitfall-ref: no-visual-exports-for-interactive-ui -->
<!-- pitfall: use-defaultselected-to-turn-a -->
- **Use `defaultSelected` to turn a switch on by default in settings rows** — `Switch.Root` accepts `defaultSelected` (uncontrolled initial state) or `isSelected`/`onChange` (controlled). For a settings-card layout with a label on the left and the switch on the right, place `<Text>` and `<Switch.Root>` inside a `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>` — do not rely on text flowing after `<Switch.Thumb />` for this pattern.
  - anti-pattern: `<Switch.Root on><Switch.Thumb />Email notifications</Switch.Root>`
  - fix: `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Email notifications</Text><Switch.Root defaultSelected><Switch.Thumb /></Switch.Root></Row>`

<!-- pitfall: use-switch-card-layout-for-settings-prompts -->
- **Use `Switch`, `Card`, `Column`, `Row`, `Text` for settings-card prompts with preference switches** — when the request is to show a card containing labeled toggle switches, render `Card.Root` with `Card.Header` plus `Card.Body`, wrap each switch row in `<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>` with a `<Text>` label on the left and `<Switch.Root>` on the right, and stack all rows in `<Column gap="s">` inside `Card.Body` instead of leaving the file empty.
  - anti-pattern: `// empty file`
  - fix: `import { Card } from '@tale-ui/react/card'; import { Switch } from '@tale-ui/react/switch'; import { Column } from '@tale-ui/react/column'; import { Row } from '@tale-ui/react/row'; import { Text } from '@tale-ui/react/text'; export function NotificationSettings() { return <Card.Root><Card.Header><Text variant="heading">Notification Preferences</Text></Card.Header><Card.Body><Column gap="s"><Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Email notifications</Text><Switch.Root defaultSelected><Switch.Thumb /></Switch.Root></Row><Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>Push notifications</Text><Switch.Root><Switch.Thumb /></Switch.Root></Row><Row style={{ justifyContent: 'space-between', alignItems: 'center' }}><Text>SMS notifications</Text><Switch.Root><Switch.Thumb /></Switch.Root></Row></Column></Card.Body></Card.Root>; }`

## Notes

- Use `defaultSelected` for uncontrolled or `isSelected`/`onChange` for controlled state.
- The label text is placed as a child of `Switch.Root`, alongside `Switch.Thumb`.
- Supports `data-readonly`, `data-required`, and `data-invalid` attributes for corresponding states.
