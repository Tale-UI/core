import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction/Welcome',
  parameters: { layout: 'fullscreen', backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

/** Navigate the Storybook manager to a story by its title. */
function goTo(storyTitle: string) {
  const id = storyTitle
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');
  window.parent.location.href = `?path=/story/${id}`;
}

const s: Record<string, React.CSSProperties> = {
  page: {
    padding: 'var(--space-2xl)',
    maxWidth: '800px',
    margin: '0 auto',
    color: 'var(--neutral-80)',
  },
  hero: {
    paddingTop: 'var(--space-4xl)',
    paddingBottom: 'var(--space-2xl)',
    borderBottom: '1px solid var(--neutral-16)',
    marginBottom: 'var(--space-2xl)',
  },
  badge: {
    display: 'inline-block',
    background: 'var(--color-12)',
    color: 'var(--color-70)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--label-xs-font-size)',
    fontWeight: 'var(--label-font-weight)',
    marginBottom: 'var(--space-m)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tagline: {
    color: 'var(--neutral-50)',
    marginTop: 'var(--space-s)',
    marginBottom: 0,
  },
  section: {
    marginBottom: 'var(--space-2xl)',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 'var(--space-s)',
  },
  body: {
    color: 'var(--neutral-60)',
    lineHeight: 1.7,
    marginBottom: 'var(--space-m)',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-m)',
  },
  featureItem: {
    display: 'flex',
    gap: 'var(--space-m)',
    alignItems: 'flex-start',
  },
  featureDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--color-60)',
    marginTop: '7px',
    flexShrink: 0,
  },
  featureLabel: {
    fontWeight: 'var(--label-font-weight)',
    color: 'var(--neutral-80)',
  },
  featureDesc: {
    color: 'var(--neutral-55)',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--neutral-14)',
    margin: 'var(--space-2xl) 0',
  },
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-m)',
    marginTop: 'var(--space-m)',
  },
  quickLinkCard: {
    background: 'var(--neutral-10)',
    border: '1px solid var(--neutral-16)',
    borderRadius: 'var(--radius-l)',
    padding: 'var(--space-s) var(--space-m)',
    cursor: 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  quickLinkTitle: {
    fontWeight: 'var(--label-font-weight)',
    color: 'var(--neutral-80)',
    marginBottom: '4px',
  },
  quickLinkDesc: {
    color: 'var(--neutral-50)',
    fontSize: 'var(--label-xs-font-size)',
  },
  closing: {
    marginTop: 'var(--space-3xl)',
    paddingTop: 'var(--space-l)',
    borderTop: '1px solid var(--neutral-14)',
    color: 'var(--neutral-40)',
    fontStyle: 'italic',
  },
};

export const WelcomePage: Story = {
  name: 'Welcome',
  render: () => {
    const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

    const quickLinks = [
      {
        id: 'getting-started',
        title: 'Getting Started',
        desc: 'Install and set up Tale in your project',
        storyTitle: 'Introduction/Getting Started',
      },
      {
        id: 'foundations',
        title: 'Foundations',
        desc: 'Tokens, typography, color, and spacing',
        storyTitle: 'Foundations/Colors',
      },
      {
        id: 'components',
        title: 'Components',
        desc: 'The full library, documented and interactive',
        storyTitle: 'Components/Button',
      },
    ];

    return (
      <div style={s.page}>
        {/* Hero */}
        <div style={s.hero}>
          <h1 className="text--display-m text--expressive" style={{ margin: '0 0 var(--space-s)' }}>
            Your product has a story to tell.
          </h1>
          <p className="text--body-l" style={s.tagline}>
            Tale gives you the tools to tell it well.
          </p>
        </div>

        {/* What is Tale */}
        <div style={s.section}>
          <h2 className="text--heading-s" style={s.sectionTitle}>What is Tale?</h2>
          <p className="text--body-m" style={s.body}>
            Tale (@tale-ui) is an agentic, themeable design system built for crafting exceptional
            digital experiences — from first interaction to final screen.
          </p>
          <p className="text--body-m" style={s.body}>
            It is more than a component library. It&apos;s a design language and development
            toolkit that grows with your product. Every token, component, and pattern is built to
            be consistent, expressive, and deeply customisable — so your team can focus on the
            experience, not the plumbing.
          </p>
        </div>

        {/* What makes Tale different */}
        <div style={s.section}>
          <h2 className="text--heading-s" style={s.sectionTitle}>What makes Tale different?</h2>
          <ul style={s.featureList}>
            <li style={s.featureItem}>
              <div style={s.featureDot} />
              <div>
                <span className="text--label-m" style={s.featureLabel}>Agentic</span>
                <span className="text--body-m" style={s.featureDesc}>
                  {' '}— Tale is designed to work within modern, automated workflows. Components
                  are built to be composable and integration-friendly from the ground up.
                </span>
              </div>
            </li>
            <li style={s.featureItem}>
              <div style={s.featureDot} />
              <div>
                <span className="text--label-m" style={s.featureLabel}>Themeable to the core</span>
                <span className="text--body-m" style={s.featureDesc}>
                  {' '}— Deep token-based theming means your brand lives in every layer. Swap a
                  theme, change the story.
                </span>
              </div>
            </li>
            <li style={s.featureItem}>
              <div style={s.featureDot} />
              <div>
                <span className="text--label-m" style={s.featureLabel}>Crafted for journeys</span>
                <span className="text--body-m" style={s.featureDesc}>
                  {' '}— Every component is considered as part of a larger experience. Good design
                  systems don&apos;t just ship buttons — they help you build flows that users
                  remember.
                </span>
              </div>
            </li>
          </ul>
        </div>

        <hr style={s.divider} />

        {/* Getting started quick links */}
        <div style={s.section}>
          <h2 className="text--heading-s" style={s.sectionTitle}>Getting Started</h2>
          <p className="text--body-m" style={s.body}>
            Browse components using the sidebar, or jump straight into:
          </p>
          <div style={s.quickLinksGrid}>
            {quickLinks.map((link) => (
              <div
                key={link.id}
                style={{
                  ...s.quickLinkCard,
                  background: hoveredCard === link.id ? 'var(--neutral-14)' : 'var(--neutral-10)',
                  borderColor: hoveredCard === link.id ? 'var(--neutral-22)' : 'var(--neutral-16)',
                }}
                onClick={() => goTo(link.storyTitle)}
                onMouseEnter={() => setHoveredCard(link.id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') goTo(link.storyTitle); }}
              >
                <div className="text--label-m" style={s.quickLinkTitle}>{link.title} →</div>
                <div style={s.quickLinkDesc}>{link.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <p className="text--body-m" style={s.closing}>
          Tale — write epic experiences.
        </p>
      </div>
    );
  },
};
