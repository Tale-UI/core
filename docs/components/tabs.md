# Tabs

`import { Tabs } from '@tale-ui/react/tabs';`

A tabbed interface for switching between panels of content.

## Parts

| Part | Description |
|------|-------------|
| `Tabs.Root` | Wrapper managing tab selection and orientation |
| `Tabs.List` | Container for the tab buttons |
| `Tabs.Tab` | Individual tab button |
| `Tabs.Panel` | Content area associated with a tab (matched by `id`) |
| `Tabs.Indicator` | Animated bar that slides to the selected tab. Place inside `Tabs.List`. |

## Props

Accepts all React Aria `Tabs` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### `Tabs.List`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md'` | `'md'` | Size variant for all tabs in the list |
| `variant` | `'underline' \| 'pills' \| 'enclosed'` | `'underline'` | Visual style of the tab list |

## Basic Usage

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List>
    <Tabs.Tab id="tab1">Account</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1">
    <p>Manage your account details and preferences.</p>
  </Tabs.Panel>
  <Tabs.Panel id="tab2">
    <p>Configure application settings and behavior.</p>
  </Tabs.Panel>
  <Tabs.Panel id="tab3">
    <p>Control how and when you receive notifications.</p>
  </Tabs.Panel>
</Tabs.Root>
```

## Examples

### Vertical

```tsx
<Tabs.Root defaultSelectedKey="tab1" orientation="vertical">
  <div style={{ display: 'flex', gap: 'var(--space-m)' }}>
    <Tabs.List>
      <Tabs.Tab id="tab1">General</Tabs.Tab>
      <Tabs.Tab id="tab2">Security</Tabs.Tab>
      <Tabs.Tab id="tab3">Privacy</Tabs.Tab>
      <Tabs.Indicator />
    </Tabs.List>
    <div>
      <Tabs.Panel id="tab1"><p>General settings.</p></Tabs.Panel>
      <Tabs.Panel id="tab2"><p>Security options.</p></Tabs.Panel>
      <Tabs.Panel id="tab3"><p>Privacy preferences.</p></Tabs.Panel>
    </div>
  </div>
</Tabs.Root>
```

### With Disabled Tab

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List>
    <Tabs.Tab id="tab1">Active</Tabs.Tab>
    <Tabs.Tab id="tab2" isDisabled>Disabled</Tabs.Tab>
    <Tabs.Tab id="tab3">Also Active</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>This tab is selectable.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>This tab is also selectable.</p></Tabs.Panel>
</Tabs.Root>
```

### Small Tabs

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List size="sm">
    <Tabs.Tab id="tab1">Account</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>Account details.</p></Tabs.Panel>
  <Tabs.Panel id="tab2"><p>App settings.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>Notification preferences.</p></Tabs.Panel>
</Tabs.Root>
```

### Variants

The `variant` prop on `Tabs.List` controls the visual style of the tab strip.

#### Underline (default)

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List variant="underline">
    <Tabs.Tab id="tab1">Account</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>Account details.</p></Tabs.Panel>
  <Tabs.Panel id="tab2"><p>App settings.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>Notification preferences.</p></Tabs.Panel>
</Tabs.Root>
```

#### Pills

Rounded pill background on the selected tab. The indicator becomes a full-height pill.

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List variant="pills">
    <Tabs.Tab id="tab1">Account</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>Account details.</p></Tabs.Panel>
  <Tabs.Panel id="tab2"><p>App settings.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>Notification preferences.</p></Tabs.Panel>
</Tabs.Root>
```

#### Enclosed

Bordered tabs where the selected tab connects visually to the content panel. The indicator is hidden.

```tsx
<Tabs.Root defaultSelectedKey="tab1">
  <Tabs.List variant="enclosed">
    <Tabs.Tab id="tab1">Account</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>Account details.</p></Tabs.Panel>
  <Tabs.Panel id="tab2"><p>App settings.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>Notification preferences.</p></Tabs.Panel>
</Tabs.Root>
```

### Controlled

```tsx
const [selectedKey, setSelectedKey] = useState<string>('tab1');

<Tabs.Root selectedKey={selectedKey} onSelectionChange={(key) => setSelectedKey(String(key))}>
  <Tabs.List>
    <Tabs.Tab id="tab1">First</Tabs.Tab>
    <Tabs.Tab id="tab2">Second</Tabs.Tab>
    <Tabs.Tab id="tab3">Third</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel id="tab1"><p>First tab content.</p></Tabs.Panel>
  <Tabs.Panel id="tab2"><p>Second tab content.</p></Tabs.Panel>
  <Tabs.Panel id="tab3"><p>Third tab content.</p></Tabs.Panel>
</Tabs.Root>
```

## CSS Classes

- `.tale-tabs` — Root container
- `.tale-tabs__list` — Tab button strip
- `.tale-tabs__list-inner` — Inner flex wrapper for tab buttons (supports vertical orientation)
- `.tale-tabs__tab` — Individual tab button
- `.tale-tabs__tab--sm` — Small size variant
- `.tale-tabs__tab--pills` — Pills variant applied to individual tab
- `.tale-tabs__tab--enclosed` — Enclosed variant applied to individual tab
- `.tale-tabs__list--pills` — Pills variant on the tab list
- `.tale-tabs__list--enclosed` — Enclosed variant on the tab list
- `.tale-tabs__panel` — Content panel
- `.tale-tabs__indicator` — Sliding indicator bar

## Notes

- Built on React Aria `Tabs`, `TabList`, `Tab`, and `TabPanel`.
- Supports `orientation="horizontal"` (default) and `orientation="vertical"`.
- Individual tabs can be disabled with `isDisabled` on `Tabs.Tab`.
- **Place `Tabs.Indicator` as the last child inside `Tabs.List`.** It automatically tracks the selected tab and animates to it. `Tabs.List` separates it from the React Aria collection so it renders correctly alongside the tabs.
- The indicator uses a `MutationObserver` to detect tab selection changes and a `ResizeObserver` for layout shifts. The sliding animation is CSS (`transition: left 0.25s ease, width 0.25s ease`).
