import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Layout',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '1100px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  cell: {
    background: 'var(--color-20)',
    border: '1px solid var(--color-40)',
    borderRadius: 'var(--radius-s)',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-xs)',
    fontFamily: 'monospace',
    color: 'var(--neutral-70)',
    minHeight: '40px',
  },
  box: {
    background: 'var(--color-60)',
    color: 'var(--color-60-fg)',
    borderRadius: 'var(--radius-s)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-xs)',
    fontFamily: 'monospace',
    fontWeight: 'var(--heading-font-weight)',
  },
  row: { display: 'flex', gap: 'var(--space-s)', alignItems: 'center', marginBottom: 'var(--space-m)', flexWrap: 'wrap' },
  label: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginBottom: '6px' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-2xl) 0' },
};

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function Cell({ label = 'cell', style }: { label?: string; style?: React.CSSProperties }) {
  return <div style={{ ...s.cell, ...style }}>{label}</div>;
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const GapScale: Story = {
  name: 'Gap',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Gap</h2>
      <p className="text--body-m" style={s.description}>
        <code style={{ fontFamily: 'monospace' }}>.gap--*</code> sets both row and column gap.{' '}
        <code style={{ fontFamily: 'monospace' }}>.col-gap--*</code> and{' '}
        <code style={{ fontFamily: 'monospace' }}>.row-gap--*</code> set each independently.
        All have responsive variants (<code style={{ fontFamily: 'monospace' }}>-xl -l -m -s</code>).
        Note: <code style={{ fontFamily: 'monospace' }}>.gap--none</code> only applies at ≤480px.
      </p>

      {(['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'] as const).map((size) => (
        <div key={size} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={s.label}>.gap--{size}</div>
          <div className={`gap--${size}`} style={{ display: 'flex' }}>
            {['A', 'B', 'C', 'D'].map((l) => (
              <div key={l} style={{ ...s.cell, flex: 1 }}>{l}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FixedGrids: Story = {
  name: 'Fixed Grids',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Fixed Column Grids</h2>
      <p className="text--body-m" style={s.description}>
        <code style={{ fontFamily: 'monospace' }}>.grid--&#123;1–12&#125;</code> creates equal-width column grids.
        All have responsive variants. Combine with <code style={{ fontFamily: 'monospace' }}>.gap--*</code> for gutters.
      </p>

      {[1, 2, 3, 4, 5, 6, 8, 12].map((n) => (
        <div key={n} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={s.label}>.grid--{n}</div>
          <div className={`grid--${n} gap--xs`}>
            {letters.slice(0, n).map((l) => (
              <Cell key={l} label={l} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const RatioGrids: Story = {
  name: 'Ratio Grids',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Ratio Grids</h2>
      <p className="text--body-m" style={s.description}>
        Two-column grids with proportional widths. All have responsive variants.
      </p>

      {[
        ['grid--1-2', '1fr 2fr'],
        ['grid--2-1', '2fr 1fr'],
        ['grid--1-3', '1fr 3fr'],
        ['grid--3-1', '3fr 1fr'],
        ['grid--2-3', '2fr 3fr'],
        ['grid--3-2', '3fr 2fr'],
      ].map(([cls, ratio]) => (
        <div key={cls} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={s.label}>.{cls} <span style={{ color: 'var(--neutral-40)' }}>({ratio})</span></div>
          <div className={`${cls} gap--xs`}>
            <Cell label="A" />
            <Cell label="B" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AutoFitGrids: Story = {
  name: 'Auto-Fit Grids',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Auto-Fit Grids</h2>
      <p className="text--body-m" style={s.description}>
        Responsive grids that wrap items. <code style={{ fontFamily: 'monospace' }}>.grid--auto-&#123;2–12&#125;</code> sets the minimum column count.
        Items wrap onto new rows as the viewport narrows. All have responsive variants.
      </p>

      {[2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={s.label}>.grid--auto-{n}</div>
          <div className={`grid--auto-${n} gap--xs`}>
            {letters.slice(0, n + 2).map((l) => (
              <Cell key={l} label={l} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FlexboxLayouts: Story = {
  name: 'Flexbox',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Flexbox</h2>
      <p className="text--body-m" style={s.description}>
        Direction classes have responsive variants. <code style={{ fontFamily: 'monospace' }}>.flex--wrap</code> and{' '}
        <code style={{ fontFamily: 'monospace' }}>.flex--grow</code> do not.
      </p>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Direction</h3>
      {([
        ['flex--row', 'Row (default)'],
        ['flex--col', 'Column'],
        ['flex--row-reverse', 'Row reverse'],
        ['flex--col-reverse', 'Column reverse'],
      ] as const).map(([cls, label]) => (
        <div key={cls} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={s.label}>.{cls} — {label}</div>
          <div className={`${cls} gap--xs`} style={{ display: 'flex', background: 'var(--neutral-12)', border: '1px dashed var(--neutral-30)', borderRadius: 'var(--radius-l)', padding: '8px', minHeight: '48px' }}>
            {['A', 'B', 'C', 'D'].map((l) => (
              <div key={l} style={{ ...s.box, width: '40px', height: '40px', flexShrink: 0 }}>{l}</div>
            ))}
          </div>
        </div>
      ))}

      <hr style={s.divider} />
      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Wrap & Grow</h3>
      <div style={{ marginBottom: 'var(--space-m)' }}>
        <div style={s.label}>.flex--wrap — wraps items onto multiple lines</div>
        <div className="flex--wrap gap--xs" style={{ display: 'flex', background: 'var(--neutral-12)', border: '1px dashed var(--neutral-30)', borderRadius: 'var(--radius-l)', padding: '8px', width: '200px' }}>
          {letters.slice(0, 8).map((l) => (
            <div key={l} style={{ ...s.box, width: '40px', height: '40px' }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-m)' }}>
        <div style={s.label}>.flex--grow — all direct children get flex-grow: 1</div>
        <div className="flex--grow gap--xs" style={{ display: 'flex', background: 'var(--neutral-12)', border: '1px dashed var(--neutral-30)', borderRadius: 'var(--radius-l)', padding: '8px' }}>
          {['A', 'B', 'C'].map((l) => (
            <div key={l} style={{ ...s.box, height: '40px' }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const CenteringUtilities: Story = {
  name: 'Centering',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Centering</h2>
      <p className="text--body-m" style={s.description}>
        7 centering directions. All have responsive variants (<code style={{ fontFamily: 'monospace' }}>-xl -l -m -s</code>).
        These use double-selector specificity in the source CSS (only relevant to CSS authors, not HTML users).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-m)' }}>
        {([
          ['center--all',    'All (h+v center)'],
          ['center--x',      'X (horizontal)'],
          ['center--y',      'Y (vertical)'],
          ['center--left',   'Left (align left)'],
          ['center--right',  'Right (align right)'],
          ['center--top',    'Top (align top)'],
          ['center--bottom', 'Bottom (align bottom)'],
        ] as const).map(([cls, label]) => (
          <div key={cls}>
            <div style={s.label}>.{cls}</div>
            <div
              className={cls}
              style={{
                background: 'var(--neutral-12)',
                border: '1px dashed var(--neutral-30)',
                borderRadius: 'var(--radius-l)',
                height: '100px',
              }}
            >
              <div style={{ ...s.box, width: '48px', height: '32px' }}>item</div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const GridPositioning: Story = {
  name: 'Grid Positioning',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Grid Positioning</h2>
      <p className="text--body-m" style={s.description}>
        Column/row span, start, end, and order utilities for precise grid placement. All have responsive variants.
      </p>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Column Span</h3>
      <div className="grid--6 gap--xs" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="col-span--1" style={{ ...s.cell, background: 'var(--color-20)' }}>span 1</div>
        <div className="col-span--2" style={{ ...s.cell, background: 'var(--color-30)' }}>span 2</div>
        <div className="col-span--3" style={{ ...s.cell, background: 'var(--color-40)' }}>span 3</div>
        <div className="col-span--all" style={{ ...s.cell, background: 'var(--color-60)', color: 'var(--color-60-fg)' }}>span all (.col-span--all)</div>
        <div className="col-span--4" style={{ ...s.cell, background: 'var(--color-30)' }}>span 4</div>
        <div className="col-span--2" style={{ ...s.cell, background: 'var(--color-20)' }}>span 2</div>
      </div>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Column Start</h3>
      <div className="grid--6 gap--xs" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="col-start--2 col-span--3" style={{ ...s.cell, background: 'var(--color-40)' }}>start 2, span 3</div>
        <div className="col-start--1 col-span--1" style={{ ...s.cell, background: 'var(--color-20)' }}>start 1</div>
        <div className="col-start--4 col-span--2" style={{ ...s.cell, background: 'var(--color-30)' }}>start 4, span 2</div>
      </div>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Order</h3>
      <div className="grid--4 gap--xs" style={{ marginBottom: 'var(--space-xl)' }}>
        {(['A', 'B', 'C', 'D'] as const).map((l, i) => (
          <Cell key={l} label={`${l} (DOM order ${i + 1})`} />
        ))}
        <div style={s.label}>With .order--first / .order--last:</div>
        <div className="order--last" style={{ ...s.cell, background: 'var(--color-20)' }}>A (.order--last)</div>
        <Cell label="B" />
        <Cell label="C" />
        <div className="order--first" style={{ ...s.cell, background: 'var(--color-60)', color: 'var(--color-60-fg)' }}>D (.order--first)</div>
      </div>

      <div style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)' }}>
        <p className="text--label-s" style={{ marginBottom: 'var(--space-xs)', color: 'var(--neutral-70)' }}>Available positioning classes</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          {[
            '.col-span--{1–12}', '.col-span--all',
            '.row-span--{1–12}', '',
            '.col-start--{1–12}', '.col-end--{1–12}',
            '.col-end--last', '',
            '.row-start--{1–12}', '.row-end--{1–12}',
            '.order--first', '.order--last',
          ].map((cls, i) => cls ? (
            <code key={i} style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', padding: '4px 8px', background: 'var(--neutral-16)', borderRadius: 'var(--radius-s)' }}>
              {cls}
            </code>
          ) : <div key={i} />)}
        </div>
      </div>
    </div>
  ),
};
