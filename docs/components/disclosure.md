# Disclosure

`import { Disclosure } from '@tale-ui/react/disclosure';`

A single collapsible section that toggles visibility of its content panel.

## Parts

| Part | Description |
|------|-------------|
| `Disclosure.Root` | Wrapper managing expanded state |
| `Disclosure.Trigger` | Button that toggles the panel |
| `Disclosure.Panel` | Collapsible content area |

## Basic Usage

```tsx
<Disclosure.Root>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This is the hidden content revealed when the disclosure is expanded.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

## Examples

### Default Expanded

```tsx
<Disclosure.Root defaultExpanded>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This content is visible by default.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

### Disabled

```tsx
<Disclosure.Root isDisabled>
  <Disclosure.Trigger>Show more</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This content cannot be toggled.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

### Controlled

```tsx
const [isExpanded, setIsExpanded] = useState(false);

<Disclosure.Root isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
  <Disclosure.Trigger>{isExpanded ? 'Collapse' : 'Expand'}</Disclosure.Trigger>
  <Disclosure.Panel>
    <p>This disclosure is controlled externally via useState.</p>
  </Disclosure.Panel>
</Disclosure.Root>
```

## CSS Classes

- `.tale-disclosure` — Root container
- `.tale-disclosure__trigger` — Toggle button
- `.tale-disclosure__panel` — Collapsible content area

## Notes

- Built on React Aria `Disclosure` and `DisclosurePanel`.
- Supports both uncontrolled (`defaultExpanded`) and controlled (`isExpanded` + `onExpandedChange`) modes.
- The panel's expand/collapse animation uses the `--disclosure-panel-height` CSS variable (set in `_primitives.css`).
- For multiple collapsible sections, use the Accordion component instead.
