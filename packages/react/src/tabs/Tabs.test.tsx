import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { beforeAll } from 'vitest';
import { Tabs } from '@tale-ui/react/tabs';
import { createRenderer } from '#test-utils';

// jsdom lacks ResizeObserver — provide a no-op stub
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof globalThis.ResizeObserver;
  }
});

describe('<Tabs />', () => {
  const { render } = createRenderer();

  describe('Tabs.Root', () => {
    it('renders with the tale-tabs class', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="a">A</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
        </Tabs.Root>,
      );
      expect(screen.getByTestId('tabs')).to.have.class('tale-tabs');
    });

    it('merges additional className', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a" className="custom" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="a">A</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
        </Tabs.Root>,
      );
      expect(screen.getByTestId('tabs')).to.have.class('tale-tabs');
      expect(screen.getByTestId('tabs')).to.have.class('custom');
    });
  });

  describe('Tabs.Tab', () => {
    it('renders tabs with the tale-tabs__tab class', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
            <Tabs.Tab id="b">Tab B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
          <Tabs.Panel id="b">Panel B</Tabs.Panel>
        </Tabs.Root>,
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs).to.have.length(2);
      expect(tabs[0]).to.have.class('tale-tabs__tab');
    });

    it('marks the selected tab with data-selected', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
            <Tabs.Tab id="b">Tab B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
          <Tabs.Panel id="b">Panel B</Tabs.Panel>
        </Tabs.Root>,
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).to.have.attribute('data-selected');
      expect(tabs[1]).not.to.have.attribute('data-selected');
    });

    it('switches tabs on click', async () => {
      const { user } = await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
            <Tabs.Tab id="b">Tab B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
          <Tabs.Panel id="b">Panel B</Tabs.Panel>
        </Tabs.Root>,
      );
      await user.click(screen.getByText('Tab B'));
      expect(screen.getAllByRole('tab')[1]).to.have.attribute('data-selected');
      expect(screen.getByRole('tabpanel')).to.have.text('Panel B');
    });
  });

  describe('Tabs.Indicator', () => {
    it('renders a span with tale-tabs__indicator class', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
            <Tabs.Indicator data-testid="indicator" />
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
        </Tabs.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.tagName).to.equal('SPAN');
      expect(indicator).to.have.class('tale-tabs__indicator');
      expect(indicator).to.have.attribute('role', 'presentation');
    });

    it('renders indicator as a sibling of the tab list inner', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
            <Tabs.Indicator data-testid="indicator" />
          </Tabs.List>
          <Tabs.Panel id="a">Panel A</Tabs.Panel>
        </Tabs.Root>,
      );
      const indicator = screen.getByTestId('indicator');
      // When indicator is present, List wraps in a wrapper div with tale-tabs__list
      // and indicator is a sibling of the tale-tabs__list-inner TabList
      const wrapper = indicator.parentElement!;
      expect(wrapper).to.have.class('tale-tabs__list');
      expect(wrapper.querySelector('.tale-tabs__list-inner')).to.exist;
    });
  });

  describe('Tabs.Panel', () => {
    it('renders with the tale-tabs__panel class', async () => {
      await render(
        <Tabs.Root defaultSelectedKey="a">
          <Tabs.List>
            <Tabs.Tab id="a">Tab A</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="a">Content</Tabs.Panel>
        </Tabs.Root>,
      );
      expect(screen.getByRole('tabpanel')).to.have.class('tale-tabs__panel');
    });
  });
});
