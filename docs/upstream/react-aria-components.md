# React Aria Components Adoption Log

This document tracks how Tale UI responds to upstream `react-aria-components` releases.
It is a maintainer decision log, not a public package changelog.

Use this file to record:

- Which upstream release was reviewed.
- Which upstream changes Tale UI adopted, wrapped, documented, deferred, or rejected.
- Why each decision was made.
- Which Tale UI artifacts were updated.
- Which follow-ups remain.

Public consumer-facing changes still belong in the relevant Tale UI package changelog.
Current behavioral differences belong in [react-aria-deviations.md](../react-aria-deviations.md).

## Current Target

Tale UI currently targets `react-aria-components ^1.18.0`.

Resolved workspace stack after the 1.18 adoption:

| Package                 | Version |
| ----------------------- | ------- |
| `react-aria-components` | 1.18.0  |
| `react-aria`            | 3.49.0  |
| `react-stately`         | 3.47.0  |
| `@internationalized/date` | 3.12.2 |

## How To Use This Log

For each upstream release:

1. Add a new release section at the top of [Release Entries](#release-entries).
2. Link the upstream release notes.
3. Record every relevant upstream item in one of the status tables.
4. Link the Tale UI artifacts that changed.
5. Record verification commands and known failures.
6. Move any deferred items forward until they are resolved or explicitly rejected.

## Release Entry Template

```md
## react-aria-components vX.Y.Z

Reviewed: YYYY-MM-DD
Upstream notes: https://react-aria.adobe.com/releases/vX-Y-Z
Tale UI target after review: `react-aria-components ^X.Y.Z`

### Maintainer Summary

| Area | Upstream change | Tale UI action |
| --- | --- | --- |
| New component | ... | Adopted/deferred/not applicable because ... |
| New/changed feature | ... | Adopted/documented/deferred/not applicable because ... |
| Deprecated feature | ... | Replacement decision and compatibility stance ... |

### Adopted

| Upstream change | Tale UI response | Artifacts |
| --- | --- | --- |
| ... | ... | ... |

### Documented Only

| Upstream change | Tale UI response | Rationale |
| --- | --- | --- |
| ... | ... | ... |

### Deprecated Upstream

| Upstream deprecation | Tale UI response | Compatibility stance |
| --- | --- | --- |
| ... | ... | ... |

### Deferred

| Upstream change | Reason | Follow-up |
| --- | --- | --- |
| ... | ... | ... |

### Not Applicable

| Upstream change | Reason |
| --- | --- |
| ... | ... |

### Verification

- `pnpm typescript`
- `pnpm test:jsdom`
- `pnpm test:chromium`
- `pnpm test:visual`
- `pnpm generate-docs:check`
- `pnpm audit:components`
- `pnpm audit:coverage:check`
```

## Release Entries

## react-aria-components v1.18.0

Reviewed: 2026-06-13
Upstream notes: https://react-aria.adobe.com/releases/v1-18-0
Tale UI target after review: `react-aria-components ^1.18.0`

### Maintainer Summary

| Area | Upstream change | Tale UI action |
| --- | --- | --- |
| New component | `CalendarHeading`, `CalendarMonthPicker`, `CalendarYearPicker`, `TableFooter`, `SliderFill`, `CheckboxField`, `CheckboxButton`, `RadioField`, `RadioButton`, `SwitchField`, `SwitchButton` | Adopted, except button primitives were exposed through Tale UI field namespaces rather than standalone exports. |
| New/changed feature | Calendar multiple selection typing, `Calendar.Grid` `weeksInMonth`, `RangeCalendar` `anchorDate`, `Popover` `--trigger-width`, expandable table row state, Slider range output formatting, primitive collection values, and several ComboBox/Select/Menu/NumberField/Tabs/TextField/Tree fixes | Adopted or documented where the change affects Tale UI public APIs, docs, examples, or regression coverage. Bug fixes were validated without wrapper changes unless noted below. |
| Deprecated feature | RAC deprecated `Checkbox`, `Radio`, and `Switch` in favour of field/button pairs | Tale UI kept the old exports for backwards compatibility, marked them deprecated, and promoted `CheckboxField`, `RadioField`, and `SwitchField` for new code. |

### Adopted

| Upstream change | Tale UI response | Artifacts |
| --- | --- | --- |
| `CalendarHeading` | Wrapped as `Calendar.Heading` and `RangeCalendar.Heading`. Replaced the previous plain heading wrapper so RAC formats visible month/year text and supports offsets. | `packages/react/src/calendar/Calendar.styled.tsx`, `packages/react/src/range-calendar/RangeCalendar.styled.tsx`, component docs, Storybook, ComponentAudit |
| `CalendarMonthPicker` | Exposed as headless `Calendar.MonthPicker`. No BEM class or CSS because the upstream component is a render-prop helper for custom picker UI. | `Calendar.styled.tsx`, `docs/components/calendar.md`, `Calendar.stories.tsx`, ComponentAudit |
| `CalendarYearPicker` | Exposed as headless `Calendar.YearPicker`. No BEM class or CSS because the upstream component is a render-prop helper for custom picker UI. | `Calendar.styled.tsx`, `docs/components/calendar.md`, `Calendar.stories.tsx`, ComponentAudit |
| `TableFooter` | Wrapped as `Table.Footer`, rendering a `<tfoot>` for totals and summary rows. | `packages/react/src/table/Table.styled.tsx`, `packages/styles/src/table.css`, `docs/components/table.md`, `Table.stories.tsx`, ComponentAudit |
| `SliderFill` | Adopted behind the existing `Slider.Indicator` API. This keeps Tale UI's public part name stable while gaining RAC's RTL-aware fill and range-fill behavior. | `packages/react/src/slider/Slider.styled.tsx`, `docs/components/slider.md`, `Slider.stories.tsx`, ComponentAudit |
| `CheckboxField` and `CheckboxButton` | Added `CheckboxField` as a new Tale UI component namespace with `Root`, `Button`, `Indicator`, `Description`, and `Error` parts. | `packages/react/src/checkbox-field/`, `packages/styles/src/checkbox-field.css`, docs, Storybook, ComponentAudit, golden prompt |
| `RadioField` and `RadioButton` | Added `RadioField` as a new Tale UI component namespace with `Root`, `Button`, `Indicator`, `Dot`, `Description`, and `Error` parts. | `packages/react/src/radio-field/`, `packages/styles/src/radio-field.css`, docs, Storybook, ComponentAudit, golden prompt |
| `SwitchField` and `SwitchButton` | Added `SwitchField` as a new Tale UI component namespace with `Root`, `Button`, `Thumb`, `Description`, and `Error` parts. | `packages/react/src/switch-field/`, `packages/styles/src/switch-field.css`, docs, Storybook, ComponentAudit, golden prompt |
| Calendar `selectionMode="multiple"` | Made `Calendar.Root` generic so multiple-selection value typing flows through. Documented that `value`, `defaultValue`, and `onChange` use arrays in multiple mode. | `Calendar.styled.tsx`, `docs/components/calendar.md`, `Calendar.test.tsx` |
| `Calendar.Grid` `weeksInMonth` | Documented as a pass-through RAC prop. | `docs/components/calendar.md` |
| `RangeCalendar` `anchorDate` | Documented as a pass-through RAC argument for availability logic. | `docs/components/range-calendar.md` |
| `Popover` `--trigger-width` | Documented the new CSS custom property behavior. | `docs/components/popover.md` |
| `Table.Row` render-prop `state` and expandable table support | Documented RAC table additions including expandable rows and `treeColumn`. | `docs/components/table.md` |
| `SliderOutput` range formatting | Documented through updated Slider examples and notes. | `docs/components/slider.md`, `Slider.stories.tsx` |

### Deprecated Upstream

| Upstream deprecation | Tale UI response | Compatibility stance |
| --- | --- | --- |
| `Checkbox` deprecated in `react-aria-components` 1.18.0 | Kept `Checkbox` exported, marked it deprecated, and added `CheckboxField` as the recommended replacement. | Backwards compatible; prefer `CheckboxField` for new code. |
| `Radio` deprecated in `react-aria-components` 1.18.0 | Kept `Radio` exported, marked it deprecated, and added `RadioField` as the recommended replacement. | Backwards compatible; prefer `RadioField` for new code. |
| `Switch` deprecated in `react-aria-components` 1.18.0 | Kept `Switch` exported, marked it deprecated, and added `SwitchField` as the recommended replacement. | Backwards compatible; prefer `SwitchField` for new code. |

### Documented Only

| Upstream change | Tale UI response | Rationale |
| --- | --- | --- |
| Collections can accept primitive item values | No Tale UI wrapper change required. | Existing wrappers already pass collection props through; document only if a component guide needs an example. |
| ComboBox, Select, Menu, NumberField, Tabs, TextField, Tree fixes | No dedicated wrapper changes unless existing tests or visual baselines exposed a shift. | These were upstream bug fixes or internal behavior fixes. Tale UI validated with type, unit, and visual suites. |
| ColorPicker nesting behavior fixed in 1.18.0 | Updated deviations documentation and added a regression test showing `ColorSlider.Root` can render inside `ColorPicker.Root`. | This removes a former Tale UI caveat rather than adding a new public API. |
| `FieldError` referenced in the 1.18 form-field examples | No standalone Tale UI `FieldError` component was added. Existing Tale UI components already expose component-specific `Error` parts wrapping RAC `FieldError`. | `FieldError` already existed before 1.18 and Tale UI already wraps it where needed. |

### Deferred

| Upstream change | Reason | Follow-up |
| --- | --- | --- |
| RAC 1.17 sub-path imports, e.g. `react-aria-components/Menu` | Tree-shaking-only change with broad import churn across wrappers. Not required for correctness of the 1.18 adoption. | Track as a separate import optimization task. |
| React Aria test utils RC | Tale UI does not currently use `@react-aria/test-utils` as the core test harness. | Revisit only if the test strategy changes. |

### Not Applicable

| Upstream change | Reason |
| --- | --- |
| `mergeRefs` re-export from `react-aria` | Tale UI uses its own local utilities and does not need a public API change. |
| React Aria documentation-only updates, e.g. Link routing guide | No Tale UI component API or docs change required unless a Tale UI guide adopts the same pattern. |
| Internal optimize-locales and virtualizer fixes | No Tale UI wrapper action required beyond dependency resolution and regression testing. |

### Verification

Passed on the final migration tree:

- `pnpm typescript`
- `pnpm lint:css`
- `pnpm generate-docs:check`
- `pnpm registry:check`
- `pnpm audit:components`
- `pnpm audit:docs`
- `pnpm audit:bem`
- `pnpm audit:brand`
- `pnpm audit:coverage:check`
- `pnpm audit:snippet-kinds`
- `pnpm golden:validate`
- `pnpm a2ui:golden:validate`
- `pnpm test:jsdom`
- `pnpm test:chromium`
- `pnpm test:visual`

Known unrelated or pre-existing failures at the time of adoption:

- `pnpm test:regressions` failed because `test/regressions/postcss.config.js` references missing PostCSS plugins not present in the lockfile.
- `pnpm eslint` had a broad pre-existing lint backlog.
- `pnpm stylelint` had a broad pre-existing lint backlog.
