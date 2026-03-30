# @tale-ui/a2ui

A2UI protocol renderer for the Tale UI Design System. Maps A2UI agent messages to fully-themed, accessible Tale UI React components.

## What is A2UI?

[A2UI](https://a2ui.org/) is a declarative protocol where AI agents stream JSON messages describing UI surfaces. Clients render them using native components from a predefined catalog. This package bridges A2UI with Tale UI.

## Quick Start

```tsx
import { A2UIProvider, A2UISurface } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

function App() {
  const handleAction = (surfaceId: string, action: { name: string; context?: Record<string, unknown> }) => {
    // Route actions back to your agent
    console.log('Action:', surfaceId, action);
  };

  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <A2UISurface surfaceId="main" />
    </A2UIProvider>
  );
}
```

## Feeding Messages

```tsx
import { useA2UI } from '@tale-ui/a2ui/renderer';

function AgentConnection() {
  const { processMessage } = useA2UI();

  useEffect(() => {
    // From WebSocket, SSE, or function call results
    ws.onmessage = (event) => {
      processMessage(JSON.parse(event.data));
    };
  }, [processMessage]);

  return null;
}
```

## Catalog

The default catalog maps all 21 A2UI standard component types:

| A2UI Type | Tale UI Component |
|-----------|-------------------|
| Text | Text |
| Button | Button |
| Row | Row |
| Column | Column |
| Card | Card.Root |
| Image | Image |
| List | List.Root |
| TextInput | TextField.Root |
| Checkbox | Checkbox.Root |
| Radio | RadioGroup |
| Select | Select.Root |
| Switch | Switch.Root |
| Table | Table.Root |
| Tabs | Tabs.Root |
| Badge | Badge |
| Progress | ProgressBar.Root |
| Spinner | Spinner |
| Separator | Separator |
| Link | Link |
| Icon | Icon |
| Form | Form |

### Custom Catalog

Extend with your own components:

```tsx
import { createCatalog } from '@tale-ui/a2ui/catalog';
import { MyWidget } from './MyWidget';

const catalog = createCatalog({
  MyWidget: {
    component: MyWidget,
    adapter: (props, ctx) => ({
      title: props.title,
      children: ctx.children,
    }),
  },
});
```

## Validation

Validate A2UI messages before rendering:

```tsx
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

const result = validateMessages(messages, taleUICatalog);
if (!result.valid) {
  console.error(formatErrors(result.errors));
}
```

## Architecture

```
packages/a2ui/src/
├── types.ts              # A2UI protocol types
├── catalog.ts            # 21 standard + custom catalog entries
├── icon-registry.ts      # Icon name → lucide-react component
├── index.ts              # Public API
├── renderer/
│   ├── tree.ts           # Flat adjacency-list → tree
│   ├── useDataModel.ts   # Path-based reactive data store
│   ├── useActionDispatcher.ts  # Action routing
│   ├── A2UIProvider.tsx  # Context provider
│   ├── A2UISurface.tsx   # Surface renderer
│   └── A2UINode.tsx      # Recursive node renderer
├── validation/
│   └── validate.ts       # Message + catalog validation
└── agent/
    ├── system-prompt.md  # LLM-friendly catalog reference
    └── examples/         # Few-shot A2UI fixtures
```
