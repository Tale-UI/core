import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Utilities',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  tableRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-m)', padding: '6px 0', borderBottom: '1px solid var(--neutral-14)' },
  code: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', minWidth: '220px', flexShrink: 0, color: 'var(--neutral-70)' },
  badge: { fontSize: 'var(--text-xs)', padding: '2px 6px', borderRadius: 'var(--radius-s)', fontFamily: 'monospace' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-2xl) 0' },
};

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

// ─── Stories ──────────────────────────────────────────────────────────────────

export const DisplayVisibility: Story = {
  name: 'Display & Visibility',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Display & Visibility</h2>
      <p className="text--body-m" style={s.description}>
        Display utilities have responsive variants (except <code style={{ fontFamily: 'monospace' }}>.display--inline</code>).
        Visibility utilities also have responsive variants.
      </p>

      {[
        { cls: 'display--none', value: 'display: none', responsive: true },
        { cls: 'display--block', value: 'display: block', responsive: true },
        { cls: 'display--inline-block', value: 'display: inline-block', responsive: true },
        { cls: 'display--inline', value: 'display: inline', responsive: false, note: 'No responsive variants' },
        { cls: 'display--flex', value: 'display: flex', responsive: true },
        { cls: 'display--grid', value: 'display: grid', responsive: true },
        { cls: 'display--contents', value: 'display: contents', responsive: true },
        { cls: 'visibility--hidden', value: 'visibility: hidden', responsive: true },
        { cls: 'visibility--visible', value: 'visibility: visible', responsive: true },
        { cls: 'sr-only', value: 'Screen reader only (clip + overflow)', responsive: false, note: 'Accessibility' },
      ].map(({ cls, value, responsive, note }) => (
        <div key={cls} style={s.tableRow}>
          <code style={s.code}>.{cls}</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', flex: 1 }}>{value}</span>
          {responsive
            ? <span style={{ ...s.badge, background: 'var(--color-10)', color: 'var(--color-80)' }}>responsive</span>
            : note
              ? <span style={{ ...s.badge, background: 'var(--neutral-12)', color: 'var(--neutral-60)' }}>{note}</span>
              : null}
        </div>
      ))}
    </div>
  ),
};

export const Dimensions: Story = {
  name: 'Width & Height',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Width & Height</h2>
      <p className="text--body-m" style={s.description}>
        Width classes set <code style={{ fontFamily: 'monospace' }}>width</code> as a percentage.
        Height classes set <code style={{ fontFamily: 'monospace' }}>min-height</code> in vh.
        No responsive variants for either.
      </p>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Width</h3>
      <div style={{ marginBottom: 'var(--space-xl)', background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)' }}>
        {[10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 100].map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: '4px' }}>
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', minWidth: '110px' }}>.width--{n}</code>
            <div style={{ flex: 1, background: 'var(--neutral-20)', borderRadius: 'var(--radius-s)', height: '16px' }}>
              <div style={{ width: `${n}%`, height: '100%', background: 'var(--color-60)', borderRadius: 'var(--radius-s)' }} />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '36px' }}>{n}%</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginTop: '4px' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', minWidth: '110px' }}>.width--auto</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>width: auto</span>
        </div>
      </div>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Height</h3>
      <p className="text--body-s" style={{ color: 'var(--neutral-60)', marginBottom: 'var(--space-m)' }}>
        Sets <code style={{ fontFamily: 'monospace' }}>min-height</code> in viewport units.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-xs)' }}>
        {[25, 50, 75, 100].map((n) => (
          <div key={n} style={s.tableRow}>
            <code style={{ ...s.code, minWidth: 'unset' }}>.height--{n}</code>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>{n}vh</span>
          </div>
        ))}
        <div style={s.tableRow}>
          <code style={{ ...s.code, minWidth: 'unset' }}>.height--auto</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>auto</span>
        </div>
      </div>
    </div>
  ),
};

export const AspectRatios: Story = {
  name: 'Aspect Ratios',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Aspect Ratios</h2>
      <p className="text--body-m" style={s.description}>
        <code style={{ fontFamily: 'monospace' }}>.aspect--*</code> utilities set <code style={{ fontFamily: 'monospace' }}>aspect-ratio</code>.
        Automatically applies <code style={{ fontFamily: 'monospace' }}>object-fit: cover</code> to <code style={{ fontFamily: 'monospace' }}>img</code> and <code style={{ fontFamily: 'monospace' }}>video</code> children.
        No responsive variants.
      </p>

      <div className="grid--5 gap--m">
        {[
          ['1-1',  '1/1'],
          ['2-1',  '2/1'],
          ['1-2',  '1/2'],
          ['3-2',  '3/2'],
          ['2-3',  '2/3'],
          ['4-3',  '4/3'],
          ['3-4',  '3/4'],
          ['16-9', '16/9'],
          ['9-16', '9/16'],
          ['21-9', '21/9'],
        ].map(([cls, ratio]) => (
          <div key={cls}>
            <div
              className={`aspect--${cls}`}
              style={{ background: 'var(--color-20)', border: '1px solid var(--color-40)', borderRadius: 'var(--radius-s)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', overflow: 'hidden' }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-70)', fontWeight: 'var(--heading-font-weight)' }}>{ratio}</span>
            </div>
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', display: 'block', marginTop: '4px', textAlign: 'center' }}>.aspect--{cls}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Opacity: Story = {
  name: 'Opacity',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Opacity</h2>
      <p className="text--body-m" style={s.description}>
        Valid opacity values only — do not use other numbers.
        No responsive variants.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-m)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {[0, 5, 10, 25, 50, 75, 90, 95, 100].map((n) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              className={`opacity--${n}`}
              style={{ width: '64px', height: '64px', background: 'var(--color-60)', borderRadius: 'var(--radius-l)' }}
            />
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)' }}>.opacity--{n}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Borders: Story = {
  name: 'Borders & Dividers',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Borders</h2>
      <p className="text--body-m" style={s.description}>
        Border utilities add a 1px solid border using <code style={{ fontFamily: 'monospace' }}>--neutral-30</code> by default.
        Modifiers adjust the color. No responsive variants.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-m)', marginBottom: 'var(--space-2xl)' }}>
        {[
          { cls: 'border', label: 'border', note: 'all sides' },
          { cls: 'border-top', label: 'border-top', note: 'top only' },
          { cls: 'border-right', label: 'border-right', note: 'right only' },
          { cls: 'border-bottom', label: 'border-bottom', note: 'bottom only' },
          { cls: 'border-left', label: 'border-left', note: 'left only' },
          { cls: 'border-block', label: 'border-block', note: 'top + bottom' },
          { cls: 'border-inline', label: 'border-inline', note: 'left + right' },
        ].map(({ cls, note }) => (
          <div key={cls}>
            <div
              className={cls}
              style={{ padding: 'var(--space-m)', borderRadius: 'var(--radius-s)', background: 'var(--neutral-10)' }}
            >
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-70)' }}>.{cls}</code>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', margin: '4px 0 0' }}>{note}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Border Modifiers</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-m)', marginBottom: 'var(--space-2xl)' }}>
        {[
          { cls: 'border border--light', label: '--neutral-20 (light)' },
          { cls: 'border', label: '--neutral-30 (default)' },
          { cls: 'border border--dark', label: '--neutral-50 (dark)' },
        ].map(({ cls, label }) => (
          <div key={cls}>
            <div className={cls} style={{ padding: 'var(--space-m)', borderRadius: '4px', background: 'var(--neutral-10)' }}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-70)' }}>.{cls}</code>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', margin: '4px 0 0' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LineClamp: Story = {
  name: 'Line Clamp',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Line Clamp</h2>
      <p className="text--body-m" style={s.description}>
        Truncates text to N lines with an ellipsis. Values 1–5 only. No responsive variants.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-l)' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)' }}>
            <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', display: 'block', marginBottom: '8px' }}>.line-clamp--{n}</code>
            <p className={`text--body-m line-clamp--${n}`}>{lorem}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SectionPadding: Story = {
  name: 'Section Padding',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Section Padding</h2>
      <p className="text--body-m" style={s.description}>
        <code style={{ fontFamily: 'monospace' }}>.padding--*</code> applies <code style={{ fontFamily: 'monospace' }}>padding-block</code> using section-space tokens.
        Values: xs, s, m, l, xl. No responsive variants.
      </p>
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <div key={size} style={{ marginBottom: 'var(--space-m)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', display: 'block', marginBottom: '6px' }}>.padding--{size}</code>
          <div
            className={`padding--${size}`}
            style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', border: '1px solid var(--neutral-20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)' }}>padding-block: var(--section-space-{size})</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
