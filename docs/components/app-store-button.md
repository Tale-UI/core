# AppStoreButton

`import { AppStoreButton } from '@tale-ui/react/app-store-button';`

A dark-styled app store download button with embedded store logo and auto-generated text.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `store` | `'apple' \| 'google'` | — | Target app store (required) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

Also accepts all standard `<a>` HTML attributes except `children`. Set `href` to the store URL.

## Basic Usage

```tsx
<AppStoreButton store="apple" href="https://apps.apple.com/..." />
```

## Examples

### Both Stores

```tsx
<AppStoreButton store="apple" href="https://apps.apple.com/app/example" />
<AppStoreButton store="google" href="https://play.google.com/store/apps/details?id=example" />
```

### All Sizes

```tsx
<AppStoreButton store="apple" href="#" size="sm" />
<AppStoreButton store="apple" href="#" size="md" />
<AppStoreButton store="apple" href="#" size="lg" />
```

## CSS Classes

- `.tale-app-store-button` — Base (dark background, white text)
- `.tale-app-store-button--apple` / `--google` — Store modifiers
- `.tale-app-store-button--sm` / `--md` / `--lg` — Size modifiers
- `.tale-app-store-button__icon` — Store logo SVG
- `.tale-app-store-button__text` — Text wrapper
- `.tale-app-store-button__label` — Top label ("Download on the" / "GET IT ON")
- `.tale-app-store-button__store` — Store name ("App Store" / "Google Play")

## Notes

- Custom component — not built on a React Aria primitive.
- Renders an `<a>` element with `target="_blank"` and `rel="noopener noreferrer"` by default.
- The Apple variant displays the Apple logo and "Download on the App Store".
- The Google variant displays the Google Play triangle logo (with brand colors) and "GET IT ON Google Play".
- Does not accept `children` — text and logo are auto-generated from the `store` prop.
