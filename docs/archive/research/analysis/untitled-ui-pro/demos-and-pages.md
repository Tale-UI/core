# UntitledUI Pro — Demo & Showcase Structure

## Key Finding: No Built-In Component Showcase

UntitledUI Pro does **not** include a component showcase, Storybook, or demo gallery. This is a deliberate design decision — the project is a **starter kit**, not a component browser.

## App Architecture

### Entry Point

```
index.html → src/main.tsx → App with routing
```

### Routing (2 pages only)

| Route | Page | Purpose |
|---|---|---|
| `/` | `HomeScreen` | Welcome/getting started |
| `*` | `NotFound` | 404 error page |

### Provider Stack

```tsx
<ThemeProvider>
    <RouterProvider>
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </RouterProvider>
</ThemeProvider>
```

## Home Screen (`src/pages/home-screen.tsx`)

A minimal welcome page with:

- UntitledUI logo
- "Copy install command" button (demonstrates `useClipboard` hook)
- Links to external documentation
- Uses: `Button`, `ButtonUtility`, `@untitledui/icons`

This is **not** a component demo — it's a project landing page.

## 404 Page (`src/pages/not-found.tsx`)

Standard error page with:

- Responsive layout (mobile/tablet/desktop)
- "Go back" button with `ArrowLeft` icon
- Demonstrates routing integration

## No Storybook

There are no:

- `.storybook/` directory
- `*.stories.tsx` files
- Storybook dependencies in `package.json`

## No Component Playground

There is no:

- Interactive component playground
- Props panel / knobs
- Live code editor
- Visual regression testing

## How Consumers Discover Components

### 1. External Documentation

UntitledUI hosts component docs at `untitledui.com/react/docs/introduction`. The starter kit's home page links there.

### 2. Source Code Browsing

Components are meant to be discovered by browsing `src/components/`. The directory structure is self-documenting:

```
base/checkbox/checkbox.tsx     → "I need a checkbox"
base/select/select.tsx         → "I need a dropdown select"
application/table/table.tsx    → "I need a data table"
```

### 3. TypeScript Types

Props interfaces serve as API documentation. IDE autocomplete reveals available props, sizes, and colors.

### 4. CLAUDE.md

AI agents use the CLAUDE.md file for component discovery and usage patterns.

## Provider Architecture

### ThemeProvider (`src/providers/theme-provider.tsx`)

```tsx
type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>();
```

- Persists to `localStorage` with key `ui-theme`
- Toggles `.dark-mode` class on `<html>`
- Listens to `prefers-color-scheme` media query
- Provides `useTheme()` hook

### RouterProvider (`src/providers/router-provider.tsx`)

Bridges React Router with React Aria Components:

```tsx
// Declaration merging for React Aria's router config
declare module "react-aria-components" {
    interface RouterConfig {
        routerOptions: NavigateOptions;
    }
}
```

Uses `useNavigate()` from React Router, passed to React Aria's `RouterProvider`.

## Styles Architecture

### globals.css (69 lines)

- Tailwind imports
- Custom variants: `dark`, `label`, `focus-input-within`
- Utility classes: `scrollbar-hide`, `transition-inherit-all`
- Base HTML/body styles

### theme.css (856 lines)

- Complete `@theme` block with design tokens
- Typography scale, spacing, radius, shadows
- Container max-width (1280px)
- Breakpoints (320px–600px for custom, standard Tailwind for responsive)
- Skeuomorphic shadow definitions

### typography.css (430 lines)

- Inter font family definition
- Text utility classes combining size + weight
- Display typography for headings
- Letter spacing for large display sizes

## Development Workflow

```bash
npm run dev      # Vite dev server at localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # Preview production build
```

No test runner, no linting scripts, no CI/CD in the starter kit.

## Comparison with Tale UI's Demo Strategy

| Aspect | UntitledUI Pro | Tale UI |
|---|---|---|
| Component showcase | None (external website) | Vite playground + Storybook |
| Demo pages | 2 (home + 404) | ComponentAudit + per-component demos |
| Interactive playground | None | `pnpm playground:dev` |
| Storybook | None | Yes (`playground/storybook/`) |
| Component audit | None | `ComponentAudit.tsx` exercises all components |
| Visual regression | None | Browser tests (`.spec.tsx`) |
| Discovery method | Browse source + external docs | Browse docs + playground + Storybook |
