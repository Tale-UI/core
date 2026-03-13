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
  fgOverrides: string; // human-readable description of the override
};

const familySpecs: FamilySpec[] = [
  // No fg override — default pivot at 60
  { name: 'red',     lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'indigo',  lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'violet',  lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'purple',  lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'fuchsia', lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'pink',    lightTextFrom: 60, fgOverrides: 'default' },
  { name: 'rose',    lightTextFrom: 60, fgOverrides: 'default' },
  // --color-60-fg: var(--color-100) override — pivot shifts to 70
  { name: 'orange',  lightTextFrom: 70, fgOverrides: '60-fg → dark' },
  { name: 'sky',     lightTextFrom: 70, fgOverrides: '60-fg → dark' },
  // --color-60-fg + --color-70-fg: var(--color-100) overrides — pivot shifts to 80
  { name: 'amber',   lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'yellow',  lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'lime',    lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'green',   lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'emerald', lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'teal',    lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
  { name: 'cyan',    lightTextFrom: 80, fgOverrides: '60-fg + 70-fg → dark' },
];

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '1100px', margin: '0 auto', color: 'var(--neutral-80)' },
  section: { marginBottom: 'var(--space-2xl)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-m)' },
  familyName: { fontSize: 'var(--text-s)', fontWeight: 500, color: 'var(--neutral-70)', marginBottom: '6px', textTransform: 'capitalize' },
};

function SwatchStrip({ family, lightTextFrom }: { family: string; lightTextFrom: number }) {
  return (
    <div style={s.section}>
      <div style={s.familyName}>{family}</div>
      <div style={{ display: 'flex', gap: '2px', borderRadius: 'var(--radius-l)', overflow: 'hidden' }}>
        {shades.map((shade) => {
          const fgShade = shade >= lightTextFrom ? 5 : 100;
          return (
            <div
              key={shade}
              style={{
                height: '56px',
                flex: 1,
                background: `var(--${family}-${shade})`,
                color: `var(--${family}-${fgShade})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
                fontWeight: 'var(--heading-font-weight)',
              }}
              title={`--${family}-${shade}`}
            >
              {shade}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const BrandPalette: Story = {
  name: 'Brand Palette',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Color Palette</h2>
      <p className="text--body-m" style={s.description}>
        16 named color families. Each family has 11 shades (5–100). Apply a family with{' '}
        <code style={{ fontFamily: 'monospace' }}>.color-&#123;name&#125;</code> to remap all{' '}
        <code style={{ fontFamily: 'monospace' }}>--color-*</code> and{' '}
        <code style={{ fontFamily: 'monospace' }}>--brand-*</code> tokens.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
        {familySpecs.map(({ name, lightTextFrom }) => (
          <SwatchStrip key={name} family={name} lightTextFrom={lightTextFrom} />
        ))}
      </div>
    </div>
  ),
};

export const ContrastPairings: Story = {
  name: 'Contrast Pairings',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Contrast Pairings & Foreground Colors</h2>
      <p className="text--body-m" style={s.description}>
        Each cell shows the correct <code style={{ fontFamily: 'monospace' }}>--color-*-fg</code> value as live text on its paired background.
        The pivot (▲) marks where text switches from dark to light. Some families override shades 60 and/or 70 to keep dark text on lighter midtones.
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--space-m)', marginBottom: 'var(--space-l)', flexWrap: 'wrap' }}>
        {[
          { label: 'default — pivot at 60', bg: 'var(--neutral-14)', color: 'var(--neutral-70)' },
          { label: '60-fg → dark — pivot at 70', bg: 'var(--neutral-20)', color: 'var(--neutral-70)' },
          { label: '60+70-fg → dark — pivot at 80', bg: 'var(--neutral-28)', color: 'var(--neutral-70)' },
        ].map(({ label, bg, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-s)', background: bg, flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-xs)', color, fontFamily: 'monospace' }}>{label}</span>
          </div>
        ))}
      </div>

      {familySpecs.map(({ name, lightTextFrom, fgOverrides }) => (
        <div key={name} style={{ marginBottom: 'var(--space-m)' }}>
          {/* Family header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-s)', marginBottom: '4px' }}>
            <span style={{ fontSize: 'var(--text-s)', fontWeight: 'var(--heading-font-weight)', color: 'var(--neutral-80)', textTransform: 'capitalize', minWidth: '72px' }}>
              {name}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>
              {fgOverrides === 'default'
                ? '5–50 → --fg 100 · 60–100 → --fg 5'
                : fgOverrides === '60-fg → dark'
                  ? '5–60 → --fg 100 · 70–100 → --fg 5'
                  : '5–70 → --fg 100 · 80–100 → --fg 5'}
            </span>
          </div>

          {/* Swatch row */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {shades.map((shade) => {
              const useLightText = shade >= lightTextFrom;
              const fgShade = useLightText ? 5 : 100;
              const isPivot = shade === lightTextFrom;
              const isEdge = shade === lightTextFrom - 10 || shade === lightTextFrom + 10;
              return (
                <div key={shade} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      height: '56px',
                      background: `var(--${name}-${shade})`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      borderRadius: isPivot ? '4px 4px 0 0' : undefined,
                      outline: isPivot ? '2px solid var(--neutral-60)' : undefined,
                      outlineOffset: isPivot ? '-2px' : undefined,
                      position: 'relative',
                    }}
                    title={`--${name}-${shade} / --color-${shade}-fg → --${name}-${fgShade}`}
                  >
                    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1, color: `var(--${name}-${fgShade})` }}>
                      {shade}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', opacity: 0.8, lineHeight: 1, color: `var(--${name}-${fgShade})` }}>
                      fg:{fgShade}
                    </span>
                  </div>
                  {/* Pivot / edge marker */}
                  <div style={{ height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isPivot && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontFamily: 'monospace', fontWeight: 700 }}>▲</span>
                    )}
                    {isEdge && !isPivot && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-40)', fontFamily: 'monospace' }} title="Edge shade — may fail 4.5:1 AA">⚠</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 'var(--space-l)', padding: 'var(--space-m)', background: 'var(--neutral-12)', borderRadius: '8px' }}>
        <p className="text--label-s" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-80)' }}>Usage</p>
        <ul style={{ paddingLeft: 'var(--space-m)', color: 'var(--neutral-70)', margin: 0 }}>
          <li className="text--body-s" style={{ marginBottom: '4px' }}>
            Always use <code style={{ fontFamily: 'monospace' }}>--color-&#123;shade&#125;-fg</code> — it resolves to the correct fg automatically for the active family and mode
          </li>
          <li className="text--body-s" style={{ marginBottom: '4px' }}>
            Edge shades (⚠) on either side of the pivot often fail 4.5:1 AA for body text — safe for large text (18px+) and decorative use only
          </li>
          <li className="text--body-s">
            Fg overrides are built into <code style={{ fontFamily: 'monospace' }}>.color-&#123;name&#125;</code> — consumers never need to set them manually
          </li>
        </ul>
      </div>
    </div>
  ),
};

export const ColorTokens: Story = {
  name: 'Color Tokens',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Color Token Reference</h2>
      <p className="text--body-m" style={s.description}>
        All 16 families as compact swatches with their pivot shade highlighted.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-s)' }}>
        {familySpecs.map(({ name, lightTextFrom }) => (
          <div key={name} style={{ padding: 'var(--space-xs)', background: 'var(--neutral-12)', borderRadius: '8px' }}>
            <div style={{ marginBottom: '6px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--neutral-80)', textTransform: 'capitalize' }}>
              {name}
            </div>
            <div style={{ display: 'flex', gap: '2px', borderRadius: '4px', overflow: 'hidden' }}>
              {shades.map((shade) => {
                const isPivot = shade === lightTextFrom;
                const fgShade = shade >= lightTextFrom ? 5 : 100;
                return (
                  <div
                    key={shade}
                    style={{
                      height: '24px',
                      flex: 1,
                      background: `var(--${name}-${shade})`,
                      outline: isPivot ? '2px solid var(--neutral-60)' : undefined,
                      outlineOffset: isPivot ? '-2px' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={`--${name}-${shade} · fg → --${name}-${fgShade}`}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--neutral-50)' }}>
                .color-{name}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--neutral-50)' }}>
                pivot {lightTextFrom}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
