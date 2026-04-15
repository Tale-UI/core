import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderNav } from '@tale-ui/react/header-nav';

type Args = Record<string, never>;

const meta: Meta<Args> = {
  title: 'Components/HeaderNav',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: () => (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
      <HeaderNav.Secondary>
        <HeaderNav.NavButton href="/features" current>Features</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
        <HeaderNav.NavButton href="/docs">Docs</HeaderNav.NavButton>
      </HeaderNav.Secondary>
      <HeaderNav.Actions>
        <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
        <a href="/signup" className="tale-button tale-button--primary tale-button--md">Sign up</a>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  ),
};

export const LogoOnly: Story = {
  render: () => (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
      <HeaderNav.Actions>
        <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  ),
};

export const WithActionsOnly: Story = {
  render: () => (
    <HeaderNav.Root>
      <HeaderNav.Logo href="/">Brand</HeaderNav.Logo>
      <HeaderNav.Actions>
        <a href="/login" className="tale-button tale-button--ghost tale-button--md">Log in</a>
        <a href="/signup" className="tale-button tale-button--primary tale-button--md">Get started</a>
      </HeaderNav.Actions>
    </HeaderNav.Root>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
        <div>
          <span className="story-label" style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Default</span>
          <HeaderNav.Root>
            <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
            <HeaderNav.Secondary>
              <HeaderNav.NavButton href="/features" current>Features</HeaderNav.NavButton>
              <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
            </HeaderNav.Secondary>
            <HeaderNav.Actions>
              <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
              <a href="/signup" className="tale-button tale-button--primary tale-button--md">Sign up</a>
            </HeaderNav.Actions>
          </HeaderNav.Root>
        </div>
        <div>
          <span className="story-label" style={{ display: 'block', marginBottom: 'var(--space-2xs)' }}>Logo only</span>
          <HeaderNav.Root>
            <HeaderNav.Logo href="/">Brand</HeaderNav.Logo>
            <HeaderNav.Actions>
              <a href="/login" className="tale-button tale-button--neutral tale-button--md">Log in</a>
            </HeaderNav.Actions>
          </HeaderNav.Root>
        </div>
      </div>
    );
  },
};
