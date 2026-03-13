import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Data ─────────────────────────────────────────────────────────────────────

const colorFamilies = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet',
  'purple', 'fuchsia', 'pink', 'rose',
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-2xl) 0' },
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ColorFamilies: Story = {
  name: 'Color Families',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Color Override Classes</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.color-&#123;name&#125;</code> to any ancestor to remap all{' '}
        <code style={{ fontFamily: 'monospace' }}>--color-*</code> and <code style={{ fontFamily: 'monospace' }}>--brand-*</code> tokens to that family.
        Components using <code style={{ fontFamily: 'monospace' }}>--color-*</code> tokens will automatically adopt the theme.
        Uses single-dash notation (not double-dash).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-s)' }}>
        {colorFamilies.map((family) => (
          <div
            key={family}
            className={`color-${family}`}
            style={{
              background: 'var(--color-60)',
              color: 'var(--color-60-fg)',
              padding: 'var(--space-m)',
              borderRadius: 'var(--radius-l)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2xs)',
            }}
          >
            <span className="text--label-m" style={{ textTransform: 'capitalize', color: 'inherit' }}>{family}</span>
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', opacity: 0.75, color: 'inherit' }}>.color-{family}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const DarkLightMode: Story = {
  name: 'Dark & Light Mode',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Dark & Light Mode</h2>
      <p className="text--body-m" style={s.description}>
        Toggle dark mode using the toolbar above. Dark mode is controlled by{' '}
        <code style={{ fontFamily: 'monospace' }}>html[data-color-mode="dark"]</code>.
        All <code style={{ fontFamily: 'monospace' }}>--neutral-*</code> and <code style={{ fontFamily: 'monospace' }}>--color-*</code> tokens invert automatically.
        Semantic tokens (<code style={{ fontFamily: 'monospace' }}>--error-*</code>, <code style={{ fontFamily: 'monospace' }}>--warning-*</code>,{' '}
        <code style={{ fontFamily: 'monospace' }}>--success-*</code>) are static and do not invert.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-l)', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <p className="text--label-s" style={{ color: 'var(--neutral-60)', marginBottom: 'var(--space-s)' }}>--neutral-* (inverts in dark mode)</p>
          {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((shade) => (
            <div
              key={shade}
              style={{
                background: `var(--neutral-${shade})`,
                color: `var(--neutral-${shade}-fg)`,
                padding: '6px 12px',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
              }}
            >
              --neutral-{shade}
            </div>
          ))}
        </div>

        <div className="color-teal">
          <p className="text--label-s" style={{ color: 'var(--neutral-60)', marginBottom: 'var(--space-s)' }}>--color-* (inverts in dark mode)</p>
          {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((shade) => (
            <div
              key={shade}
              style={{
                background: `var(--color-${shade})`,
                color: `var(--color-${shade}-fg)`,
                padding: '6px 12px',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
              }}
            >
              --color-{shade}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)' }}>
        <p className="text--label-s" style={{ color: 'var(--neutral-70)', marginBottom: 'var(--space-xs)' }}>How to enable dark mode</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-s)' }}>
          {[
            ['Via attribute', 'html[data-color-mode="dark"]'],
            ['Via class', 'html.dark'],
            ['Light override', 'html[data-color-mode="light"]'],
            ['Light class', 'html.light'],
          ].map(([label, code]) => (
            <div key={label} style={{ background: 'var(--neutral-16)', borderRadius: 'var(--radius-m)', padding: '8px 12px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginBottom: '4px' }}>{label}</p>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-80)' }}>{code}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
