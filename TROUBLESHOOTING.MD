# Troubleshooting

## Checkbox ticks not visible

**Symptom:** Checkboxes render as empty boxes with no checkmark or minus icon, even when checked.

**Cause:** `Checkbox.Indicator` only renders the indicator box — it does **not** include a built-in icon. You must provide your own SVG as children.

**Wrong:**

```tsx
<Checkbox.Root>
  <Checkbox.Indicator />
  Accept terms
</Checkbox.Root>
```

**Correct:**

```tsx
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

<Checkbox.Root>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
  Accept terms
</Checkbox.Root>
```

**Note:** The `.d.ts` `@example` block shows `<Checkbox.Indicator />` self-closing, which is misleading. The full docs (`node_modules/@tale-ui/react/docs/checkbox.md`) clarify that a child icon is required. For indeterminate state, use a minus icon instead of a checkmark.
