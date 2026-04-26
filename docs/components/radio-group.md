# RadioGroup

`import { RadioGroup } from '@tale-ui/react/radio-group';`

A convenience re-export of `Radio.Group` from `@tale-ui/react/radio`. Both import paths resolve to the same component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | — | Propagates size to child `Radio.Root` components |

Also accepts all React Aria `RadioGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Radio } from '@tale-ui/react/radio';

<RadioGroup label="Favorite color">
  <Radio.Root value="red">
    <Radio.Indicator />
    Red
  </Radio.Root>
  <Radio.Root value="blue">
    <Radio.Indicator />
    Blue
  </Radio.Root>
</RadioGroup>
```

## Pitfalls

<!-- pitfall: radio-group-no-sub-parts -->
- **`RadioGroup` (from `@tale-ui/react/radio-group`) has NO sub-parts** — using `<RadioGroup.Radios>`, `<RadioGroup.Item>`, or `<RadioGroup.Indicator>` causes 'Property does not exist' TypeScript errors. For grouping radios, prefer `Radio.Group` (sub-part of the `Radio` namespace).
  - anti-pattern: `<RadioGroup.Item value="a">...</RadioGroup.Item>`
  - fix: `<RadioGroup label="..."><Radio.Root value="a"><Radio.Indicator />Option</Radio.Root></RadioGroup>`
  - complete example:
    ```tsx
    import { RadioGroup } from '@tale-ui/react/radio-group';
    import { Radio } from '@tale-ui/react/radio';
    
    export function Example() {
      return (
        <RadioGroup label="Favorite color">
          <Radio.Root value="red">
            <Radio.Indicator />
            Red
          </Radio.Root>
          <Radio.Root value="blue">
            <Radio.Indicator />
            Blue
          </Radio.Root>
        </RadioGroup>
      );
    }
    ```

<!-- cross-pitfall-ref: no-cross-import-checkbox-group -->

## Notes

- This is the same component as `Radio.Group` — see [Radio](radio.md) for the full API, props, examples, and CSS classes.
- Prefer `import { Radio } from '@tale-ui/react/radio'` and use `<Radio.Group>` for consistency with the namespace pattern.
