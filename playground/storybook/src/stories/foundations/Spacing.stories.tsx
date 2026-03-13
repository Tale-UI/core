import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Data ─────────────────────────────────────────────────────────────────────

const spaceTokens = [
  { token: '--space-4xs', min: '0.49rem', max: '0.52rem' },
  { token: '--space-3xs', min: '0.66rem', max: '0.70rem' },
  { token: '--space-2xs', min: '0.82rem', max: '0.99rem' },
  { token: '--space-xs',  min: '1.02rem', max: '1.40rem' },
  { token: '--space-s',   min: '1.28rem', max: '1.98rem' },
  { token: '--space-m',   min: '1.60rem', max: '2.80rem' },
  { token: '--space-l',   min: '2.00rem', max: '3.96rem' },
  { token: '--space-xl',  min: '2.50rem', max: '5.60rem' },
  { token: '--space-2xl', min: '3.13rem', max: '7.92rem' },
  { token: '--space-3xl', min: '3.91rem', max: '11.19rem', note: 'No gap utility' },
  { token: '--space-4xl', min: '4.88rem', max: '15.83rem', note: 'No gap utility' },
] as const;

const sectionTokens = [
  { token: '--section-space-xs', min: '2.00rem', max: '3.96rem' },
  { token: '--section-space-s',  min: '3.13rem', max: '7.92rem' },
  { token: '--section-space-m',  min: '3.91rem', max: '11.19rem' },
  { token: '--section-space-l',  min: '4.88rem', max: '15.83rem' },
  { token: '--section-space-xl', min: '6.10rem', max: '22.37rem' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  row: { display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: 'var(--space-2xs)', minHeight: '32px' },
  bar: { background: 'var(--color-60)', borderRadius: 'var(--radius-s)', flexShrink: 0 },
  tokenLabel: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-70)', minWidth: '100px', flexShrink: 0 },
  range: { fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' },
  note: { fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', fontStyle: 'italic', marginLeft: 'var(--space-xs)' },
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ComponentSpacing: Story = {
  name: 'Component Spacing',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Component Spacing</h2>
      <p className="text--body-m" style={s.description}>
        11 fluid tokens for component-level spacing. All values scale between 480px and 1600px viewport using{' '}
        <code style={{ fontFamily: 'monospace' }}>clamp()</code>. Gap utility classes (<code style={{ fontFamily: 'monospace' }}>.gap--*</code>) are available for tokens up to <code style={{ fontFamily: 'monospace' }}>--space-2xl</code>.
      </p>

      {spaceTokens.map((entry) => (
        <div key={entry.token} style={s.row}>
          <span style={s.tokenLabel}>{entry.token}</span>
          <div style={{ ...s.bar, width: `var(${entry.token})`, height: '20px' }} />
          <span style={s.range}>{entry.min} → {entry.max}</span>
          {'note' in entry && entry.note && <span style={s.note}>({entry.note})</span>}
        </div>
      ))}

      <div style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)', marginTop: 'var(--space-l)' }}>
        <p className="text--label-s" style={{ color: 'var(--neutral-70)', marginBottom: 'var(--space-xs)' }}>Gap utility class availability</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
          {['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'].map((size) => (
            <div key={size} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'var(--neutral-16)', borderRadius: 'var(--radius-s)' }}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>.gap--{size}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success-60)' }}>✓</span>
            </div>
          ))}
          {['3xl', '4xl'].map((size) => (
            <div key={size} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'var(--neutral-16)', borderRadius: 'var(--radius-s)', opacity: 0.6 }}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>.gap--{size}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>token only</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SectionSpacing: Story = {
  name: 'Section Spacing',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Section Spacing</h2>
      <p className="text--body-m" style={s.description}>
        5 larger-scale tokens for vertical page rhythm. Used by the{' '}
        <code style={{ fontFamily: 'monospace' }}>.padding--*</code> utility classes (xs through xl).
      </p>

      {sectionTokens.map(({ token, min, max }) => (
        <div key={token} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: '6px' }}>
            <span style={s.tokenLabel}>{token}</span>
            <span style={s.range}>{min} → {max}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'flex-end' }}>
            <div style={{ background: 'var(--neutral-16)', borderRadius: 'var(--radius-s)', width: '40px', height: `var(${token})` }} />
            <div style={{ background: 'var(--color-20)', borderRadius: 'var(--radius-s)', width: '40px', height: `var(${token})` }} />
          </div>
        </div>
      ))}
    </div>
  ),
};
