import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Data ─────────────────────────────────────────────────────────────────────

// Irregular neutral shade scale — do not add or remove values
const neutralShades = [5, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100] as const;

const neutralFamilies = [
  { name: 'warm', label: 'Warm (default)', class: '' },
  { name: 'cool', label: 'Cool', class: 'neutral-cool' },
  { name: 'slate', label: 'Slate', class: 'neutral-slate' },
  { name: 'gray', label: 'Gray', class: 'neutral-gray' },
  { name: 'onyx', label: 'Onyx', class: 'neutral-onyx' },
  { name: 'mono', label: 'Mono', class: 'neutral-mono' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '1100px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  familyBlock: { marginBottom: 'var(--space-xl)' },
  familyLabel: { fontSize: 'var(--text-s)', fontWeight: 'var(--heading-font-weight)', color: 'var(--neutral-70)', marginBottom: '8px' },
  swatchRow: { display: 'flex', gap: '2px', borderRadius: 'var(--radius-l)', overflow: 'hidden', marginBottom: '4px' },
  shadeNums: { display: 'flex', gap: '2px', marginBottom: 'var(--space-xs)' },
  shadeNum: { flex: 1, textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', fontFamily: 'monospace', lineHeight: '1.2' },
};

function NeutralStrip({ family }: { family: typeof neutralFamilies[number] }) {
  return (
    <div className={family.class || undefined} style={s.familyBlock}>
      <div style={s.familyLabel}>{family.label}</div>
      <div style={s.swatchRow}>
        {neutralShades.map((shade) => (
          <div
            key={shade}
            style={{
              height: '40px',
              flex: 1,
              background: `var(--neutral-${shade})`,
            }}
            title={`--neutral-${shade}`}
          />
        ))}
      </div>
      <div style={s.shadeNums}>
        {neutralShades.map((shade) => (
          <span key={shade} style={s.shadeNum}>{shade}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const NeutralColors: Story = {
  name: 'Neutral Colors',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Neutral Color Families</h2>
      <p className="text--body-m" style={s.description}>
        Six neutral families with 27 shades each (irregular scale: 5, 10, 12–30 by 2s, 40–70 by 10s, 80–100 by 2s).
        Apply a family with <code style={{ fontFamily: 'monospace' }}>.neutral-&#123;family&#125;</code> on any ancestor.
        Always use <code style={{ fontFamily: 'monospace' }}>--neutral-*</code> tokens in component CSS — they
        auto-remap when a family class is applied.
      </p>
      {neutralFamilies.map((family) => (
        <NeutralStrip key={family.name} family={family} />
      ))}
    </div>
  ),
};
