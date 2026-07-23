# Add `KeyValuePairs` to Tale UI

## Summary

Add a new stable `@tale-ui/react/key-value-pairs` display component inspired by Cloudscape's Key-value pairs component, while using Tale UI's normal namespace API, BEM styling, token system, generated docs surfaces, A2UI catalog integration, and audit workflow.

The component will be a custom semantic HTML description-list primitive, not a React Aria wrapper, because React Aria does not provide this pattern. It will render real `<dl>`, `<dt>`, and `<dd>` markup for accessibility, with responsive multi-column layout based on Cloudscape's `columns` and `minColumnWidth` behavior.

References used for planning:

- Cloudscape docs: https://cloudscape.design/components/key-value-pairs/
- Cloudscape source: https://github.com/cloudscape-design/components/tree/main/src/key-value-pairs
- Tale UI add-component workflow: `/Users/admin/.agents/skills/tale-ui-add-component/SKILL.md`
- Tale UI repo conventions: [CLAUDE.md](../../CLAUDE.md)

## Public API

Create a namespace component:

```tsx
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';

<KeyValuePairs.Root columns={2} minColumnWidth={180} variant="divided">
  <KeyValuePairs.Item>
    <KeyValuePairs.Term>Status</KeyValuePairs.Term>
    <KeyValuePairs.Details>Active</KeyValuePairs.Details>
  </KeyValuePairs.Item>
</KeyValuePairs.Root>;
```

### Export Path

Add package export:

```json
"./key-value-pairs": "./src/key-value-pairs/index.ts"
```

### Namespace Parts

Expose these parts from `packages/react/src/key-value-pairs/KeyValuePairs.styled.tsx`:

```ts
KeyValuePairs.Root;
KeyValuePairs.Item;
KeyValuePairs.Term;
KeyValuePairs.Details;
KeyValuePairs.Info;
KeyValuePairs.Group;
KeyValuePairs.GroupTitle;
KeyValuePairs.GroupList;
```

### Type Exports

From `packages/react/src/key-value-pairs/index.ts`:

```ts
export * as KeyValuePairs from './KeyValuePairs.styled';

export type {
  RootProps as KeyValuePairsRootProps,
  ItemProps as KeyValuePairsItemProps,
  TermProps as KeyValuePairsTermProps,
  DetailsProps as KeyValuePairsDetailsProps,
  InfoProps as KeyValuePairsInfoProps,
  GroupProps as KeyValuePairsGroupProps,
  GroupTitleProps as KeyValuePairsGroupTitleProps,
  GroupListProps as KeyValuePairsGroupListProps,
} from './KeyValuePairs.styled';
```

## Component Contract

### `KeyValuePairs.Root`

Renders `<dl>`.

Props:

```ts
type Columns = 1 | 2 | 3 | 4;
type Variant = 'plain' | 'divided';
type Density = 'compact' | 'default' | 'spacious';

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'dl'>, 'className'> {
  /** Maximum number of columns. @default 1 */
  columns?: Columns | undefined;
  /** Desired minimum column width in pixels. @default 150 */
  minColumnWidth?: number | undefined;
  /** Visual style. `divided` adds separators between pairs. @default 'plain' */
  variant?: Variant | undefined;
  /** Vertical spacing density. @default 'default' */
  density?: Density | undefined;
  className?: string | undefined;
}
```

Runtime behavior:

- Clamp `columns` to `1..4` for JavaScript consumers.
- Default `columns` to `1`.
- Default `minColumnWidth` to `150`.
- If `minColumnWidth` is not a finite positive number, use `150`.
- Use standard React `aria-label` and `aria-labelledby`; do not add Cloudscape-style `ariaLabel` or `ariaLabelledby`.

Responsive column resolution:

- Use an internal element ref plus forwarded ref merged via `useMergedRefs`.
- Use `ResizeObserver` to calculate the current column count:
  - Read root width via `getBoundingClientRect().width`.
  - Read computed `columnGap`.
  - Calculate `Math.floor((width + gap) / (minColumnWidth + gap))`.
  - Clamp to `1..columns`.
- Store the resolved count in state and expose it as a CSS custom property:
  - `--tale-key-value-pairs-columns`
- Also expose the resolved count as `data-columns="1" | "2" | "3" | "4"` so CSS can make divider decisions without relying on unsupported `var()` usage inside `:nth-child()`.
- Preserve consumer `style` while adding the internal CSS variable. Destructure `style` from props and merge it into a typed style object:

  ```ts
  type KeyValuePairsStyle = React.CSSProperties & {
    '--tale-key-value-pairs-columns'?: number;
  };

  const rootStyle: KeyValuePairsStyle = {
    ...style,
    '--tale-key-value-pairs-columns': resolvedColumns,
  };
  ```

- Apply `style={rootStyle}` to the root. The component-owned `--tale-key-value-pairs-columns` value intentionally wins over any consumer-provided value for that same custom property; all other consumer styles are preserved.
- If `ResizeObserver` is unavailable, fall back to the normalized `columns` value.
- Use `useIsoLayoutEffect` from `@tale-ui/utils/useIsoLayoutEffect`.
- Use `useStableCallback` from `@tale-ui/utils/useStableCallback` for the resize update callback.

Classes:

```txt
.tale-key-value-pairs
.tale-key-value-pairs--divided
.tale-key-value-pairs--compact
.tale-key-value-pairs--spacious
```

JSDoc:

- Include `@example`.
- Include `@status stable`.

### `KeyValuePairs.Item`

Renders `<div>`.

Props:

```ts
export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}
```

Markup rule:

- `Item` is a valid grouping wrapper inside `<dl>` and must contain one `Term` followed by one `Details`.
- Do not render ARIA roles; native description-list semantics are sufficient.

Class:

```txt
.tale-key-value-pairs__item
```

### `KeyValuePairs.Term`

Renders `<dt>`.

Props:

```ts
export interface TermProps extends Omit<React.ComponentPropsWithoutRef<'dt'>, 'className'> {
  className?: string | undefined;
}
```

Class:

```txt
.tale-key-value-pairs__term
```

### `KeyValuePairs.Details`

Renders `<dd>`.

Props:

```ts
export interface DetailsProps extends Omit<React.ComponentPropsWithoutRef<'dd'>, 'className'> {
  className?: string | undefined;
}
```

Class:

```txt
.tale-key-value-pairs__details
```

### `KeyValuePairs.Info`

Renders `<span>`.

Purpose:

- Optional inline affordance next to a term, such as an info link, tooltip trigger, or help icon.

Props:

```ts
export interface InfoProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className'> {
  className?: string | undefined;
}
```

Class:

```txt
.tale-key-value-pairs__info
```

Usage:

```tsx
<KeyValuePairs.Term>
  Region
  <KeyValuePairs.Info>
    <Tooltip.Root>{/* ... */}</Tooltip.Root>
  </KeyValuePairs.Info>
</KeyValuePairs.Term>
```

### `KeyValuePairs.Group`

Renders `<div>`.

Purpose:

- A grid item containing a grouped set of key-value pairs.
- Must be used as a direct child of `Root`.

Props:

```ts
export interface GroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}
```

Class:

```txt
.tale-key-value-pairs__group
```

### `KeyValuePairs.GroupTitle`

Renders `<dt>`.

Props:

```ts
export interface GroupTitleProps extends Omit<React.ComponentPropsWithoutRef<'dt'>, 'className'> {
  className?: string | undefined;
}
```

Class:

```txt
.tale-key-value-pairs__group-title
```

### `KeyValuePairs.GroupList`

Renders `<dd><dl>...</dl></dd>`.

Props:

```ts
export interface GroupListProps extends Omit<React.ComponentPropsWithoutRef<'dd'>, 'className'> {
  className?: string | undefined;
}
```

Implementation:

```tsx
<dd ref={ref} className={cx('tale-key-value-pairs__group-details', className)} {...props}>
  <dl className="tale-key-value-pairs__group-list">{children}</dl>
</dd>
```

Classes:

```txt
.tale-key-value-pairs__group-details
.tale-key-value-pairs__group-list
```

## Accessibility Requirements

Use native description-list markup throughout:

```html
<dl>
  <div>
    <dt>Status</dt>
    <dd>Active</dd>
  </div>
</dl>
```

Grouped markup:

```html
<dl>
  <div>
    <dt>Network</dt>
    <dd>
      <dl>
        <div>
          <dt>VPC</dt>
          <dd>vpc-123</dd>
        </div>
      </dl>
    </dd>
  </div>
</dl>
```

Rules:

- Do not use `role="list"`, `role="term"`, or `role="definition"` unless a future audit proves native semantics are insufficient.
- Support `aria-label` and `aria-labelledby` on `Root`.
- Document that visible surrounding headings should be connected with `aria-labelledby` when the list needs an accessible name.
- Preserve reading order: term before details, top-to-bottom within each group.
- `Info` remains inline content inside `dt`; consumers are responsible for accessible labels on interactive info controls.

## Styling

Create `packages/styles/src/key-value-pairs.css`.

Add import to `packages/styles/src/index.css` under Data display:

```css
@import './key-value-pairs.css';
```

Add package export:

```json
"./key-value-pairs": "./src/key-value-pairs.css"
```

CSS classes:

```txt
.tale-key-value-pairs
.tale-key-value-pairs--divided
.tale-key-value-pairs--compact
.tale-key-value-pairs--spacious
.tale-key-value-pairs__item
.tale-key-value-pairs__term
.tale-key-value-pairs__details
.tale-key-value-pairs__info
.tale-key-value-pairs__group
.tale-key-value-pairs__group-title
.tale-key-value-pairs__group-details
.tale-key-value-pairs__group-list
```

Base styling:

- Use only `@tale-ui/css` tokens.
- Use no `--brand-*` tokens.
- Root:
  - `display: grid`
  - `grid-template-columns: repeat(var(--tale-key-value-pairs-columns, 1), minmax(0, 1fr))`
  - `column-gap: var(--space-xl)`
  - `row-gap: var(--space-m)`
  - `margin: 0`
  - `font-family: var(--text-font-family)`
- Item/group:
  - Keep as grid item wrappers.
- Term:
  - Label typography.
  - `font-size: var(--label-s-font-size)`
  - `font-weight: 600`
  - `line-height: var(--label-line-height)`
  - `color: var(--neutral-70)`
  - `margin: 0 0 var(--space-4xs)`
- Details:
  - Body typography.
  - `font-size: var(--text-m-font-size)`
  - `line-height: var(--text-line-height)`
  - `color: var(--neutral-90)`
  - `margin: 0`
- Info:
  - `display: inline-flex`
  - `margin-inline-start: var(--space-2xs)`
  - `padding-inline-start: var(--space-2xs)`
  - `border-inline-start: 1px solid var(--neutral-22)`
  - `vertical-align: middle`
- Group title:
  - Title/label emphasis.
  - `font-size: var(--title-s-font-size)` if available in token docs; otherwise use the existing title token used by nearby components.
  - `font-weight: 600`
  - `color: var(--neutral-90)`
  - `margin: 0 0 var(--space-s)`
- Group details:
  - `margin: 0`
- Group list:
  - Nested `dl` reset with vertical stack.
  - `display: flex`
  - `flex-direction: column`
  - `gap: var(--space-s)`
  - `margin: 0`
  - `padding: 0`

Variants:

- `variant="plain"`: no separators.
- `variant="divided"`:
  - Dividers are per visual row, not per DOM sibling.
  - Add a top border only to top-level `Item` and `Group` siblings that begin after the first resolved visual row.
  - Use the root `data-columns` attribute to remove borders from the first `N` children:
    - `[data-columns="1"]`: border from child 2 onward.
    - `[data-columns="2"]`: border from child 3 onward.
    - `[data-columns="3"]`: border from child 4 onward.
    - `[data-columns="4"]`: border from child 5 onward.
  - Use `border-top: 1px solid var(--neutral-18)`.
  - Add density-aware top padding.

Densities:

- `compact`: smaller row gap and item padding using `--space-2xs`.
- `default`: default row gap and item padding using `--space-xs`.
- `spacious`: larger row gap and item padding using `--space-s`.

No `_primitives.css` changes are required because this is a display-specific component, not a shared field/list-item primitive.

## Source Files

Add:

```txt
packages/react/src/key-value-pairs/KeyValuePairs.styled.tsx
packages/react/src/key-value-pairs/KeyValuePairs.test.tsx
packages/react/src/key-value-pairs/index.ts
packages/styles/src/key-value-pairs.css
docs/components/key-value-pairs.md
playground/storybook/src/stories/KeyValuePairs.stories.tsx
tools/golden-prompts/key-value-pairs-resource-summary.json
```

Update:

```txt
packages/react/package.json
packages/styles/package.json
packages/styles/src/index.css
docs/component-index.md
docs/consumer-claude-md-snippet.md
packages/react/README.md
playground/vite-app/src/demos/ComponentAudit.tsx
CLAUDE.md
tools/golden-prompts/index.json
packages/a2ui/src/catalog.ts
tools/a2ui-catalog-metadata.js
```

Generated by commands later. This list is illustrative, not exhaustive; `pnpm generate-docs` may also update generated agent/check artifacts such as `.cursorrules`, eval-context outputs, full snippets, and other registry-derived files:

```txt
registry/components.json
registry/pitfalls.json
registry/a2ui-catalog.json
docs/a2ui-integration.md
packages/a2ui/src/agent/system-prompt.md
docs/consumer-claude-md-snippet-full.md
```

## Documentation

Create `docs/components/key-value-pairs.md`.

Include:

- Import statement.
- Description: "Displays properties as labels followed by corresponding values using semantic description-list markup."
- Parts table for all namespace parts.
- Props tables for every Tale UI-specific prop:
  - `Root.columns`
  - `Root.minColumnWidth`
  - `Root.variant`
  - `Root.density`
- Standard HTML attributes notes for all parts.
- Basic usage.
- Divided variant example.
- Multi-column example.
- Grouped example.
- Info/tooltip example.
- Accessibility notes.
- CSS classes list.
- Pitfalls.

Pitfalls to document:

- Use `KeyValuePairs.Root`, not `<KeyValuePairs>` directly.
- Use `aria-label` / `aria-labelledby`, not Cloudscape-style `ariaLabel` / `ariaLabelledby`.
- `columns` supports only `1`, `2`, `3`, or `4`.
- `Item` should contain `Term` before `Details`.
- Use `GroupTitle` + `GroupList` for grouped pairs; do not put nested `Item` children directly inside `Group` without `GroupList`.
- Use `Table` for tabular data and `List` for plain lists; use `KeyValuePairs` for property/value metadata.

## Component Index / README / Snippet

Add `KeyValuePairs` to Display.

`docs/component-index.md` row:

```md
| KeyValuePairs | Semantic description-list display for labels and corresponding values | `@tale-ui/react/key-value-pairs` | Root, Item, Term, Details, Info, Group, GroupTitle, GroupList |
```

`packages/react/README.md`:

- Add "Key Value Pairs" to the Display list.
- Add per-component documentation reference if the README has that generated section.

`docs/consumer-claude-md-snippet.md`:

- Add `KeyValuePairs` to namespace components.
- Include a short pitfall note that it uses `Root`, `Item`, `Term`, and `Details`.

`CLAUDE.md` audit table:

- Increment totals from `112` to `113`.
- Add `KeyValuePairs` to the "Non-trivial components requiring tests" sentence because responsive column calculation uses `ResizeObserver`.
- Add Display row:

```md
| KeyValuePairs | ✓ | ✓ | ✓ | ✓ | n/a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | stable |
```

## Storybook

Create `playground/storybook/src/stories/KeyValuePairs.stories.tsx`.

Stories:

1. `Default`
   - One-column plain list.
2. `Divided`
   - `variant="divided"`.
3. `ResponsiveColumns`
   - `columns={3}` and `minColumnWidth={180}` inside a constrained width.
4. `Grouped`
   - Two groups with nested pairs.
5. `WithInfo`
   - Term with `Info` and `Tooltip`.

Controls:

```ts
columns: select[(1, 2, 3, 4)];
minColumnWidth: number;
variant: select[('plain', 'divided')];
density: select[('compact', 'default', 'spacious')];
```

## ComponentAudit

Update `playground/vite-app/src/demos/ComponentAudit.tsx`:

- Import `KeyValuePairs`.
- Add metadata for the new component.
- Add a Display section demo that shows:
  - plain root
  - divided root
  - grouped root
  - info term
  - responsive columns
- Include class tags for every BEM class.

## A2UI

Add A2UI support because this is a display component useful in generated UIs.

### Catalog Import

Add:

```ts
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
```

### A2UI Types

Add three catalog entries:

```txt
KeyValuePairs
KeyValuePair
KeyValuePairGroup
```

`KeyValuePairs` adapter:

Props:

```txt
label: string
columns: number, normalized to 1 | 2 | 3 | 4 before passing to React
minColumnWidth: number
variant: plain | divided
density: compact | default | spacious
children: array of component IDs
```

Adapter normalization:

```ts
function normalizeKeyValuePairsColumns(value: unknown): 1 | 2 | 3 | 4 {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 1;
  if (numeric <= 1) {
    return 1;
  }
  if (numeric === 2) {
    return 2;
  }
  if (numeric === 3) {
    return 3;
  }
  return 4;
}

function normalizeKeyValuePairsMinColumnWidth(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 150;
}
```

Maps to:

```tsx
<KeyValuePairs.Root
  aria-label={props.label ?? 'Key-value pairs'}
  columns={normalizeKeyValuePairsColumns(props.columns)}
  minColumnWidth={normalizeKeyValuePairsMinColumnWidth(props.minColumnWidth)}
  variant={props.variant}
  density={props.density}
>
  {ctx.children}
</KeyValuePairs.Root>
```

`KeyValuePair` adapter:

Props:

```txt
label: string
value: string
```

Maps to:

```tsx
<KeyValuePairs.Item>
  <KeyValuePairs.Term>{props.label}</KeyValuePairs.Term>
  <KeyValuePairs.Details>{props.value ?? ctx.children}</KeyValuePairs.Details>
</KeyValuePairs.Item>
```

`KeyValuePairGroup` adapter:

Props:

```txt
title: string
children: array of component IDs
```

Maps to:

```tsx
<KeyValuePairs.Group>
  <KeyValuePairs.GroupTitle>{props.title}</KeyValuePairs.GroupTitle>
  <KeyValuePairs.GroupList>{ctx.children}</KeyValuePairs.GroupList>
</KeyValuePairs.Group>
```

Update `tools/a2ui-catalog-metadata.js`:

- Add descriptions.
- Add prop value overrides:
  - `KeyValuePairs.columns`: `` `1`, `2`, `3`, `4` ``
  - `KeyValuePairs.variant`: `` `plain`, `divided` ``
  - `KeyValuePairs.density`: `` `compact`, `default`, `spacious` ``
- Add `KeyValuePair` and `KeyValuePairGroup` to `SUB_PARTS`.

After implementation, regenerate A2UI docs and catalog.

## Golden Prompt

Create `tools/golden-prompts/key-value-pairs-resource-summary.json`.

Prompt:

```txt
Show a resource summary with key-value pairs for an active production API service. Include status, region, owner, endpoint, and last deployment. Use a grouped section for network details.
```

Difficulty: `medium`

Tags:

```json
["KeyValuePairs", "Badge", "Link"]
```

Reference implementation must:

- Import `KeyValuePairs`.
- Use `Badge` for status.
- Use `Link` for endpoint.
- Use grouped nested pairs for network details.
- Use no raw HTML where Tale UI components exist, except normal text content.

## Tests

Create `packages/react/src/key-value-pairs/KeyValuePairs.test.tsx`.

Use Vitest native `expect()` and `fn()` APIs for new tests.

Test cases:

1. Root renders semantic `<dl>`.
   - Render `KeyValuePairs.Root`.
   - Assert `container.querySelector('dl.tale-key-value-pairs')`.
2. Item renders valid description-list structure.
   - Assert `dt.tale-key-value-pairs__term`.
   - Assert `dd.tale-key-value-pairs__details`.
   - Assert term text appears before details text in DOM order.
3. Group renders nested description list.
   - Assert top-level group title is `dt`.
   - Assert group list contains nested `dl`.
   - Assert nested pair contains `dt` and `dd`.
4. Classes merge.
   - Root merges custom class.
   - Item, Term, Details, Info, Group, GroupTitle, GroupList merge custom class.
5. Root prop classes.
   - `variant="divided"` adds `.tale-key-value-pairs--divided`.
   - `density="compact"` adds `.tale-key-value-pairs--compact`.
   - `density="spacious"` adds `.tale-key-value-pairs--spacious`.
6. Standard ARIA naming passes through.
   - `aria-label="Service metadata"` appears on root.
   - `aria-labelledby="heading-id"` appears on root.
7. Responsive column calculation.
   - Stub `ResizeObserver`.
   - Mock root `getBoundingClientRect().width`.
   - With `columns={4}` and `minColumnWidth={200}`, assert the CSS variable resolves to the expected clamped column count.
   - Assert the root also receives the matching `data-columns` attribute.
   - Pass a consumer `style` prop such as `{ maxWidth: 640 }` and assert that style is preserved while `--tale-key-value-pairs-columns` is added.
8. Runtime invalid values for JS consumers.
   - Cast invalid `columns` and `minColumnWidth` through `unknown`.
   - Assert columns clamp and min width falls back to `150`.

No browser spec is required unless CSS layout regressions are found during Storybook or ComponentAudit review.

## Verification Commands

Run after implementation:

```bash
pnpm generate-docs
pnpm audit:components -- --component=KeyValuePairs
pnpm audit:bem
pnpm audit:brand
pnpm audit:docs
pnpm audit:snippet-kinds
pnpm golden:validate
pnpm typescript
pnpm eslint
pnpm stylelint
pnpm test:jsdom KeyValuePairs --no-watch
pnpm a2ui:validate-examples
pnpm a2ui:audit-docs
pnpm a2ui:golden:validate
pnpm generate-docs:check
```

Spot-check generated registry:

```bash
rg -n '"name": "KeyValuePairs"|"slug": "key-value-pairs"|"Root"|"GroupList"' registry/components.json
rg -n '"name": "KeyValuePairs"|"name": "KeyValuePair"|"name": "KeyValuePairGroup"' registry/a2ui-catalog.json
```

## Acceptance Criteria

The implementation is complete when:

- `@tale-ui/react/key-value-pairs` exports `KeyValuePairs`.
- `@tale-ui/react-styles/key-value-pairs` exports component CSS.
- The component renders native `<dl>`, `<dt>`, and `<dd>` semantics.
- The component supports responsive `columns` and `minColumnWidth` behavior with a max of 4 columns.
- All namespace parts apply documented BEM classes and merge `className`.
- Docs, README, component index, consumer snippet, Storybook, ComponentAudit, A2UI, golden prompts, and generated registries are updated.
- All verification commands pass.
- No Cloudscape source is copied directly; only the semantic pattern and public behavior are used as design reference.

## Assumptions and Defaults

- Component name: `KeyValuePairs`.
- API shape: composable namespace parts, not a Cloudscape-style `items` prop.
- Layout props: include `columns`, `minColumnWidth`, `variant`, and `density`.
- Status: `stable`.
- Category: Display.
- A2UI: included.
- `_primitives.css`: no change.
- Tests: required because responsive column calculation adds non-trivial logic.
