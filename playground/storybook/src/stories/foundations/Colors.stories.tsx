import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const shades = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const colorFamilies = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet',
  'purple', 'fuchsia', 'pink', 'rose',
] as const;

// Per-family fg pivot — derived directly from _color-themes.css.
// lightTextFrom = first shade whose --color-*-fg resolves to the light value (shade 5).
// All shades before this use dark text (shade 100).
type FamilySpec = {
  name: typeof colorFamilies[number];
  lightTextFrom: 60 | 70 | 80;
};

const familySpecs: FamilySpec[] = [
  // No fg override — default pivot at 60
  { name: 'red',     lightTextFrom: 60 },
  { name: 'indigo',  lightTextFrom: 60 },
  { name: 'violet',  lightTextFrom: 60 },
  { name: 'purple',  lightTextFrom: 60 },
  { name: 'fuchsia', lightTextFrom: 60 },
  { name: 'pink',    lightTextFrom: 60 },
  { name: 'rose',    lightTextFrom: 60 },
  // --color-60-fg: var(--color-100) override — pivot shifts to 70
  { name: 'orange',  lightTextFrom: 70 },
  { name: 'sky',     lightTextFrom: 70 },
  // --color-60-fg + --color-70-fg: var(--color-100) overrides — pivot shifts to 80
  { name: 'amber',   lightTextFrom: 80 },
  { name: 'yellow',  lightTextFrom: 80 },
  { name: 'lime',    lightTextFrom: 80 },
  { name: 'green',   lightTextFrom: 80 },
  { name: 'emerald', lightTextFrom: 80 },
  { name: 'teal',    lightTextFrom: 80 },
  { name: 'cyan',    lightTextFrom: 80 },
];

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '1100px', margin: '0 auto', color: 'var(--neutral-80)' },
  section: { marginBottom: 'var(--space-l)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-m)' },
  familyName: { fontSize: 'var(--text-s)', fontWeight: 500, color: 'var(--neutral-70)', textTransform: 'capitalize' },
};

function SwatchStrip({ family, lightTextFrom }: { family: string; lightTextFrom: number }) {
  return (
    <div className={`color-${family}`} style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={s.familyName}>{family}</span>
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--neutral-40)' }}>
          pivot {lightTextFrom} · <span style={{ fontFamily: 'monospace' }}>.color-{family}</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {shades.map((shade) => {
          const fgShade = shade >= lightTextFrom ? 5 : 100;
          const isPivot = shade === lightTextFrom;
          return (
            <div key={shade} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  height: '56px',
                  background: `var(--brand-${shade})`,
                  color: `var(--brand-${fgShade})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  fontWeight: 'var(--heading-font-weight)',
                  borderRadius: isPivot ? 'var(--radius-s)' : undefined,
                  outline: isPivot ? '2px solid var(--neutral-60)' : undefined,
                  outlineOffset: isPivot ? '3px' : undefined,
                }}
                title={`--brand-${shade}`}
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const BrandPalette: Story = {
  name: 'Named Colors',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Color Palette</h2>
      <p className="text--body-m" style={s.description}>
        16 named color families, each with 11 shades (5–100). Shade numbers are rendered using their paired{' '}
        <code style={{ fontFamily: 'monospace' }}>--color-*-fg</code> foreground color. The outlined shade (▲) is the pivot — where foreground text switches from dark to light.
        Apply a family with <code style={{ fontFamily: 'monospace' }}>.color-&#123;name&#125;</code> to remap all{' '}
        <code style={{ fontFamily: 'monospace' }}>--color-*</code> and <code style={{ fontFamily: 'monospace' }}>--brand-*</code> tokens.
      </p>

      {/* Pivot legend */}
      <div style={{ display: 'flex', gap: 'var(--space-m)', marginBottom: 'var(--space-l)', flexWrap: 'wrap' }}>
        {[
          { label: 'pivot at 60 (default)', bg: 'var(--neutral-14)' },
          { label: 'pivot at 70 — shade 60 fg overridden to dark', bg: 'var(--neutral-20)' },
          { label: 'pivot at 80 — shades 60 + 70 fg overridden to dark', bg: 'var(--neutral-28)' },
        ].map(({ label, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-s)', background: bg, flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontFamily: 'monospace' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
        {familySpecs.map(({ name, lightTextFrom }) => (
          <SwatchStrip key={name} family={name} lightTextFrom={lightTextFrom} />
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-l)', padding: 'var(--space-m)', background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)' }}>
        <p className="text--label-s" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-80)' }}>Usage</p>
        <ul style={{ paddingLeft: 'var(--space-m)', color: 'var(--neutral-70)', margin: 0 }}>
          <li className="text--body-s" style={{ marginBottom: '4px' }}>
            Always use <code style={{ fontFamily: 'monospace' }}>--color-&#123;shade&#125;-fg</code> — it resolves to the correct foreground automatically for the active family and mode
          </li>
          <li className="text--body-s">
            Fg overrides are built into <code style={{ fontFamily: 'monospace' }}>.color-&#123;name&#125;</code> — consumers never need to set them manually
          </li>
        </ul>
      </div>
    </div>
  ),
};
