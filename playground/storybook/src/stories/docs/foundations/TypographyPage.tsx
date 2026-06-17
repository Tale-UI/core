import * as React from 'react';

const fontSizeTokens = [
  { token: '--text-xs',  label: 'xs' },
  { token: '--text-s',   label: 's' },
  { token: '--text-m',   label: 'm' },
  { token: '--text-l',   label: 'l' },
  { token: '--text-xl',  label: 'xl' },
  { token: '--text-2xl', label: '2xl' },
  { token: '--text-3xl', label: '3xl' },
  { token: '--text-4xl', label: '4xl' },
  { token: '--text-5xl', label: '5xl' },
  { token: '--text-6xl', label: '6xl' },
  { token: '--text-7xl', label: '7xl' },
  { token: '--text-8xl', label: '8xl' },
] as const;

const typeClasses = [
  { category: 'Display',  sizes: ['display-l', 'display-m', 'display-s'] },
  { category: 'Heading',  sizes: ['heading-l', 'heading-m', 'heading-s'] },
  { category: 'Title',    sizes: ['title-l', 'title-m', 'title-s'] },
  { category: 'Label',    sizes: ['label-l', 'label-m', 'label-s', 'label-xs'] },
  { category: 'Body',     sizes: ['body-l', 'body-m', 'body-s', 'body-xs'] },
  { category: 'Mono',     sizes: ['mono-l', 'mono-m', 'mono-s', 'mono-xs'] },
] as const;

const hierarchyGuidance = [
  {
    context: 'Application page title',
    className: 'text--heading-l',
    text: 'Tale UI Tooling',
    note: 'Top-level title for dashboards and operational apps.',
  },
  {
    context: 'Section title',
    className: 'text--title-l',
    text: 'Applications',
    note: 'Major content area within a page.',
  },
  {
    context: 'Card title',
    className: 'text--title-s',
    text: 'MCP Studio',
    note: 'Nested panel or card heading.',
  },
  {
    context: 'Item label',
    className: 'text--label-s',
    text: 'Provider status',
    note: 'Rows, metadata names, navigation, and compact labels.',
  },
  {
    context: 'Supporting copy',
    className: 'text--body-s',
    text: 'Prompt-to-TSX maintainer tool backed by local providers.',
    note: 'Descriptions and helper text in dense layouts.',
  },
  {
    context: 'Command or path',
    className: 'text--mono-s',
    text: 'pnpm studio:dev',
    note: 'Commands, paths, IDs, and route values.',
  },
] as const;

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-xl) 0' },
  hierarchyPanel: { border: '1px solid var(--neutral-18)', borderRadius: 'var(--radius-l)', background: 'var(--neutral-10)', padding: 'var(--space-l)', marginBottom: 'var(--space-xl)' },
  hierarchyRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'var(--space-xs) var(--space-m)', alignItems: 'baseline', padding: 'var(--space-xs) 0', borderBottom: '1px solid var(--neutral-16)' },
  codeLabel: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)' },
  sampleRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-2xs) var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' },
  sampleRowCenter: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2xs) var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' },
  sampleLabel: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '120px', flex: '0 0 auto' },
  sampleLabelWide: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '140px', flex: '0 0 auto' },
  sampleLabelXWide: { fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '180px', flex: '0 0 auto' },
  sampleText: { flex: '1 1 16rem', minWidth: 0, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  wrappingSample: { flex: '1 1 16rem', minWidth: 0, maxWidth: '280px', overflow: 'hidden' },
};

const sampleText = 'The quick brown fox jumps over the lazy dog';
const sampleLong = 'Typography is the art of arranging type to make written language legible, readable, and appealing.';

export function TypographyPage() {
  return (
    <div className="sb-unstyled" style={s.page}>
      {/* Type Scale */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Font Size Scale</h2>
      <p className="text--body-m" style={s.description}>
        12 fluid font-size tokens. All scale with viewport via <code style={{ fontFamily: 'monospace' }}>clamp()</code>.
        Use these tokens in component CSS: <code style={{ fontFamily: 'monospace' }}>font-size: var(--text-m)</code>.
      </p>

      {fontSizeTokens.map(({ token }) => (
        <div
          key={token}
          style={s.sampleRow}
        >
          <span style={s.sampleLabel}>
            {token}
          </span>
          <span style={{ ...s.sampleText, fontSize: `var(${token})`, color: 'var(--neutral-80)', lineHeight: 1.3 }}>
            {sampleText}
          </span>
        </div>
      ))}

      <hr style={s.divider} />

      {/* Hierarchy Guidance */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Hierarchy Guidance</h2>
      <p className="text--body-m" style={s.description}>
        Type should usually get smaller as content becomes more nested. Reserve display styles for heroes and prominent editorial leads; use tighter heading, title, label, body, and mono roles for apps, dashboards, and repeated operational layouts.
      </p>

      <div style={s.hierarchyPanel}>
        {hierarchyGuidance.map((entry, index) => (
          <div
            key={entry.context}
            style={{
              ...s.hierarchyRow,
              paddingLeft: `calc(var(--space-3xs) * ${Math.min(index, 4)})`,
              borderBottom: index === hierarchyGuidance.length - 1 ? 'none' : s.hierarchyRow.borderBottom,
            }}
          >
            <div>
              <p className="text--label-xs" style={{ margin: '0 0 var(--space-4xs)', color: 'var(--neutral-60)', textTransform: 'uppercase' }}>
                {entry.context}
              </p>
              <code style={s.codeLabel}>.{entry.className}</code>
            </div>
            <div>
              <p className={entry.className} style={{ margin: 0 }}>
                {entry.text}
              </p>
              <p className="text--body-xs" style={{ margin: 'var(--space-4xs) 0 0', color: 'var(--neutral-60)' }}>
                {entry.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)', padding: 'var(--space-m)', marginBottom: 'var(--space-xl)' }}>
        <p className="text--label-s" style={{ margin: '0 0 var(--space-xs)', color: 'var(--neutral-80)' }}>
          Operational UI pattern
        </p>
        <p className="text--body-s" style={{ margin: 0, color: 'var(--neutral-60)' }}>
          A practical dashboard stack is <code style={{ fontFamily: 'monospace' }}>heading-l</code> page title, <code style={{ fontFamily: 'monospace' }}>title-l</code> section titles, <code style={{ fontFamily: 'monospace' }}>title-s</code> card titles, <code style={{ fontFamily: 'monospace' }}>label-s/m</code> item labels, <code style={{ fontFamily: 'monospace' }}>text-s/xs</code> supporting copy, and <code style={{ fontFamily: 'monospace' }}>mono-s/xs</code> commands or paths.
        </p>
      </div>

      <hr style={s.divider} />

      {/* Type Classes */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Type Classes</h2>
      <p className="text--body-m" style={s.description}>
        Apply semantic typography with <code style={{ fontFamily: 'monospace' }}>.text--&#123;category&#125;-&#123;size&#125;</code> classes.
        These set font-family, font-size, font-weight, line-height, and letter-spacing together.
      </p>

      {typeClasses.map(({ category, sizes }) => (
        <div key={category} style={{ marginBottom: 'var(--space-2xl)' }}>
          <p className="text--label-xs" style={{ color: 'var(--neutral-50)', marginBottom: 'var(--space-s)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {category}
          </p>
          {sizes.map((size) => (
            <div key={size} style={s.sampleRow}>
              <code style={s.sampleLabelWide}>
                .text--{size}
              </code>
              <span className={`text--${size}`} style={s.sampleText}>{sampleText}</span>
            </div>
          ))}
        </div>
      ))}

      <hr style={s.divider} />

      {/* Expressive */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Expressive Modifier</h2>
      <p className="text--body-m" style={s.description}>
        The <code style={{ fontFamily: 'monospace' }}>.text--expressive</code> modifier applies a serif font to display, heading, and title classes.
        Combine it with any display/heading/title class.
      </p>

      {['display-l', 'display-m', 'heading-l', 'heading-m', 'title-l', 'title-m'].map((cls) => (
        <div key={cls} style={{ marginBottom: 'var(--space-l)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-m)' }}>
          <p className="text--label-xs" style={{ color: 'var(--neutral-50)', marginBottom: 'var(--space-xs)' }}>
            .text--{cls} + .text--expressive
          </p>
          <span className={`text--${cls} text--expressive`} style={{ ...s.sampleText, display: 'block' }}>{sampleText}</span>
        </div>
      ))}

      <hr style={s.divider} />

      {/* Alignment */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Text Alignment</h2>
      <p className="text--body-m" style={s.description}>
        Alignment utilities have responsive variants: append <code style={{ fontFamily: 'monospace' }}>-xl</code>, <code style={{ fontFamily: 'monospace' }}>-l</code>, <code style={{ fontFamily: 'monospace' }}>-m</code>, or <code style={{ fontFamily: 'monospace' }}>-s</code>.
      </p>
      {(['left', 'center', 'right', 'justify'] as const).map((align) => (
        <div key={align} style={{ marginBottom: 'var(--space-m)', padding: 'var(--space-m)', background: 'var(--neutral-12)', borderRadius: 'var(--radius-l)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', display: 'block', marginBottom: '8px' }}>
            .text--{align}
          </code>
          <p className={`text--body-m text--${align}`}>{sampleLong}</p>
        </div>
      ))}

      <hr style={s.divider} />

      {/* Weight */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Font Weight</h2>
      <p className="text--body-m" style={s.description}>
        No responsive variants. Use <code style={{ fontFamily: 'monospace' }}>.text--bold</code> for semantic bold.
      </p>
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
        <div key={w} style={s.sampleRow}>
          <code style={s.sampleLabel}>
            .text--{w}
          </code>
          <span className={`text--body-m text--${w}`} style={s.sampleText}>{sampleText}</span>
        </div>
      ))}
      <div style={{ ...s.sampleRow, borderBottom: 'none' }}>
        <code style={s.sampleLabel}>
          .text--bold
        </code>
        <span className="text--body-m text--bold" style={s.sampleText}>{sampleText}</span>
      </div>

      <hr style={s.divider} />

      {/* Transform & Decoration */}
      <h2 className="text--heading-s" style={s.sectionTitle}>Transform & Decoration</h2>
      <p className="text--body-m" style={{ ...s.description, marginBottom: 'var(--space-xl)' }}>
        No responsive variants for transform, style, or decoration utilities.
      </p>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Transform</h3>
      {(['uppercase', 'lowercase', 'capitalize'] as const).map((cls) => (
        <div key={cls} style={s.sampleRowCenter}>
          <code style={s.sampleLabelWide}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`} style={s.sampleText}>{sampleText}</span>
        </div>
      ))}

      <hr style={s.divider} />
      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Decoration</h3>
      {(['underline', 'line-through', 'overline', 'underline-wavy', 'underline-dotted', 'underline-dashed', 'decoration-none'] as const).map((cls) => (
        <div key={cls} style={s.sampleRowCenter}>
          <code style={s.sampleLabelXWide}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`} style={s.sampleText}>{sampleText}</span>
        </div>
      ))}

      <hr style={s.divider} />
      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Wrapping</h3>
      {(['pretty', 'balance', 'nowrap'] as const).map((cls) => (
        <div key={cls} style={s.sampleRowCenter}>
          <code style={s.sampleLabelWide}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`} style={s.wrappingSample}>{sampleLong}</span>
        </div>
      ))}
    </div>
  );
}
