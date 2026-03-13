import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: 'var(--space-2xl)', maxWidth: '960px', margin: '0 auto', color: 'var(--neutral-80)' },
  sectionTitle: { marginBottom: 'var(--space-xs)', marginTop: 'var(--space-2xl)' },
  description: { color: 'var(--neutral-60)', marginBottom: 'var(--space-l)' },
  divider: { border: 'none', borderTop: '1px solid var(--neutral-16)', margin: 'var(--space-xl) 0' },
};

const sampleText = 'The quick brown fox jumps over the lazy dog';
const sampleLong = 'Typography is the art of arranging type to make written language legible, readable, and appealing.';

// ─── Stories ──────────────────────────────────────────────────────────────────

export const TypeScale: Story = {
  name: 'Type Scale',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Font Size Scale</h2>
      <p className="text--body-m" style={s.description}>
        12 fluid font-size tokens. All scale with viewport via <code style={{ fontFamily: 'monospace' }}>clamp()</code>.
        Use these tokens in component CSS: <code style={{ fontFamily: 'monospace' }}>font-size: var(--text-m)</code>.
      </p>

      {fontSizeTokens.map(({ token, label }) => (
        <div
          key={token}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-m)',
            marginBottom: 'var(--space-xs)',
            borderBottom: '1px solid var(--neutral-14)',
            paddingBottom: 'var(--space-2xs)',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--neutral-50)',
              minWidth: '120px',
              flexShrink: 0,
            }}
          >
            {token}
          </span>
          <span style={{ fontSize: `var(${token})`, color: 'var(--neutral-80)', lineHeight: 1.3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {sampleText}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const TypeClasses: Story = {
  name: 'Type Classes',
  render: () => (
    <div style={s.page}>
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
            <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' }}>
              <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '140px', flexShrink: 0 }}>
                .text--{size}
              </code>
              <span className={`text--${size}`}>{sampleText}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Expressive: Story = {
  name: 'Expressive Modifier',
  render: () => (
    <div style={s.page}>
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
          <span className={`text--${cls} text--expressive`}>{sampleText}</span>
        </div>
      ))}
    </div>
  ),
};

export const TextUtilitiesAlignment: Story = {
  name: 'Alignment',
  render: () => (
    <div style={s.page}>
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
    </div>
  ),
};

export const TextUtilitiesWeight: Story = {
  name: 'Weight',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Font Weight</h2>
      <p className="text--body-m" style={s.description}>
        No responsive variants. Use <code style={{ fontFamily: 'monospace' }}>.text--bold</code> for semantic bold.
      </p>
      {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
        <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '120px', flexShrink: 0 }}>
            .text--{w}
          </code>
          <span className={`text--body-m text--${w}`}>{sampleText}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)' }}>
        <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '120px', flexShrink: 0 }}>
          .text--bold
        </code>
        <span className="text--body-m text--bold">{sampleText}</span>
      </div>
    </div>
  ),
};

export const TextUtilitiesDecoration: Story = {
  name: 'Transform & Decoration',
  render: () => (
    <div style={s.page}>
      <h2 className="text--heading-s" style={s.sectionTitle}>Transform & Decoration</h2>
      <p className="text--body-m" style={{ ...s.description, marginBottom: 'var(--space-xl)' }}>
        No responsive variants for transform, style, or decoration utilities.
      </p>

      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Transform</h3>
      {(['uppercase', 'lowercase', 'capitalize'] as const).map((cls) => (
        <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '140px', flexShrink: 0 }}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`}>{sampleText}</span>
        </div>
      ))}

      <hr style={s.divider} />
      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Decoration</h3>
      {(['underline', 'line-through', 'overline', 'underline-wavy', 'underline-dotted', 'underline-dashed', 'decoration-none'] as const).map((cls) => (
        <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '180px', flexShrink: 0 }}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`}>{sampleText}</span>
        </div>
      ))}

      <hr style={s.divider} />
      <h3 className="text--title-m" style={{ marginBottom: 'var(--space-m)' }}>Wrapping</h3>
      {(['pretty', 'balance', 'nowrap'] as const).map((cls) => (
        <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)', marginBottom: 'var(--space-xs)', borderBottom: '1px solid var(--neutral-14)', paddingBottom: 'var(--space-2xs)' }}>
          <code style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--neutral-50)', minWidth: '140px', flexShrink: 0 }}>.text--{cls}</code>
          <span className={`text--body-m text--${cls}`} style={{ maxWidth: '280px', overflow: 'hidden' }}>{sampleLong}</span>
        </div>
      ))}
    </div>
  ),
};
