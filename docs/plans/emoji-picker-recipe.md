# Add Emoji Picker Recipe and Supporting First-Class Imports

## Summary

Add the React Aria Emoji Picker pattern to Tale UI as a reusable recipe, not as a core `EmojiPicker` component. To make the recipe use Tale UI import paths instead of reaching into `react-aria-components`, add two supporting first-class imports:

- `@tale-ui/react/list-box` as a styled standalone collection component.
- `@tale-ui/react/virtualizer` as a registry-visible pass-through utility module for React Aria virtualization primitives.

Emoji data remains consumer-owned. The recipe will show the expected data shape and mention `emojibase-data` as one valid source, but Tale UI will not add `emojibase-data` as a dependency.

## Public API Additions

### `@tale-ui/react/list-box`

Add a new namespace component:

```tsx
import { ListBox } from '@tale-ui/react/list-box';

<ListBox.Root aria-label="Emoji results" selectionMode="single">
  <ListBox.Section id="smileys">
    <ListBox.Header>Smileys</ListBox.Header>
    <ListBox.Item id="grinning" textValue="grinning face">
      😀 Grinning face
    </ListBox.Item>
  </ListBox.Section>
</ListBox.Root>
```

Export parts:

- `ListBox.Root`
- `ListBox.Item`
- `ListBox.Section`
- `ListBox.Header`
- `ListBox.Text`
- `ListBox.SelectionIndicator`
- `ListBox.LoadMoreItem`
- `ListBox.Collection`

Export types:

- `ListBoxRootProps`
- `ListBoxItemProps`
- `ListBoxSectionProps`
- `ListBoxHeaderProps`
- `ListBoxTextProps`
- `ListBoxSelectionIndicatorProps`
- `ListBoxLoadMoreItemProps`
- `ListBoxCollectionProps`
- `Selection`, `Key`, `SelectionMode`

Class names:

- `.tale-list-box`
- `.tale-list-box__item`
- `.tale-list-box__section`
- `.tale-list-box__header`
- `.tale-list-box__text`
- `.tale-list-box__selection-indicator`
- `.tale-list-box__load-more-item`

Implementation default: wrap React Aria `ListBox`, `ListBoxItem`, `ListBoxSection`, `Header`, `Text`, `SelectionIndicator`, `ListBoxLoadMoreItem`, and `Collection` from `react-aria-components`.

Do not refactor existing `Select.ListBox`, `Combobox.ListBox`, `Autocomplete.ListBox`, `MultiSelect`, or `TagSelect` in this change. They keep their current APIs and component-specific BEM classes.

### `@tale-ui/react/virtualizer`

Add a first-class utility import:

```tsx
import { Virtualizer, GridLayout, Size } from '@tale-ui/react/virtualizer';
```

Export directly from React Aria:

- `Virtualizer`
- `ListLayout`
- `GridLayout`
- `WaterfallLayout`
- `TableLayout`
- `Layout`
- `LayoutInfo`
- `Size`
- `Rect`
- `Point`

Export types:

- `VirtualizerProps`
- `ListLayoutOptions`
- `GridLayoutOptions`
- `WaterfallLayoutOptions`
- `TableLayoutProps`

Implementation default: pass-through re-export from `react-aria-components`.

Registry and audit handling: `virtualizer` is a public `@tale-ui/react/*` import, so it must be visible to `registry/components.json`. Treat it like a utility entry, not a styled visual component. It gets docs, package exports, component-index/snippet/README entries, generated registry coverage, and a `CLAUDE.md` audit row with `n/a` for styled, CSS, primitives, Storybook, ComponentAudit, and A2UI.

## Files to Add or Update

### ListBox Component

Add:

- `packages/react/src/list-box/ListBox.styled.tsx`
- `packages/react/src/list-box/index.ts`
- `packages/styles/src/list-box.css`
- `docs/components/list-box.md`
- `playground/storybook/src/stories/ListBox.stories.tsx`
- `tools/golden-prompts/list-box-basic.json`

Update:

- `packages/react/src/index.ts`
- `packages/react/package.json`
- `packages/styles/src/index.css`
- `packages/styles/package.json`
- `docs/components/index.md`
- `docs/component-index.md`
- `docs/consumer-claude-md-snippet.md`
- `packages/react/README.md`
- `playground/vite-app/src/demos/ComponentAudit.tsx`
- `tools/golden-prompts/index.json`
- `CLAUDE.md` component count and audit table
- `packages/styles/src/_primitives.css`

`_primitives.css` change: add `.tale-list-box` to dropdown/list container primitives only where declarations are byte-for-byte shared, and add `.tale-list-box__item` plus `.tale-list-box__header` to existing dropdown item/group-label primitive groups where compatible.

### Virtualizer Utility Export

Add:

- `packages/react/src/virtualizer/index.ts`
- `docs/components/virtualizer.md`

Update:

- `packages/react/package.json`
- `packages/react/src/index.ts`
- `packages/react/README.md`
- `docs/components/index.md`
- `docs/component-index.md`
- `docs/consumer-claude-md-snippet.md`
- `CLAUDE.md` component count and audit table
- `tools/audit-components.js`

Audit tooling changes for `virtualizer`:

- Add `virtualizer` to `NO_STYLED_FILE`.
- Add `virtualizer` to `NO_CSS`.
- Add `virtualizer` to `NO_STORY`.
- Add `virtualizer` to `NO_AUDIT_ENTRY`.
- Do not add `virtualizer` to `SKIP_DIRS`; the registry must discover it so recipe/generated validation accepts `@tale-ui/react/virtualizer`.

Do not add `packages/styles/src/virtualizer.css`.

### Emoji Picker Recipe

Add:

- `docs/recipes/emoji-picker.md`

Update:

- `docs/recipes/index.md`

Recipe category: add a new `Pickers` section:

```md
## Pickers

| Recipe | Components Used | Description |
| --- | --- | --- |
| [Emoji Picker](emoji-picker.md) | Popover, SearchField, ListBox, Virtualizer, Text | Searchable virtualized emoji picker |
```

## Emoji Recipe Design

The recipe should provide a copy-paste component named `EmojiPickerExample`.

Imports:

```tsx
import * as React from 'react';
import { ListBox } from '@tale-ui/react/list-box';
import { Popover } from '@tale-ui/react/popover';
import { SearchField } from '@tale-ui/react/search-field';
import { Text } from '@tale-ui/react/text';
import { Virtualizer, GridLayout, Size } from '@tale-ui/react/virtualizer';
```

Data shape:

```ts
type EmojiItem = {
  id: string;
  emoji: string;
  label: string;
  group: string;
  keywords?: string[];
};
```

Recipe behavior:

- `Popover.Root` controls `isOpen`/`onOpenChange`.
- `Popover.Trigger` opens the picker and uses `className="tale-button tale-button--neutral tale-button--md"`; do not import or nest a separate `Button`.
- `SearchField.Root` controls query state.
- Results filter by label, group, and keywords.
- Results render in `ListBox.Root` with `items={filteredEmojis}`.
- Virtualization wraps the listbox:
  - `layout={GridLayout}`
  - `layoutOptions={{ minItemSize: new Size(44, 44), maxItemSize: new Size(44, 44), minSpace: new Size(4, 4), preserveAspectRatio: true }}`
  - `ListBox.Root` sets `layout="grid"` so React Aria exposes grid layout semantics instead of the default stack layout.
  - item content is stable in size so layout measurement does not shift.
- Selecting an emoji updates local selected state and closes the popover.
- Empty results render a `Text` fallback.
- The recipe uses a small inline sample dataset for validation.
- The recipe includes a note that production apps should pass their own full emoji data, for example from `emojibase-data`, and normalize it into `EmojiItem[]`.

Selection/open-state handling:

```tsx
const [isOpen, setIsOpen] = React.useState(false);
const [query, setQuery] = React.useState('');
const [selectedEmoji, setSelectedEmoji] = React.useState<EmojiItem | null>(null);

function selectEmoji(key: React.Key | null) {
  const emoji = filteredEmojis.find((item) => item.id === key);
  if (!emoji) {
    return;
  }

  setSelectedEmoji(emoji);
  setIsOpen(false);
}
```

Virtualized list shape:

```tsx
<Virtualizer
  layout={GridLayout}
  layoutOptions={{
    minItemSize: new Size(44, 44),
    maxItemSize: new Size(44, 44),
    minSpace: new Size(4, 4),
    preserveAspectRatio: true,
  }}
>
  <ListBox.Root
    aria-label="Emoji results"
    items={filteredEmojis}
    layout="grid"
    selectionMode="single"
    selectedKeys={selectedEmoji ? [selectedEmoji.id] : []}
    onSelectionChange={(keys) => {
      const key = keys === 'all' ? null : [...keys][0] ?? null;
      selectEmoji(key);
    }}
  >
    {(item) => (
      <ListBox.Item id={item.id} textValue={item.label}>
        {item.emoji}
      </ListBox.Item>
    )}
  </ListBox.Root>
</Virtualizer>
```

Recipe constraints:

- No custom CSS block.
- No bespoke non-`tale-` class names.
- No disallowed inline visual styles.
- Use Tale UI components for visible text where practical.
- Use `aria-label` on searchable/listbox controls.
- Keep all code in one fenced `tsx` block so `pnpm recipes:validate` can validate it.

## Component Documentation Requirements

### `docs/components/list-box.md`

Include:

- Import path.
- Parts table.
- Props table for Tale UI-specific props only. If there are no Tale UI-specific props beyond `className`, state that each part accepts the matching React Aria props plus `className`.
- Examples:
  - Basic single-select list.
  - Sectioned list.
  - Multiple selection with `SelectionIndicator`.
  - Virtualized grid example that imports from `@tale-ui/react/virtualizer`.
- CSS class list.
- Pitfalls:
  - Use `ListBox.Section` and `ListBox.Header` for grouped options.
  - Provide `textValue` when item children are not plain text.
  - Use `aria-label` or visible labelling for standalone list boxes.
  - Use `ListBox` for standalone selectable collections; keep `Select.ListBox`, `Combobox.ListBox`, and `Autocomplete.ListBox` inside those parent components.

### `docs/components/virtualizer.md`

Include:

- Import path.
- Clarify that this is a first-class utility export, not a styled component.
- Clarify that it is still registry-visible because generated-code validation requires every public `@tale-ui/react/*` import to exist in `registry/components.json`.
- A `## Props` section that states Tale UI adds no custom props; `Virtualizer` and layout classes use the upstream React Aria / React Stately types re-exported from `@tale-ui/react/virtualizer`.
- Examples:
  - `Virtualizer` with `GridLayout`.
  - `Virtualizer` with `ListLayout`.
- Pitfalls:
  - Import layouts from `@tale-ui/react/virtualizer`, not directly from `react-aria-components`.
  - Keep item dimensions stable.
  - Use virtualization only for long collections.

## Tests and Validation

### Unit Tests

Add `packages/react/src/list-box/ListBox.test.tsx` only if the implementation adds logic beyond class wrapping. If it only wraps React Aria parts, skip tests and mark test as `n/a` in `CLAUDE.md`.

If tests are added, cover:

- `ListBox.Root` renders `.tale-list-box`.
- `ListBox.Item` renders `.tale-list-box__item`.
- `className` merges with BEM class names.
- `textValue`, `id`, and selection props forward to React Aria.

Do not add tests for `Virtualizer` pass-through exports unless TypeScript fails to validate the export surface.

### Storybook

Add `ListBox.stories.tsx` with:

- Basic list.
- Sectioned list.
- Multiple selection.
- Virtualized emoji-like grid using `Virtualizer`, `GridLayout`, and `Size`.

### Component Audit Demo

Add a `ListBox` entry to `ComponentAudit.tsx` with:

- A labelled root.
- At least three items.
- One sectioned example or selected item state.

Do not add `Virtualizer` to ComponentAudit because it is not a styled component. Instead, add `virtualizer` to the audit tool's no-audit-entry exception set.

### Golden Prompt

Add `list-box-basic.json`:

- Difficulty: `simple`.
- Prompt: "Show a standalone selectable list of project statuses using ListBox."
- Reference imports `ListBox` from `@tale-ui/react/list-box`.
- Tags: `["ListBox"]`.

Do not add an emoji picker golden prompt unless the golden validator can handle the larger recipe code cleanly. The recipe validation covers the emoji picker pattern.

### Verification Commands

Run after implementation:

```bash
pnpm registry:generate
pnpm pitfalls:generate
pnpm snippet:generate
pnpm cursorrules:generate
pnpm eval-context:generate
pnpm a2ui:generate-docs
pnpm a2ui:generate-catalog
pnpm recipes:validate
pnpm audit:components -- --component=list-box
pnpm audit:components -- --component=virtualizer
pnpm audit:bem
pnpm audit:brand
pnpm audit:docs
pnpm audit:snippet-kinds
pnpm golden:validate
pnpm validate:imports
pnpm typescript
pnpm build
pnpm eslint
pnpm stylelint
pnpm generate-docs:check
```

If a `ListBox.test.tsx` is added, also run:

```bash
pnpm test:jsdom ListBox --no-watch
pnpm test:chromium ListBox --no-watch
```

## Acceptance Criteria

- Consumers can import `ListBox` from `@tale-ui/react/list-box`.
- Consumers can import `Virtualizer`, `GridLayout`, and `Size` from `@tale-ui/react/virtualizer`.
- `Virtualizer` appears in `registry/components.json` as a simple utility entry so recipe/generated validation accepts the public import.
- Existing `Select`, `Combobox`, `Autocomplete`, `MultiSelect`, and `TagSelect` APIs remain unchanged.
- `docs/recipes/emoji-picker.md` validates with `pnpm recipes:validate`.
- The recipe does not require Tale UI to depend on `emojibase-data`.
- Generated registry/docs/snippet artifacts are up to date.
- All listed verification commands pass.

## Assumptions and Defaults

- The emoji picker remains a recipe, not `@tale-ui/react/emoji-picker`.
- `ListBox` is a full styled Tale UI component and participates in registry, docs, Storybook, ComponentAudit, and golden prompts.
- `Virtualizer` is a first-class utility export. It is registry-visible and documented, but it does not participate in BEM, styles, A2UI, Storybook, or ComponentAudit.
- Emoji data is consumer-owned. The recipe includes inline sample data only so repo validation is deterministic.
- Existing compound component listbox parts are intentionally not refactored in this change.
