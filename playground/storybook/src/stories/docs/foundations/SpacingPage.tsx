import * as React from 'react';

const spaceTokens = [
  { token: '--space-4xs', min: '0.30625rem', max: '0.325rem' },
  { token: '--space-3xs', min: '0.4125rem', max: '0.4375rem' },
  { token: '--space-2xs', min: '0.5125rem', max: '0.61875rem' },
  { token: '--space-xs',  min: '0.6375rem', max: '0.875rem' },
  { token: '--space-s',   min: '0.8rem', max: '1.2375rem' },
  { token: '--space-m',   min: '1rem', max: '1.75rem' },
  { token: '--space-l',   min: '1.25rem', max: '2.475rem' },
  { token: '--space-xl',  min: '1.5625rem', max: '3.5rem' },
  { token: '--space-2xl', min: '1.95625rem', max: '4.95rem' },
  { token: '--space-3xl', min: '2.44375rem', max: '6.99375rem', note: 'No gap utility' },
  { token: '--space-4xl', min: '3.05rem', max: '9.89375rem', note: 'No gap utility' },
] as const;

const sectionTokens = [
  { token: '--section-space-xs', min: '1.25rem', max: '2.475rem' },
  { token: '--section-space-s',  min: '1.95625rem', max: '4.95rem' },
  { token: '--section-space-m',  min: '2.44375rem', max: '6.99375rem' },
  { token: '--section-space-l',  min: '3.05rem', max: '9.89375rem' },
  { token: '--section-space-xl', min: '3.8125rem', max: '13.98125rem' },
] as const;

const spacingGuidance = [
  {
    range: '4xs / 3xs',
    token: '--space-3xs',
    use: 'Micro gaps inside compact controls, badges, metadata rows, icon/text pairs, and tiny inline padding.',
  },
  {
    range: '2xs',
    token: '--space-2xs',
    use: 'Tight spacing between closely related labels, values, chips, or small inline controls.',
  },
  {
    range: 'xs',
    token: '--space-xs',
    use: 'Action rows, heading-to-content separation inside dense panels, code-block padding, and compact card content.',
  },
  {
    range: 's',
    token: '--space-s',
    use: 'Standard card or panel padding, related item groups, form field stacks, and medium-density grids.',
  },
  {
    range: 'm',
    token: '--space-m',
    use: 'Larger component groups, relaxed content stacks, mobile page gutters, and intentionally roomy panels.',
  },
  {
    range: 'l / xl / 2xl',
    token: '--space-l',
    use: 'Page-level rhythm, desktop page gutters, major layout grids, section separation, and large editorial gaps.',
  },
] as const;

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2xs) var(--space-m)', marginBottom: 'var(--space-2xs)', minHeight: '32px' },
  bar: { background: 'var(--color-60)', borderRadius: 'var(--radius-s)', flexShrink: 0, maxWidth: '100%' },
  tokenLabel: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-70)', minWidth: '100px', flexShrink: 0 },
  range: { fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' },
  note: { fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', fontStyle: 'italic', marginLeft: 'var(--space-xs)' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-2xl) 0' },
  guidanceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-s)', marginBottom: 'var(--space-xl)' },
  guidanceCard: { border: '1px solid var(--neutral-18)', borderRadius: 'var(--radius-m)', background: 'var(--neutral-10)', padding: 'var(--space-s)' },
  guidanceSample: { display: 'flex', alignItems: 'center', marginTop: 'var(--space-s)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-s)', background: 'var(--neutral-5)' },
  sampleBox: { width: '1.25rem', height: '1.25rem', flex: '0 0 1.25rem', borderRadius: 'var(--radius-s)', background: 'var(--color-20)', border: '1px solid var(--color-30)' },
  sampleToken: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', marginLeft: 'auto', whiteSpace: 'nowrap' },
  utilityGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'var(--space-xs)' },
  utilityItem: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-xs)', padding: '4px 8px', background: 'var(--neutral-16)', borderRadius: 'var(--radius-s)' },
};

export function SpacingPage() {
  return (
    <div style={s.page}>
      {/* Component Spacing */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Component Spacing</h2>
      <p className="text--body-m" style={s.description}>
        11 fluid tokens for component-level spacing. All values scale between 480px and 1600px viewport using{' '}
        <code style={{ fontFamily: 'monospace' }}>clamp()</code>. Gap utility classes (<code style={{ fontFamily: 'monospace' }}>.gap--*</code>) are available for tokens up to <code style={{ fontFamily: 'monospace' }}>--space-2xl</code>.
      </p>

      <h3 className="text--title-s" style={{ margin: '0 0 var(--space-s)' }}>Usage guidance</h3>
      <div style={s.guidanceGrid}>
        {spacingGuidance.map((entry) => (
          <div key={entry.range} style={s.guidanceCard}>
            <p className="text--label-s" style={{ color: 'var(--neutral-90)', marginBottom: 'var(--space-2xs)' }}>
              {entry.range}
            </p>
            <p className="text--body-s" style={{ color: 'var(--neutral-60)', margin: 0 }}>
              {entry.use}
            </p>
            <div style={{ ...s.guidanceSample, gap: `var(${entry.token})` }}>
              <div style={s.sampleBox} />
              <div style={s.sampleBox} />
              <code style={s.sampleToken}>
                {entry.token}
              </code>
            </div>
          </div>
        ))}
      </div>

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
        <div style={s.utilityGrid}>
          {['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'].map((size) => (
            <div key={size} style={s.utilityItem}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>.gap--{size}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success-60)' }}>✓</span>
            </div>
          ))}
          {['3xl', '4xl'].map((size) => (
            <div key={size} style={{ ...s.utilityItem, opacity: 0.6 }}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>.gap--{size}</code>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' }}>token only</span>
            </div>
          ))}
        </div>
      </div>

      <hr style={s.divider} />

      {/* Section Spacing */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Section Spacing</h2>
      <p className="text--body-m" style={s.description}>
        5 larger-scale tokens for vertical page rhythm. Used by the{' '}
        <code style={{ fontFamily: 'monospace' }}>.padding--*</code> utility classes (xs through xl). Use section spacing for vertical padding on full page sections or bands; keep card padding, form stacks, and compact dashboards on the general <code style={{ fontFamily: 'monospace' }}>--space-*</code> scale.
      </p>

      {sectionTokens.map(({ token, min, max }) => (
        <div key={token} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2xs) var(--space-m)', marginBottom: '6px' }}>
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
  );
}
