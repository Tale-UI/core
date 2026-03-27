# SocialButton

`import { SocialButton } from '@tale-ui/react/social-button';`

A social login button with a provider icon on the left.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| provider | `'google' \| 'github' \| 'apple' \| 'x' \| 'facebook'` | (required) | Social provider whose icon to display |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

Also accepts all standard `<button>` HTML attributes.

## Basic Usage

```tsx
<SocialButton provider="google">Sign in with Google</SocialButton>
```

## Examples

### All Providers

```tsx
<SocialButton provider="google">Sign in with Google</SocialButton>
<SocialButton provider="github">Continue with GitHub</SocialButton>
<SocialButton provider="apple">Sign in with Apple</SocialButton>
<SocialButton provider="x">Sign in with X</SocialButton>
<SocialButton provider="facebook">Continue with Facebook</SocialButton>
```

### All Sizes

```tsx
<SocialButton provider="google" size="sm">Sign in with Google</SocialButton>
<SocialButton provider="google" size="md">Sign in with Google</SocialButton>
<SocialButton provider="google" size="lg">Sign in with Google</SocialButton>
```

## CSS Classes

- `.tale-social-button` -- Base
- `.tale-social-button--google` / `--github` / `--apple` / `--x` / `--facebook` -- Provider modifiers
- `.tale-social-button--sm` / `--md` / `--lg` -- Size modifiers
- `.tale-social-button__icon` -- Icon wrapper

## Notes

- Custom component -- not built on a React Aria primitive.
- Renders a `<button type="button">` element.
- Each provider has its own branded SVG icon embedded in the component.
- Pass label text as `children` (e.g. "Sign in with Google").
