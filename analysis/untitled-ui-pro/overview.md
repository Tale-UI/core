# UntitledUI Pro — Project Overview & Architecture

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| React Aria Components | 1.16.0 | Accessibility & behavior |
| Vite | 8.0.2 | Build tool & dev server |
| TipTap | 3.20.5 | Rich text editor |
| Recharts | 3.8.0 | Charts |
| React Hook Form | 7.72.0 | Form state management |
| Motion | 12.38.0 | Animations |

## Directory Structure

```
pro/
├── CLAUDE.md                    # AI guidance document (36KB)
├── README.md                    # Project overview
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config (@ alias)
├── vite.config.ts               # Vite + Tailwind + React
├── .prettierrc                  # Prettier config (import sorting, Tailwind)
├── index.html                   # Entry HTML
├── public/                      # Static assets
└── src/
    ├── main.tsx                 # React app entry
    ├── components/
    │   ├── base/                # 20 core UI components
    │   ├── application/         # 12 complex feature components
    │   ├── foundations/         # 5 directories + 6 loose icon/visual files
    │   ├── marketing/           # 1 marketing component
    │   └── shared-assets/       # 6 directories + 3 loose utility files
    ├── hooks/                   # 3 custom hooks
    ├── pages/                   # 2 route pages (home, 404)
    ├── providers/               # ThemeProvider, RouterProvider
    ├── styles/                  # globals.css, theme.css, typography.css
    ├── types/                   # TypeScript definitions
    └── utils/                   # cx.ts, is-react-component.ts, countries, timezones
```

## Component Categories

### Base Components (20)

Core form controls and UI primitives:

- avatar, badges, button-group, buttons, checkbox, dropdown
- file-upload-trigger, form, input, progress-indicators
- radio-buttons, radio-groups, select, slider, tags
- text-editor, textarea, toggle, tooltip, video-player (Pro only)

### Application Components (12)

Complex, multi-component feature patterns:

- app-navigation (7 variants), carousel, charts, date-picker
- empty-state, file-upload, loading-indicator, modals
- pagination, slideout-menus, table, tabs

### Foundations (5 directories + 6 loose files)

Design tokens and visual assets:

**Directories:**

- featured-icon, integration-icons (17 files), logo (full + minimal)
- payment-icons (57 files), social-icons (23 files)

**Loose files:**

- dot-icon.tsx, folder-icon.tsx, play-button-icon.tsx
- rating-badge.tsx, rating-stars.tsx, star-icon.tsx

### Marketing (1)

- header-navigation (marketing page header with mega-menu dropdowns)

### Shared Assets (6 directories + 3 loose files)

**Directories:**

- background-patterns, banners (20 variants), credit-card
- illustrations, image-cropper, not-found (404)

**Loose files:**

- iphone-mockup.tsx, qr-code.tsx, section-divider.tsx

## File Naming Convention

**All files use kebab-case** — enforced project-wide:

- Components: `date-picker.tsx`, `button-group.tsx`
- Hooks: `use-clipboard.ts`, `use-breakpoint.ts`
- Utilities: `is-react-component.ts`

Component exports use PascalCase (`DatePicker`, `ButtonGroup`).

## Key Dependencies

### Core

- `react` + `react-dom` 19.2.4
- `react-aria-components` 1.16.0 + `react-aria` 3.47.0
- `tailwindcss` 4.2.2 with `@tailwindcss/vite`
- `tailwind-merge` 3.5.0

### Rich Content (Pro-only)

- `@tiptap/*` (6 packages) — rich text editor
- `recharts` 3.8.0 — charts
- `react-image-crop` 11.0.10 — image cropping
- `qr-code-styling` 1.9.2 — QR code generation

### Forms & Interaction

- `react-hook-form` 7.72.0
- `motion` 12.38.0 — animations
- `input-otp` 1.4.2 — OTP input
- `react-hotkeys-hook` — keyboard shortcuts

### Icons

- `@untitledui/icons` 0.0.21 (1,100+ free icons)
- `@untitledui/file-icons` 0.0.9
- `@untitledui-pro/icons` (4,600+ pro icons, 4 styles)

## Development Workflow

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # TypeScript compile + Vite build
npm run preview  # Preview production build
```

## Build Configuration

- Vite with `@tailwindcss/vite` plugin and `@vitejs/plugin-react`
- TypeScript with `@` path alias mapping to `./src/`
- Prettier with `prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`
- Import order: React → external packages → `@/` absolute → relative

## Project Model

UntitledUI Pro is a **starter kit**, not a published npm package. Consumers either:

1. Clone the starter repo and build on top of it
2. Use `npx untitledui@latest add` to selectively add components
3. Copy-paste component source files directly

There is no `npm install @untitledui/react` — the source code IS the deliverable.
