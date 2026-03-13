import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Data ─────────────────────────────────────────────────────────────────────

const shades = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const semanticFamilies = [
  { name: 'error', label: 'Error', description: 'Destructive actions, validation errors, danger states.' },
  { name: 'warning', label: 'Warning', description: 'Caution states, non-blocking alerts, advisory messages.' },
  { name: 'success', label: 'Success', description: 'Confirmations, completed states, positive feedback.' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
};

type SemanticFamily = 'error' | 'warning' | 'success';

function SemanticStrip({ family }: { family: SemanticFamily }) {
  // warning and success pivot at 70; error pivots at 60
  const pivotShade = family === 'error' ? 60 : 70;

  return (
    <div style={{ marginBottom: 'var(--space-m)' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {shades.map((shade) => {
          const isPivot = shade === pivotShade;
          return (
            <div key={shade} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  height: '56px',
                  background: `var(--${family}-${shade})`,
                  color: `var(--${family}-${shade}-fg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  borderRadius: isPivot ? 'var(--radius-s)' : undefined,
                  outline: isPivot ? '2px solid var(--neutral-60)' : undefined,
                  outlineOffset: isPivot ? '3px' : undefined,
                }}
                title={`--${family}-${shade}`}
              >
                {shade}
              </div>
              <div style={{ height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPivot && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontFamily: 'monospace', fontWeight: 700 }}>▲</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsageCard({ family, shade, label }: { family: SemanticFamily; shade: number; label: string }) {
  return (
    <div
      style={{
        background: `var(--${family}-${shade})`,
        color: `var(--${family}-${shade}-fg)`,
        padding: 'var(--space-m)',
        borderRadius: 'var(--radius-l)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2xs)',
      }}
    >
      <span className="text--label-s" style={{ color: 'inherit' }}>{label}</span>
      <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'inherit', opacity: 0.75 }}>
        --{family}-{shade} / --{family}-{shade}-fg
      </span>
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const SemanticColors: Story = {
  name: 'Semantic Colors',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Semantic Colors</h2>
      <p className="text--body-m" style={s.description}>
        Three semantic families: error, warning, and success. Each has 11 shades (5–100).
        Unlike <code style={{ fontFamily: 'monospace' }}>--color-*</code>, semantic tokens are <strong>static</strong> and do not invert in dark mode —
        semantic states should remain visually consistent across light and dark themes.
      </p>

      {semanticFamilies.map(({ name, label, description }) => (
        <div key={name} style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 className="text--title-l" style={{ marginBottom: 'var(--space-2xs)' }}>{label}</h3>
          <p className="text--body-s" style={{ color: 'var(--neutral-60)', marginBottom: 'var(--space-m)' }}>{description}</p>
          <SemanticStrip family={name as SemanticFamily} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-s)', marginTop: 'var(--space-m)' }}>
            <UsageCard family={name as SemanticFamily} shade={10} label="Light background / tinted surface" />
            <UsageCard family={name as SemanticFamily} shade={name === 'error' ? 60 : 60} label="Primary / badge / button" />
            <UsageCard family={name as SemanticFamily} shade={90} label="Dark / high contrast" />
          </div>
        </div>
      ))}
    </div>
  ),
};
