import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Neutrals',
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

function NeutralStrip({ family, showFg = false }: { family: typeof neutralFamilies[number]; showFg?: boolean }) {
  return (
    <div className={family.class || undefined} style={s.familyBlock}>
      <div style={s.familyLabel}>{family.label}</div>
      <div style={s.swatchRow}>
        {neutralShades.map((shade) => (
          <div
            key={shade}
            style={{
              height: showFg ? '56px' : '40px',
              flex: 1,
              background: `var(--neutral-${shade})`,
              color: showFg ? `var(--neutral-${shade}-fg)` : undefined,
              display: showFg ? 'flex' : 'block',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-xs)',
              fontFamily: 'monospace',
              fontWeight: 'var(--heading-font-weight)',
            }}
            title={`--neutral-${shade}`}
          >
            {showFg ? shade : null}
          </div>
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

export const AllFamilies: Story = {
  name: 'All Families',
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

export const WarmNeutral: Story = {
  name: 'Warm (default)',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Warm Neutral (default)</h2>
      <p className="text--body-m" style={s.description}>
        The default neutral family. Used when no <code style={{ fontFamily: 'monospace' }}>.neutral-*</code> class is applied.
      </p>
      <NeutralStrip family={neutralFamilies[0]} showFg />
    </div>
  ),
};

export const CoolNeutral: Story = {
  name: 'Cool',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Cool Neutral</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.neutral-cool</code> to any ancestor.
      </p>
      <NeutralStrip family={neutralFamilies[1]} showFg />
    </div>
  ),
};

export const SlateNeutral: Story = {
  name: 'Slate',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Slate Neutral</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.neutral-slate</code> to any ancestor.
      </p>
      <NeutralStrip family={neutralFamilies[2]} showFg />
    </div>
  ),
};

export const GrayNeutral: Story = {
  name: 'Gray',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Gray Neutral</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.neutral-gray</code> to any ancestor.
      </p>
      <NeutralStrip family={neutralFamilies[3]} showFg />
    </div>
  ),
};

export const OnyxNeutral: Story = {
  name: 'Onyx',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Onyx Neutral</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.neutral-onyx</code> to any ancestor.
      </p>
      <NeutralStrip family={neutralFamilies[4]} showFg />
    </div>
  ),
};

export const MonoNeutral: Story = {
  name: 'Mono',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Mono Neutral</h2>
      <p className="text--body-m" style={s.description}>
        Apply <code style={{ fontFamily: 'monospace' }}>.neutral-mono</code> to any ancestor. Pure achromatic scale.
      </p>
      <NeutralStrip family={neutralFamilies[5]} showFg />
    </div>
  ),
};

export const DarkModeInversion: Story = {
  name: 'Dark Mode Inversion',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Dark Mode Inversion</h2>
      <p className="text--body-m" style={s.description}>
        In dark mode, <code style={{ fontFamily: 'monospace' }}>--neutral-*</code> tokens invert automatically.
        Shade 5 becomes near-black and shade 100 becomes near-white. Toggle dark mode using the toolbar above.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
        {([5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const).map((shade) => (
          <div
            key={shade}
            style={{
              background: `var(--neutral-${shade})`,
              color: `var(--neutral-${shade}-fg)`,
              padding: 'var(--space-m)',
              borderRadius: 'var(--radius-l)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="text--label-s">--neutral-{shade}</span>
            <span className="text--label-xs" style={{ fontFamily: 'monospace', opacity: 0.75 }}>
              fg: --neutral-{shade}-fg
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
