import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction/Getting Started',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

const s: Record<string, React.CSSProperties> = {
  page: {
    padding: 'var(--space-2xl)',
    maxWidth: '800px',
    margin: '0 auto',
    color: 'var(--neutral-80)',
  },
  pageTitle: {
    marginTop: 'var(--space-2xl)',
    marginBottom: 'var(--space-xs)',
  },
  intro: {
    color: 'var(--neutral-55)',
    marginBottom: 'var(--space-2xl)',
    borderBottom: '1px solid var(--neutral-14)',
    paddingBottom: 'var(--space-2xl)',
  },
  section: {
    marginBottom: 'var(--space-3xl)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-s)',
    marginBottom: 'var(--space-m)',
  },
  sectionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-m)',
    background: 'var(--color-20)',
    color: 'var(--color-70)',
    fontSize: 'var(--label-s-font-size)',
    fontWeight: 'var(--label-font-weight)',
    flexShrink: 0,
  },
  sectionTitle: {
    margin: 0,
  },
  body: {
    color: 'var(--neutral-60)',
    lineHeight: 1.7,
    marginBottom: 'var(--space-m)',
    marginTop: 0,
  },
  codeBlock: {
    background: 'var(--neutral-12)',
    border: '1px solid var(--neutral-18)',
    borderRadius: 'var(--radius-m)',
    padding: 'var(--space-m) var(--space-l)',
    margin: 'var(--space-s) 0 var(--space-m)',
    overflowX: 'auto' as const,
  },
  code: {
    fontFamily: 'var(--mono-font-family, monospace)',
    fontSize: 'var(--mono-s-font-size)',
    color: 'var(--neutral-75)',
    whiteSpace: 'pre' as const,
    display: 'block',
    lineHeight: 1.6,
  },
  inlineCode: {
    fontFamily: 'var(--mono-font-family, monospace)',
    fontSize: '0.9em',
    background: 'var(--neutral-12)',
    border: '1px solid var(--neutral-18)',
    borderRadius: 'var(--radius-s)',
    padding: '1px 6px',
    color: 'var(--neutral-70)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    margin: 'var(--space-m) 0',
    fontSize: 'var(--label-s-font-size)',
  },
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    background: 'var(--neutral-12)',
    color: 'var(--neutral-60)',
    fontWeight: 'var(--label-font-weight)',
    borderBottom: '1px solid var(--neutral-18)',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid var(--neutral-14)',
    color: 'var(--neutral-65)',
    verticalAlign: 'top' as const,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--neutral-14)',
    margin: 'var(--space-3xl) 0',
  },
  comingSoonCard: {
    background: 'var(--neutral-10)',
    border: '1px solid var(--neutral-16)',
    borderRadius: 'var(--radius-l)',
    padding: 'var(--space-m) var(--space-l)',
  },
  platformList: {
    display: 'flex',
    gap: 'var(--space-s)',
    flexWrap: 'wrap' as const,
    marginTop: 'var(--space-s)',
  },
  platformPill: {
    background: 'var(--neutral-14)',
    color: 'var(--neutral-55)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--label-xs-font-size)',
    fontWeight: 'var(--label-font-weight)',
  },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <div style={s.codeBlock}>
      <code style={s.code}>{children}</code>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return <code style={s.inlineCode}>{children}</code>;
}

export const GettingStartedPage: Story = {
  name: 'Getting Started',
  render: () => (
    <div style={s.page}>
      <h1 className="text--heading-m" style={s.pageTitle}>Getting Started</h1>
      <p className="text--body-m" style={s.intro}>
        Tale provides a token-based CSS design system and a React component library. Pick the
        integration that matches your stack.
      </p>

      {/* CSS Framework */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>1</div>
          <h2 className="text--title-l" style={s.sectionTitle}>CSS Framework</h2>
        </div>
        <p className="text--body-m" style={s.body}>
          Use <InlineCode>@tale-ui/core</InlineCode> with any web project — no framework required.
          You get design tokens, utility classes, typography, color families, dark mode, and layout
          primitives that work in plain HTML, Vue, Angular, or any other stack.
        </p>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Install</h3>
        <CodeBlock>{`npm install @tale-ui/core
# or
pnpm add @tale-ui/core`}</CodeBlock>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Import</h3>
        <CodeBlock>{`/* In your CSS entry point */
@import '@tale-ui/core';`}</CodeBlock>

        <p className="text--body-m" style={s.body}>
          Or link directly from <InlineCode>node_modules</InlineCode>:
        </p>
        <CodeBlock>{`<link rel="stylesheet" href="node_modules/@tale-ui/core/dist/index.css">`}</CodeBlock>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Use tokens and utilities</h3>
        <CodeBlock>{`<!-- Design tokens as CSS variables -->
<button style="
  background: var(--color-60);
  color: var(--color-60-fg);
  padding: var(--space-xs) var(--space-m);
  border-radius: var(--radius-m);
">Primary</button>

<!-- Utility classes -->
<div class="gap--m grid--3">
  <p class="text--body-m">Body text</p>
  <h1 class="text--display-m">Display</h1>
</div>

<!-- Dark mode — set on <html> -->
<html data-color-mode="dark">
  <!-- All --neutral-* and --color-* tokens auto-invert -->
</html>`}</CodeBlock>

        <p className="text--body-m" style={s.body}>
          Explore tokens and utilities in the{' '}
          <strong>Foundations</strong> section of the sidebar.
        </p>
      </div>

      <hr style={s.divider} />

      {/* React */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>2</div>
          <h2 className="text--title-l" style={s.sectionTitle}>React</h2>
        </div>
        <p className="text--body-m" style={s.body}>
          <InlineCode>@tale-ui/react</InlineCode> provides accessible, styled components with BEM
          class names applied automatically. Built on a fork of Base UI — headless primitives with
          Tale&apos;s styling layer on top.
        </p>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Install</h3>
        <CodeBlock>{`pnpm add @tale-ui/react @tale-ui/react-styles`}</CodeBlock>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Quick start</h3>
        <CodeBlock>{`// App entry — import styles once
import '@tale-ui/react-styles';

// Import components per-file
import { Button } from '@tale-ui/react/button';
import { Input } from '@tale-ui/react/input';

export default function App() {
  return (
    <>
      <Button variant="primary">Save changes</Button>
      <Input placeholder="Enter value" />
    </>
  );
}`}</CodeBlock>

        <p className="text--body-m" style={s.body}>
          That&apos;s it. Components apply their BEM base class automatically (e.g.{' '}
          <InlineCode>tale-button</InlineCode>). The stylesheet handles the rest.
        </p>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Package architecture</h3>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Package</th>
              <th style={s.th}>What it provides</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['@tale-ui/core', 'Design tokens, utility classes, dark mode, typography foundations'],
              ['@tale-ui/react-styles', 'Opinionated CSS for every component — built on @tale-ui/core tokens'],
              ['@tale-ui/react', 'Accessible React components with BEM class names auto-applied. Accepts variant and size props.'],
            ].map(([pkg, desc]) => (
              <tr key={pkg}>
                <td style={s.td}><InlineCode>{pkg}</InlineCode></td>
                <td style={s.td}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>CSS import strategies</h3>
        <p className="text--body-m" style={s.body}>
          <strong>All-in-one</strong> (recommended) — one import loads tokens + all component CSS:
        </p>
        <CodeBlock>{`import '@tale-ui/react-styles';`}</CodeBlock>
        <p className="text--body-m" style={s.body}>
          <strong>Per-component</strong> — import only what you use (you must also import{' '}
          <InlineCode>@tale-ui/core</InlineCode> separately):
        </p>
        <CodeBlock>{`import '@tale-ui/core';
import '@tale-ui/react-styles/button';
import '@tale-ui/react-styles/dialog';`}</CodeBlock>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Dark mode</h3>
        <CodeBlock>{`// Set data-color-mode on <html> — tokens invert automatically
document.documentElement.setAttribute('data-color-mode', 'dark');

// Or listen to OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-color-mode', prefersDark ? 'dark' : 'light');`}</CodeBlock>

        <h3 className="text--label-l" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Framework notes</h3>
        <p className="text--body-m" style={s.body}>
          <strong>Vite</strong> — works out of the box. See{' '}
          <InlineCode>playground/vite-app/</InlineCode> for a working example.
        </p>
        <p className="text--body-m" style={s.body}>
          <strong>Tailwind coexistence</strong> — Tale sets{' '}
          <InlineCode>html {'{ font-size: 62.5% }'}</InlineCode> so that 1rem = 10px. If your app
          also uses Tailwind or Bootstrap, add{' '}
          <InlineCode>html {'{ font-size: 100%; }'}</InlineCode> after the Tale import.
        </p>
      </div>

      <hr style={s.divider} />

      {/* More platforms */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={{ ...s.sectionBadge, background: 'var(--neutral-14)', color: 'var(--neutral-50)' }}>3</div>
          <h2 className="text--title-l" style={s.sectionTitle}>More platforms coming</h2>
        </div>
        <div style={s.comingSoonCard}>
          <p className="text--body-m" style={{ ...s.body, marginBottom: 'var(--space-s)' }}>
            React is the first officially supported framework. Support for additional platforms is
            planned — the token and CSS layers work everywhere today.
          </p>
          <div style={s.platformList}>
            {['Vue', 'Svelte', 'Solid', 'Web Components'].map((p) => (
              <span key={p} style={s.platformPill}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
