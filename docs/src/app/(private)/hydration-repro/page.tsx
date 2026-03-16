'use client';

import { ScrollArea } from '@tale-ui/react/scroll-area';
import { Tabs } from '@tale-ui/react/tabs';

const VIEWPORT_SIZE = 200;
const SCROLLABLE_CONTENT_SIZE = 1000;

export default function Page() {
  return (
    <div style={{ padding: 24 }}>
      <Tabs.Root defaultSelectedKey="scrollable">
        <Tabs.List style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Tabs.Tab id="scrollable">Scrollable</Tabs.Tab>
          <Tabs.Tab id="other">Other</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="scrollable">
          <ScrollArea.Root style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}>
            <ScrollArea.Viewport style={{ width: '100%', height: '100%' }}>
              <ScrollArea.Content>
                <div style={{ width: SCROLLABLE_CONTENT_SIZE, height: SCROLLABLE_CONTENT_SIZE }} />
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar orientation="horizontal">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Tabs.Panel>

        <Tabs.Panel id="other">
          <div>Other panel</div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
