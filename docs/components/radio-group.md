# RadioGroup

`import { RadioGroup } from '@tale-ui/react/radio-group';`

A convenience re-export of `Radio.Group` from `@tale-ui/react/radio`. Both import paths resolve to the same component.

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

## Notes

- This is the same component as `Radio.Group` — see [Radio](radio.md) for the full API, props, examples, and CSS classes.
- Prefer `import { Radio } from '@tale-ui/react/radio'` and use `<Radio.Group>` for consistency with the namespace pattern.
