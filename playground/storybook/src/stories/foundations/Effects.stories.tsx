import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Effects',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  card: {
    background: 'var(--neutral-5)',
    padding: 'var(--space-m)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
    minHeight: '100px',
  },
  cardLabel: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-2xl) 0' },
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const BorderRadius: Story = {
  name: 'Border Radius',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Border Radius</h2>
      <p className="text--body-m" style={s.description}>
        7 radius utility classes. No responsive variants. Apply as{' '}
        <code style={{ fontFamily: 'monospace' }}>.radius--&#123;size&#125;</code>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-m)' }}>
        {(['xs', 's', 'm', 'l', 'xl', '2xl', 'full'] as const).map((size) => (
          <div key={size}>
            <div
              className={`radius--${size}`}
              style={{ ...s.card, border: '2px solid var(--neutral-20)' }}
            >
              <span className="text--label-m" style={{ color: 'var(--neutral-70)' }}>{size}</span>
              <code style={s.cardLabel}>.radius--{size}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  name: 'Shadows',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Shadows</h2>
      <p className="text--body-m" style={s.description}>
        5 shadow elevation levels. No responsive variants. Apply as{' '}
        <code style={{ fontFamily: 'monospace' }}>.shadow--&#123;size&#125;</code>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2xl)', padding: 'var(--space-2xl) var(--space-l)' }}>
        {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
          <div key={size}>
            <div
              className={`shadow--${size} radius--m`}
              style={{ ...s.card, border: 'none' }}
            >
              <span className="text--label-m" style={{ color: 'var(--neutral-70)' }}>{size}</span>
              <code style={s.cardLabel}>.shadow--{size}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ZIndex: Story = {
  name: 'Z-Index Scale',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Z-Index Scale</h2>
      <p className="text--body-m" style={s.description}>
        Structured z-index utilities. No responsive variants.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
        {[
          { cls: 'z--bottom', value: '-1', note: 'Behind everything' },
          { cls: 'z--0',      value: '0',  note: '' },
          { cls: 'z--10',     value: '10', note: '' },
          { cls: 'z--20',     value: '20', note: '' },
          { cls: 'z--30',     value: '30', note: '' },
          { cls: 'z--40',     value: '40', note: '' },
          { cls: 'z--50',     value: '50', note: '' },
          { cls: 'z--60',     value: '60', note: '' },
          { cls: 'z--70',     value: '70', note: '' },
          { cls: 'z--80',     value: '80', note: '' },
          { cls: 'z--90',     value: '90', note: '' },
          { cls: 'z--top',    value: '9999', note: 'Above everything' },
        ].map(({ cls, value, note }) => (
          <div
            key={cls}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: 'var(--neutral-12)',
              borderRadius: 'var(--radius-m)',
            }}
          >
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>.{cls}</code>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
              {note && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', fontStyle: 'italic' }}>{note}</span>}
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', minWidth: '36px', textAlign: 'right' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-m)', background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)' }}>
        <p className="text--label-s" style={{ color: 'var(--neutral-70)', marginBottom: 'var(--space-xs)' }}>Stacking demo</p>
        <div style={{ position: 'relative', height: '120px', width: '360px' }}>
          {[
            { cls: 'z--10', offset: 0, label: '.z--10' },
            { cls: 'z--30', offset: 40, label: '.z--30' },
            { cls: 'z--50', offset: 80, label: '.z--50' },
          ].map(({ cls, offset, label }) => (
            <div
              key={cls}
              className={`${cls} radius--m`}
              style={{
                position: 'absolute',
                left: `${offset}px`,
                top: '20px',
                width: '120px',
                height: '80px',
                background: 'var(--color-60)',
                color: 'var(--color-60-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
                fontWeight: 'var(--heading-font-weight)',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const AllEffects: Story = {
  name: 'Overview',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Effects Overview</h2>
      <p className="text--body-m" style={s.description}>
        Radius, shadows, and z-index utilities — all have no responsive variants.
      </p>

      <h3 className="text--title-l" style={{ marginBottom: 'var(--space-m)' }}>Border Radius</h3>
      <div style={{ display: 'flex', gap: 'var(--space-l)', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)' }}>
        {(['xs', 's', 'm', 'l', 'xl', '2xl', 'full'] as const).map((size) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              className={`radius--${size}`}
              style={{ width: '64px', height: '64px', background: 'var(--color-20)', border: '2px solid var(--color-60)' }}
            />
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)' }}>{size}</code>
          </div>
        ))}
      </div>

      <h3 className="text--title-l" style={{ marginBottom: 'var(--space-m)' }}>Shadows</h3>
      <div style={{ display: 'flex', gap: 'var(--space-2xl)', flexWrap: 'wrap', padding: 'var(--space-m) var(--space-l)', marginBottom: 'var(--space-2xl)' }}>
        {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              className={`shadow--${size} radius--m`}
              style={{ width: '80px', height: '80px', background: 'var(--neutral-5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)' }}>{size}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
