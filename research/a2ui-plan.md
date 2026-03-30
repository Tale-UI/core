<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Create a comprehensive plan to implement Google's A2UI (https://a2ui.org/) into my own custom Design System and Component Library. Assume the agent in the Design System knows nothing about A2UI. Give me this plan in markdown.

A2UI is a declarative protocol where agents stream JSON messages describing UI surfaces and flat lists of components; clients rebuild the tree and render them using native components from a predefined catalog. To integrate it with your design system, you’ll create an A2UI catalog backed by your components, wire up a renderer/bridge, and then teach your “design system agent” to emit A2UI messages instead of (or in addition to) your current formats.[^1][^2][^3][^4][^5]

***

## Objectives

- Allow agents to describe UI using A2UI messages, while your app renders those with your design system’s components (not generic widgets).
- Keep security and safety guarantees: agents can only use components from your approved catalog, and never execute arbitrary code.[^1]
- Make A2UI “native” to your design system so that themes, tokens, layout primitives, and interaction patterns remain consistent.

***

## Phase 0: Frame scope and decisions

1. **Decide where A2UI will be used first**
    - Pick 1–2 concrete flows (e.g., AI-generated forms, dashboards, quick tools) where agent‑driven UI is clearly valuable.
    - Decide whether A2UI is initially “read‑only UI suggestions” or fully interactive (actions routed back to agents).
2. **Choose protocol and renderer versions**
    - Target A2UI v0.8 initially (stable spec for surfaces, components, and adjacency list model), with an eye toward v0.9 features later.[^4][^1]
    - Decide whether you’ll use an official SDK/renderer (e.g., `@a2ui-sdk/react`) or roll your own bridge like the Mantine integration in `@a2ui-bridge/react-mantine`.[^3][^5]
3. **Clarify ownership**
    - Assign a “protocol owner” (you or someone on the DS team) and a “runtime owner” (app/platform team) so protocol changes don’t randomly break the renderer.

***

## Phase 1: Internalize A2UI concepts

1. **Study the core protocol pieces**
    - A2UI defines a streaming protocol where the agent sends messages such as `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, and `deleteSurface` for a given `surfaceId`.[^6][^7]
    - UI is described as a flat `components` array, where each entry has an `id` and a `component` object; parent–child relationships are encoded through properties that reference child component IDs (the “adjacency list model”).[^4][^1]
2. **Understand catalogs and custom catalogs**
    - A “catalog” is the set of allowed component types and their schemas; standard catalogs list things like `Row`, `Column`, `List`, `Card`, `Text`, `Button`, `Image`, etc.[^7][^1][^4]
    - You can define **custom catalogs** that include your own components (or overrides) and have the client announce them to agents; then agents select the catalog per surface via `createSurface.catalogId` or similar metadata.[^2][^1]
3. **Clarify responsibilities**
    - Agent: chooses catalog, composes an adjacency-list tree of components, binds data and declares actions.
    - Client/app: validates messages, reconstructs the tree from the adjacency list, maps component entries to real UI components from your design system, and handles user actions back to the agent.[^2][^1][^4]

Deliverable for this phase: a short internal “A2UI in our stack” note that rephrases these ideas in your own terms and notes any constraints (e.g., only React, only web).

***

## Phase 2: Map your design system primitives to A2UI

1. **Inventory your primitives**
    - List your core layout primitives (Stack, Grid, Row/Column equivalents), typography components, inputs, buttons, cards, tables, alert/toast, etc.
    - For each component, identify: required props, optional props, variant system (size, tone, hierarchy), and alignment with your design tokens.
2. **Map to standard A2UI components**
    - For each A2UI standard component (e.g., `Text`, `Button`, `Row`, `Column`, `List`, `Card`, `Image`), choose the closest match in your library or decide to create a design-system-specific variant.[^7][^1][^4]
    - Capture a mapping table, e.g.:


| A2UI type | Your DS component | Notes |
| :-- | :-- | :-- |
| `Text` | `Typography.Text` | Map `usageHint` to semantic and token styles.[^6][^4] |
| `Button` | `Button` | Map `primary` to variant and `action` to your onClick handler glue.[^6] |
| `Row` | `Stack` direction="row" | Use `weight` as flex-grow; map spacing and alignment props.[^7][^4] |

3. **Identify gaps and custom components**
    - If your system has unique primitives (e.g., “SegmentedControl”, “DataGrid”, “AppShell”), plan to define them as custom catalog components.
    - Note where A2UI’s standard properties aren’t sufficient and you’ll need additional schema fields in the custom catalog.

Deliverable: a “component mapping spec” (markdown/table) that you’ll later encode as a catalog definition.

***

## Phase 3: Design your A2UI catalog for the design system

1. **Decide catalog strategy**
    - Option A: **Extend the standard catalog**: start from the standard catalog and override a few components (e.g., `Button`) while adding a handful of custom ones.[^3][^1][^2]
    - Option B: **Custom catalog only**: create a catalog that mostly mirrors your design system naming and semantics, at the cost of needing more agent‑side training.
2. **Define catalog schemas**
    - For each component type, define a JSON schema (or TS type) that matches A2UI’s object structure: `{ id, component: { <TypeName>: { ...props } }, weight? }`.[^7]
    - Explicitly model any data-binding fields (paths into the `dataModel`) and any action fields (name, context payload, etc.), which the protocol expects on components like `Button`.[^6][^4]
3. **Model layout using adjacency list**
    - Specify which props refer to child IDs: e.g., `Column.children.explicitList` or `Card.child` referencing other component IDs.[^1][^4]
    - Capture recommended layout patterns (e.g., vertical forms, cards with image+body) as reusable “recipes” that your agent will favor.

Deliverable: `a2ui-catalog-design.md` describing catalog ID, component list, and schemas in human form.

***

## Phase 4: Implement a renderer/bridge that uses your components

This assumes a React-based design system; adapt concepts if you’re using another stack.

1. **Choose renderer approach**
    - If you can, use `@a2ui-sdk/react/0.8`, which exposes `A2UIProvider`, `A2UIRenderer`, and a `standardCatalog` you can extend with your own components.[^8][^3]
    - Alternatively, follow the Mantine example using `@a2ui-bridge/react` and `@a2ui-bridge/react-mantine` as a reference for mapping a catalog to existing components while feeding the bridge A2UI messages.[^5]
2. **Create a design-system‑backed catalog**
    - Extend the SDK’s `standardCatalog` and override core components to point to your primitives, e.g. replacing the default `Button` implementation with your `Button` component, and adding new components like `Switch`.[^8][^3]
    - Ensure your implementations obey A2UI props (data binding, `weight`, etc.) but pass through to your own prop shapes via adapters.
3. **Wire provider, renderer, and action handling**
    - Wrap relevant parts of your app with an `A2UIProvider` (or equivalent context) that receives A2UI messages from your agent and a `catalog` object that maps component types to implementations.[^5][^3]
    - Render a `Surface` or `A2UIRenderer` component that takes the reconstructed component tree and renders the appropriate design system components, forwarding user actions back to an `onAction` handler which relays them to the agent.[^6][^5]

Deliverables: a small “A2UI host app” or playground page that renders an example A2UI message and logs actions.

***

## Phase 5: Data model and action wiring

1. **Implement data model updates**
    - Handle `dataModelUpdate` messages that set values at paths (e.g., `/items`) and ensure your renderer can resolve bindings like `{ "path": "name" }` inside components (e.g., card templates).[^6]
    - Store the data model in a dedicated store (e.g., React context or Zustand) and make components read from it via the binding data in props.
2. **Action routing**
    - Interpret `action` objects embedded in components (e.g., a `Button` with `action: { name, context: [...] }`) by converting them into domain‑level events or agent calls.[^6]
    - Define a small action registry that maps action `name` values to handlers in your app, which in turn talk to the agent (or other services).
3. **Bi‑directional loop**
    - When users interact, send actions to the agent; when the agent replies with updated A2UI messages or data model updates, re-run the renderer so the UI evolves without rebuilding the entire page.[^9][^6]

Deliverable: a data+action integration document and a working vertical slice where user interaction causes agent updates that re-render.

***

## Phase 6: Teach your design system agent about A2UI

Assume your current agent knows your components semantically but not A2UI as a wire format.

1. **Update the system prompt and tools**
    - Introduce A2UI in the system prompt as the **only** UI output format the agent is allowed to use for this integration, with a short, model-friendly explanation of surfaces, components, adjacency list, data bindings, and actions.[^4][^1]
    - If you use function calling or tools, define a tool like `emit_a2ui_messages(messages: A2UIMessage[])` with the schema mirroring v0.8 (at minimum `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`).[^7][^6]
2. **Embed your catalog documentation into the agent’s context**
    - Provide a concise, LLM-friendly summary of your catalog: each component name, its role, important props, and example usage.
    - Emphasize which catalog ID(s) to use and that the agent must only use those components and props (no free-form HTML, JS, or ad hoc JSON).
3. **Provide few-shot A2UI examples tied to your design system**
    - Craft a handful of realistic prompts and full A2UI message sequences that show:
        - `beginRendering` with a surface and root ID.
        - `surfaceUpdate` with a Column root, Text heading, List of Cards, Button with `action`.
        - `dataModelUpdate` populating an array of items.
    - Use your catalog component names and realistic data so the agent internalizes adjacency list patterns and your conventions.[^4][^7][^6]
4. **Guardrails and validation feedback**
    - After each agent response, run JSON schema validation against the A2UI spec and your catalog; if invalid, automatically respond with a structured “validation error” prompt and ask the agent to correct the output.[^7][^6]
    - Optionally, maintain a “linting” layer (rules about layout, accessibility, or design-system constraints) whose feedback is fed back to the agent as part of the conversation.

Deliverables: updated system prompt, tool definitions, and a test harness that runs the agent against your few-shot examples and validates the resulting A2UI.

***

## Phase 7: Make it design-system‑native (tokens, theming, accessibility)

1. **Connect A2UI styling to your theme**
    - Map A2UI style hints like `styles.primaryColor` and `styles.font` to your design tokens and typography scale.[^6]
    - Decide whether the agent is allowed to pick colors or fonts at all, or whether it simply picks semantic tokens (e.g., “brand primary”, “danger”) that your renderer resolves.
2. **Express layout and density in your vocabulary**
    - Standard component props like `weight` (flex-grow) on children of `Row`/`Column` can be mapped to your spacing and layout constraints; document recommended compositions so the agent doesn’t guess layout semantics.[^4][^7]
    - Provide patterns to the agent like “two-column form”, “card grid”, “split view” as reusable recipes described in terms of your catalog.
3. **Bake in accessibility constraints**
    - Constrain the catalog schema so certain props are required (e.g., accessible labels for inputs/buttons) and so the agent cannot emit inaccessible patterns (like click-only icons without text).
    - Optionally, post-process A2UI messages with accessibility checks and feed any issues back to the agent.

Deliverables: mapping doc between A2UI styling/structure and your design tokens \& accessibility rules; adjustments to schemas to enforce them.

***

## Phase 8: Tooling, testing, and developer experience

1. **Testing strategy**
    - Create golden A2UI message fixtures for key flows and snapshot-test both the A2UI JSON and the rendered component trees.
    - Add regression tests that run the agent on a fixed prompt set and assert that the resulting UI still validates and meets basic heuristics (no missing IDs, no orphaned children, etc.).[^7][^4]
2. **Developer tooling**
    - Build a small “A2UI inspector” devtool in your app: see the raw A2UI messages, the reconstructed tree, and the props passed into each rendered component.
    - Provide a storybook‑like playground where DS consumers can paste A2UI JSON and see the rendered output via your design system.
3. **Monitoring in production**
    - Log agent A2UI responses (with PII stripped) and validation errors to monitor how well the agent adheres to the protocol and your catalog over time.
    - Add feature flags to enable/disable A2UI‑driven segments for specific user cohorts while you gather UX feedback.

***

## Phase 9: Rollout and iteration

1. **Pilot in low‑risk contexts**
    - Start with internal tools or admin panels where design changes are low risk but representative of real complexity.
    - Collect UX feedback about how “on brand” and usable the generated UIs feel compared to hand‑crafted screens.
2. **Iterate on catalog and recipes**
    - Adjust your catalog schemas and few-shot examples based on common agent errors or awkward layouts; sometimes adding a new higher‑level component (e.g., `Form`, `CardList`) is easier than expecting the agent to assemble them from primitives.
    - Regularly sync catalog changes between client and agent (versioning), especially as A2UI publishes new spec revisions (e.g., v0.9 extension spec and custom catalogs improvements).[^10][^2][^1]
3. **Document for consumers**
    - Add a “Using A2UI with the Design System” section in your DS docs: explain what A2UI is, how surfaces and components work, and how teams can build agent-powered features using your catalog.
    - Offer example integrations (code snippets, A2UI JSON examples) that teams can copy/paste as starting points.

***

## How you might implement this practically

If you want a concrete initial path aligned with your stack:

- Start with a **React-based A2UI playground** that uses `@a2ui-sdk/react/0.8` or an `@a2ui-bridge/react`-style adapter, and swap the default components for yours.[^3][^8][^5]
- Implement only a handful of components in the catalog (Text, Button, Column, Row, Card, TextInput) and wire them to your primitives.
- Add a small internal “A2UI agent” that only knows about these components and a simple data model; wire it via a chat-style UI and use this as your experimental sandbox before rolling into production flows.

If you’d like, I can next take your actual component API (props, naming, theming) and draft a concrete A2UI catalog definition plus example agent prompts tailored to your design system.
<span style="display:none">[^11][^12][^13][^14][^15]</span>

<div align="center">⁂</div>

[^1]: https://deepwiki.com/google/A2UI/3.2-component-model-and-catalogs

[^2]: https://a2ui.org/guides/custom-components/

[^3]: https://libraries.io/npm/@a2ui-sdk%2Freact

[^4]: https://a2ui.org/specification/v0.8-a2ui/

[^5]: https://blog.logrocket.com/a2ui-better-way-ship-agents/

[^6]: https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui

[^7]: https://deepwiki.com/google/A2UI/4-protocol-specification-v0.8

[^8]: https://libraries.io/npm/@a2ui-sdk%2Ftypes

[^9]: https://a2ui.org/introduction/how-to-use/

[^10]: https://a2ui.wiki/specification/v0.9-a2ui/

[^11]: https://a2ui.org/introduction/what-is-a2ui/

[^12]: https://deepwiki.com/google/A2UI/7.3-creating-custom-components

[^13]: https://curateclick.com/blog/2025-the-complete-guide-to-a2ui-protocol

[^14]: https://dev.to/czmilo/a2ui-introduction-jb2

[^15]: https://a2aprotocol.ai/blog/2025-the-complete-guide-to-a2ui-protocol

