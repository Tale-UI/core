# A2UI Integration Guide

Render AI agent UIs using the Tale UI Design System. This guide covers setting up `@tale-ui/a2ui` — a renderer that takes [A2UI protocol](https://a2ui.org/) messages and renders them as fully-themed, accessible Tale UI components.

---

## Quick Start

```tsx
import { A2UIProvider, A2UISurface, useA2UI } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

function App() {
  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <AgentConnection />
      <A2UISurface surfaceId="main" />
    </A2UIProvider>
  );
}

function AgentConnection() {
  const { processMessage } = useA2UI();

  useEffect(() => {
    ws.onmessage = (e) => processMessage(JSON.parse(e.data));
  }, [processMessage]);

  return null;
}

function handleAction(surfaceId: string, action: { name: string; context?: Record<string, unknown> }) {
  // Route actions back to your agent via WebSocket, API call, etc.
  ws.send(JSON.stringify({ surfaceId, action }));
}
```

---

## Architecture

```
Agent (LLM)                              Your React App
    │                                         │
    │  A2UI JSON messages                     │
    │  (beginRendering, surfaceUpdate,        │
    │   dataModelUpdate, deleteSurface)       │
    ▼                                         ▼
┌─────────────────────────────────────────────────┐
│  A2UIProvider                                   │
│  ├── catalog    (component type → Tale UI)      │
│  ├── surfaces   (component tree state)          │
│  ├── dataStores (reactive path-based stores)    │
│  └── onAction   (routes user actions to agent)  │
│                                                 │
│  A2UISurface                                    │
│  └── A2UINode (recursive)                       │
│      ├── catalog lookup                         │
│      ├── adapter (A2UI props → Tale UI props)   │
│      ├── data binding resolution                │
│      └── action handler wiring                  │
└─────────────────────────────────────────────────┘
                    │
                    ▼
         Tale UI React Components
         (Button, Card, Table, etc.)
```

---

## How It Works

### 1. Protocol Messages

A2UI defines four message types:

| Message | Purpose | Example |
|---------|---------|---------|
| `beginRendering` | Start a new surface | `{ type: "beginRendering", surfaceId: "main", rootComponentId: "root" }` |
| `surfaceUpdate` | Add/update components | `{ type: "surfaceUpdate", surfaceId: "main", components: [...] }` |
| `dataModelUpdate` | Set data at a path | `{ type: "dataModelUpdate", surfaceId: "main", path: "name", value: "Alice" }` |
| `deleteSurface` | Remove a surface | `{ type: "deleteSurface", surfaceId: "main" }` |

### 2. Adjacency-List Component Model

Components are a **flat array** — not a nested tree. Parent-child relationships are encoded by referencing child IDs in props:

```json
{
  "type": "surfaceUpdate",
  "surfaceId": "main",
  "components": [
    { "id": "root", "component": { "Column": { "spacing": "m", "children": ["heading", "btn"] } } },
    { "id": "heading", "component": { "Text": { "content": "Hello", "usageHint": "heading-m" } } },
    { "id": "btn", "component": { "Button": { "label": "Click me", "variant": "primary", "action": { "name": "click" } } } }
  ]
}
```

The renderer reconstructs this into a tree and renders:

```tsx
<Column gap="m">
  <Text variant="heading" size="m" as="h3">Hello</Text>
  <Button variant="primary" onPress={() => dispatch("click")}>Click me</Button>
</Column>
```

### 3. Data Binding

Components can bind to the surface's data model using `{ path: "..." }` references:

```json
{ "id": "name-input", "component": { "TextInput": { "label": "Name", "binding": { "path": "userName" } } } }
```

Set the value via `dataModelUpdate`:

```json
{ "type": "dataModelUpdate", "surfaceId": "main", "path": "userName", "value": "Alice" }
```

The component reactively reads the value and re-renders when it changes.

### 4. Actions

Interactive components declare actions that are routed back to the agent:

```json
{ "id": "save", "component": { "Button": { "label": "Save", "action": { "name": "save", "context": { "formId": "profile" } } } } }
```

When clicked, your `onAction` callback receives `("main", { name: "save", context: { formId: "profile" } })`.

---

## Catalog Reference

The default catalog maps all 21 A2UI standard component types to Tale UI.

<!-- BEGIN:A2UI_CATALOG_TABLES -->
| A2UI Type | Tale UI Component | Key A2UI Props |
|-----------|-------------------|----------------|
| `Text` | `Text` | `usageHint`, `color`, `content` |
| `Row` | `Row` | `spacing`, `alignment`, `justify`, `wrap` |
| `Column` | `Column` | `spacing`, `alignment`, `justify` |
| `Card` | `Card.Root` | `variant`, `padding` |
| `Image` | `Image` | `src`, `alt`, `radius`, `fit`, `width`, `height` |
| `List` | `List.Root` | `variant`, `density` |
| `ListItem` | `List.Item` | `content` |
| `Badge` | `Badge` | `tone`, `size`, `type`, `label` |
| `Icon` | `Icon` | `name`, `size`, `label` |
| `Separator` | `Separator` | `orientation` |
| `Link` | `Link` | `href`, `target`, `label` |
| `Button` | `Button` | `variant`, `size`, `disabled`, `action`, `label` |
| `TextInput` | `TextField.Root` | `binding`, `defaultValue`, `disabled`, `readOnly`, `required`, `action`, `label`, `description`, `errorMessage` |
| `Checkbox` | `Checkbox.Root` | `binding`, `defaultSelected`, `disabled`, `action`, `label` |
| `Radio` | `RadioGroup` | `binding`, `defaultValue`, `disabled`, `label`, `action` |
| `Select` | `Select.Root` | `binding`, `defaultValue`, `disabled`, `label`, `action` |
| `Switch` | `Switch.Root` | `binding`, `defaultSelected`, `disabled`, `action`, `label` |
| `Table` | `Table.Root` | `label`, `selectionMode` |
| `Tabs` | `Tabs.Root` | `defaultTab` |
| `Progress` | `ProgressBar.Root` | `value`, `maxValue`, `indeterminate`, `label` |
| `Spinner` | `Spinner` | `variant`, `size`, `label` |
| `Form` | `Form` | `action` |
| `CardHeader` | `Card.Header` | -- |
| `CardBody` | `Card.Body` | -- |
| `CardFooter` | `Card.Footer` | -- |

**Text `usageHint` values:**

| Hint | Maps to | HTML element |
|------|---------|-------------|
| `display-l` | display (l) | `h1` |
| `display-m` | display (m) | `h1` |
| `display-s` | display (s) | `h2` |
| `heading-l` | heading (l) | `h2` |
| `heading-m` | heading (m) | `h3` |
| `heading-s` | heading (s) | `h4` |
| `heading` | heading (m) | `h3` |
| `title` | title (m) | `h4` |
| `label` | label (m) | `span` |
| `body` | text (m) | `p` |
| `body-s` | text (s) | `p` |
| `caption` | text (xs) | `span` |
| `mono` | mono (m) | `span` |
<!-- END:A2UI_CATALOG_TABLES -->

---

## Custom Catalog

Extend the standard catalog with your own component types:

```tsx
import { createCatalog } from '@tale-ui/a2ui/catalog';
import { Dialog } from '@tale-ui/react/dialog';

const catalog = createCatalog({
  // Override existing type
  Button: {
    component: MyCustomButton,
    adapter: (props, ctx) => ({ ...defaultAdapter(props, ctx), theme: 'custom' }),
  },
  // Add new type
  ConfirmDialog: {
    component: Dialog.Root,
    adapter: (props, ctx) => ({
      isOpen: true,
      children: ctx.children,
    }),
  },
});

<A2UIProvider catalog={catalog} onAction={handleAction}>
  <A2UISurface surfaceId="main" />
</A2UIProvider>
```

---

## Icon Registry

A2UI `Icon` components reference icons by name string (e.g. `"search"`, `"user"`). The package includes 65 built-in lucide-react icons. Add more at runtime:

```tsx
import { registerIcons, getIconNames } from '@tale-ui/a2ui';
import { Rocket, Flame } from 'lucide-react';

registerIcons({ rocket: Rocket, flame: Flame });

console.log(getIconNames()); // [...built-in, "flame", "rocket"]
```

Unknown icon names fall back to `HelpCircle`.

---

## Validation

Validate A2UI messages before rendering to catch agent errors early:

```tsx
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

const result = validateMessages(messages, taleUICatalog);

if (!result.valid) {
  // Feed errors back to the agent for self-correction
  agent.send({
    role: 'user',
    content: `Your A2UI output has errors:\n${formatErrors(result.errors)}\nPlease fix and resend.`,
  });
}
```

**What it checks:**

| Check | Error type | Example |
|-------|-----------|---------|
| Message structure | `missing_field` | Missing `surfaceId` on surfaceUpdate |
| Message type | `invalid_message_type` | Unknown message type `"renderUI"` |
| Component types | `unknown_component_type` | `"Dropdown"` not in catalog |
| Duplicate IDs | `duplicate_id` | Two components with id `"root"` |
| Orphaned refs | `orphaned_reference` | Child ID `"missing"` doesn't exist |

---

## Multiple Surfaces

Render multiple independent surfaces in the same app:

```tsx
<A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
    <A2UISurface surfaceId="left-panel" fallback={<Spinner />} />
    <A2UISurface surfaceId="right-panel" fallback={<Spinner />} />
  </div>
</A2UIProvider>
```

Each surface has its own component tree and data model.

---

## Streaming Updates

A2UI is designed for streaming. Send `surfaceUpdate` messages incrementally — the renderer merges new components into the existing tree:

```tsx
const { processMessage } = useA2UI();

// Initial render
processMessage({ type: 'beginRendering', surfaceId: 'chat', rootComponentId: 'root' });
processMessage({ type: 'surfaceUpdate', surfaceId: 'chat', components: [initialComponents] });

// Later: add more components (existing ones are preserved)
processMessage({ type: 'surfaceUpdate', surfaceId: 'chat', components: [newComponents] });

// Update data reactively
processMessage({ type: 'dataModelUpdate', surfaceId: 'chat', path: 'status', value: 'complete' });
```

---

## Flex Weight

Use `weight` on components for flex-grow behavior inside Row/Column layouts:

```json
[
  { "id": "sidebar", "component": { "Column": {} }, "weight": 1 },
  { "id": "main", "component": { "Column": {} }, "weight": 3 }
]
```

This renders the sidebar at 25% and main content at 75%.

---

## Agent Prompt

The package includes an LLM-friendly system prompt at `packages/a2ui/src/agent/system-prompt.md`. Use it as the system prompt (or append it) for agents that emit A2UI messages. It documents:

- All available component types and their props
- Layout rules (Column for vertical, Row for horizontal)
- Data binding syntax
- Action declaration syntax
- Accessibility requirements

Five few-shot examples are included in `packages/a2ui/src/agent/examples/`:

| Example | Description |
|---------|-------------|
| `simple-form.json` | Login form with text inputs and submit button |
| `card-list.json` | Product cards with images, titles, badges |
| `dashboard.json` | Stats cards, progress bar, data-bound values |
| `settings-page.json` | Switches, selects, divided lists |
| `data-table.json` | Table in a card with header actions |

---

## Playground

The Vite playground includes an interactive A2UI demo:

```bash
pnpm playground:dev
# Open http://localhost:5173/a2ui
```

The demo lets you:
- Switch between pre-built examples
- Edit A2UI JSON and load it live
- See validation errors in real-time
- Watch actions dispatched in an action log

---

## Design System Integration

A2UI rendering inherits all Tale UI design system features automatically:

| Feature | How it works |
|---------|-------------|
| **Dark mode** | All `--color-*` and `--neutral-*` tokens auto-invert — zero agent effort |
| **Theming** | Wrap `A2UISurface` in `<Container color="indigo">` for per-surface color themes |
| **Responsive** | Spacing tokens use `clamp()` — layouts adapt between 480px–1600px automatically |
| **Accessibility** | React Aria provides WAI-ARIA, keyboard nav, and focus management |
| **Typography** | `Text` component maps `usageHint` to the full typography token scale |

---

## Troubleshooting

**Surface doesn't render**
- Ensure `beginRendering` is sent before `surfaceUpdate`
- Check that `surfaceId` matches between messages and `<A2UISurface surfaceId="...">`
- Check that `rootComponentId` in `beginRendering` matches an `id` in the components array

**Unknown component type warning**
- The component type name must exactly match a key in the catalog (case-sensitive)
- Check `Object.keys(taleUICatalog)` for available types

**Actions not firing**
- Ensure your `onAction` callback is provided to `<A2UIProvider>`
- Check that the component has an `action` prop with `{ name: "..." }`

**Data binding not updating**
- Send `dataModelUpdate` messages to set values at paths
- The `path` in the binding must exactly match the `path` in `dataModelUpdate`
