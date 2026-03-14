import * as React from 'react';
import '@tale-ui/react-styles/index.css';

// Simple components
import { Button } from '@tale-ui/react/button';
import { Input } from '@tale-ui/react/input';
import { Toggle } from '@tale-ui/react/toggle';
import { Separator } from '@tale-ui/react/separator';

// Compound components
import { Checkbox } from '@tale-ui/react/checkbox';
import { Radio } from '@tale-ui/react/radio';
import { Switch } from '@tale-ui/react/switch';
import { Select } from '@tale-ui/react/select';
import { Combobox } from '@tale-ui/react/combobox';
import { NumberField } from '@tale-ui/react/number-field';
import { Slider } from '@tale-ui/react/slider';
import { Calendar } from '@tale-ui/react/calendar';
import { TemporalAdapterProvider } from '@tale-ui/react/temporal-adapter-provider';
import { TemporalAdapterDateFns } from '@tale-ui/react/temporal-adapter-date-fns';

// Overlay
import { Dialog } from '@tale-ui/react/dialog';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Popover } from '@tale-ui/react/popover';
import { DrawerPreview as Drawer } from '@tale-ui/react/drawer';
import { Tooltip } from '@tale-ui/react/tooltip';

// Navigation
import { Menu } from '@tale-ui/react/menu';

// Layout
import { Accordion } from '@tale-ui/react/accordion';
import { Collapsible } from '@tale-ui/react/collapsible';
import { Tabs } from '@tale-ui/react/tabs';
import { ScrollArea } from '@tale-ui/react/scroll-area';

// Feedback
import { Progress } from '@tale-ui/react/progress';
import { Meter } from '@tale-ui/react/meter';
import { Toast } from '@tale-ui/react/toast';

// Display
import { Avatar } from '@tale-ui/react/avatar';

// Form
import { Field } from '@tale-ui/react/field';

// Other
import { Toolbar } from '@tale-ui/react/toolbar';

// ---------------------------------------------------------------------------
// Shared icons
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

function CheckIcon14() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
      <polyline points="2,7 5.5,10.5 12,3.5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="6" x2="10" y2="6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
      <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  );
}

function XIconSm() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
      <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

const sectionStyle: React.CSSProperties = {
  padding: '3.2rem 0',
  borderBottom: '1px solid var(--neutral-20)',
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: 600,
  fontFamily: 'var(--label-font-family)',
  color: 'var(--neutral-90)',
};

const classListStyle: React.CSSProperties = {
  margin: '0.8rem 0 2rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
};

const classTagStyle: React.CSSProperties = {
  padding: '0.2rem 0.6rem',
  background: 'var(--neutral-14)',
  borderRadius: '0.4rem',
  fontFamily: 'var(--mono-font-family)',
  fontSize: '1.1rem',
  color: 'var(--neutral-70)',
};

const subHeadingStyle: React.CSSProperties = {
  margin: '0 0 1.2rem',
  fontSize: '1.2rem',
  fontWeight: 500,
  fontFamily: 'var(--label-font-family)',
  color: 'var(--neutral-60)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.2rem',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: '2rem',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--label-font-family)',
  fontSize: 'var(--label-m-font-size)',
  color: 'var(--neutral-80)',
};

function Section({ id, title, classes, children }: { id: string; title: string; classes: string[]; children: React.ReactNode }) {
  return (
    <section id={id} style={sectionStyle}>
      <h2 style={headingStyle}>{title}</h2>
      <div style={classListStyle}>
        {classes.map((c) => <code key={c} style={classTagStyle}>.{c}</code>)}
      </div>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={subHeadingStyle}>{children}</h3>;
}

function Row({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...rowStyle, ...style }}>{children}</div>;
}

// ---------------------------------------------------------------------------
// TOC data
// ---------------------------------------------------------------------------

const TOC = [
  { category: 'Form Controls', items: [
    { id: 'button', label: 'Button' },
    { id: 'input', label: 'Input' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'radio', label: 'Radio' },
    { id: 'switch', label: 'Switch' },
    { id: 'toggle', label: 'Toggle' },
    { id: 'select', label: 'Select' },
    { id: 'combobox', label: 'Combobox' },
    { id: 'number-field', label: 'NumberField' },
    { id: 'slider', label: 'Slider' },
    { id: 'calendar', label: 'Calendar' },
  ]},
  { category: 'Overlay', items: [
    { id: 'dialog', label: 'Dialog' },
    { id: 'alert-dialog', label: 'AlertDialog' },
    { id: 'popover', label: 'Popover' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'tooltip', label: 'Tooltip' },
  ]},
  { category: 'Navigation', items: [
    { id: 'menu', label: 'Menu' },
  ]},
  { category: 'Layout', items: [
    { id: 'accordion', label: 'Accordion' },
    { id: 'collapsible', label: 'Collapsible' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'scroll-area', label: 'ScrollArea' },
    { id: 'separator', label: 'Separator' },
  ]},
  { category: 'Feedback', items: [
    { id: 'progress', label: 'Progress' },
    { id: 'meter', label: 'Meter' },
    { id: 'toast', label: 'Toast' },
  ]},
  { category: 'Display', items: [
    { id: 'avatar', label: 'Avatar' },
  ]},
  { category: 'Form Structure', items: [
    { id: 'field', label: 'Field' },
  ]},
  { category: 'Other', items: [
    { id: 'toolbar', label: 'Toolbar' },
  ]},
];

const tocCategoryStyle: React.CSSProperties = {
  margin: '1.2rem 0 0.4rem',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'var(--label-font-family)',
  color: 'var(--neutral-50)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const tocLinkStyle: React.CSSProperties = {
  display: 'block',
  padding: '0.2rem 0',
  fontSize: '1.2rem',
  fontFamily: 'var(--label-font-family)',
  color: 'var(--neutral-70)',
  textDecoration: 'none',
};

// ---------------------------------------------------------------------------
// Calendar adapter (singleton)
// ---------------------------------------------------------------------------

const calendarAdapter = new TemporalAdapterDateFns();

// ---------------------------------------------------------------------------
// Calendar section (needs TemporalAdapterProvider)
// ---------------------------------------------------------------------------

function CalendarInner() {
  const context = Calendar.useContext();
  const getWeekList = Calendar.useWeekList();
  const getDayList = Calendar.useDayList();

  const weeks = getWeekList({ date: context.visibleDate, amount: 'end-of-month' });
  const dayNames = getDayList({ date: context.visibleDate, amount: 7 });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
        <Calendar.DecrementMonth aria-label="Previous month">‹</Calendar.DecrementMonth>
        <span style={{ fontFamily: 'var(--label-font-family)', fontWeight: 600, fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-80)' }}>
          {calendarAdapter.formatByString(context.visibleDate, 'MMMM yyyy')}
        </span>
        <Calendar.IncrementMonth aria-label="Next month">›</Calendar.IncrementMonth>
      </div>
      <Calendar.DayGrid>
        <Calendar.DayGridHeader>
          <Calendar.DayGridHeaderRow>
            {dayNames.map((day, i) => (
              <Calendar.DayGridHeaderCell key={i} value={day} />
            ))}
          </Calendar.DayGridHeaderRow>
        </Calendar.DayGridHeader>
        <Calendar.DayGridBody>
          {weeks.map((week, wi) => (
            <Calendar.DayGridRow key={wi} value={week}>
              {(day, di) => (
                <Calendar.DayGridCell key={di} value={day}>
                  <Calendar.DayButton />
                </Calendar.DayGridCell>
              )}
            </Calendar.DayGridRow>
          ))}
        </Calendar.DayGridBody>
      </Calendar.DayGrid>
    </>
  );
}

function CalendarBody() {
  const [value, setValue] = React.useState<Date | null>(null);
  return (
    <Calendar.Root value={value} onValueChange={setValue}>
      <CalendarInner />
    </Calendar.Root>
  );
}

function CalendarSection() {
  return (
    <TemporalAdapterProvider adapter={calendarAdapter}>
      <Section
        id="calendar"
        title="Calendar"
        classes={['tale-calendar', 'tale-calendar__viewport', 'tale-calendar__day-grid', 'tale-calendar__day-button', 'tale-calendar__increment-month', 'tale-calendar__decrement-month']}
      >
        <SubHeading>Interactive</SubHeading>
        <CalendarBody />
      </Section>
    </TemporalAdapterProvider>
  );
}

// ---------------------------------------------------------------------------
// Combobox section (needs state)
// ---------------------------------------------------------------------------

const countries = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece'];

function ComboboxDemo() {
  const [value, setValue] = React.useState<string | null>(null);
  const [items, setItems] = React.useState(countries);
  return (
    <div style={{ width: '28rem' }}>
      <Combobox.Root
        value={value}
        onValueChange={setValue}
        onInputValueChange={(val) => {
          setItems(countries.filter((c) => c.toLowerCase().includes(val.toLowerCase())));
        }}
      >
        <Combobox.Input placeholder="Search country…" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup>
              <Combobox.List>
                {items.length === 0 ? (
                  <Combobox.Empty>No results</Combobox.Empty>
                ) : (
                  items.map((c) => (
                    <Combobox.Item key={c} value={c}>{c}</Combobox.Item>
                  ))
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast section (needs provider)
// ---------------------------------------------------------------------------

function ToastStack() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Viewport>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Content>
            <Toast.Title>{toast.title}</Toast.Title>
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
          </Toast.Content>
          <Toast.Close aria-label="Close"><XIconSm /></Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

function ToastTriggers() {
  const { add } = Toast.useToastManager();
  return (
    <Row>
      {([
        { label: 'Default', type: undefined, variant: 'neutral' as const },
        { label: 'Success', type: 'success', variant: 'primary' as const },
        { label: 'Error', type: 'error', variant: 'danger' as const },
        { label: 'Warning', type: 'warning', variant: 'neutral' as const },
      ]).map(({ label, type, variant }) => (
        <Button
          key={label}
          variant={variant}
          onClick={() => add({ title: `${label} toast`, description: 'This is a toast notification.', type })}
        >
          {label}
        </Button>
      ))}
    </Row>
  );
}

function ToastSection() {
  return (
    <Toast.Provider timeout={4000} limit={3}>
      <Section
        id="toast"
        title="Toast"
        classes={['tale-toast__positioner', 'tale-toast__root', 'tale-toast__content', 'tale-toast__title', 'tale-toast__description', 'tale-toast__close']}
      >
        <SubHeading>Trigger toasts</SubHeading>
        <ToastTriggers />
        <ToastStack />
      </Section>
    </Toast.Provider>
  );
}

// ---------------------------------------------------------------------------
// Menu with checkbox items (needs state)
// ---------------------------------------------------------------------------

function MenuCheckboxDemo() {
  const [checked, setChecked] = React.useState({ bold: false, italic: true, underline: false });
  function MenuCheckIcon() {
    return (
      <svg className="tale-menu__item-indicator" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="2,7 5.5,10.5 12,3.5" />
      </svg>
    );
  }
  return (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="neutral">Format ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            {(Object.keys(checked) as (keyof typeof checked)[]).map((key) => (
              <Menu.CheckboxItem
                key={key}
                checked={checked[key]}
                onCheckedChange={(val) => setChecked((prev) => ({ ...prev, [key]: val }))}
              >
                {checked[key] && <MenuCheckIcon />}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Menu.CheckboxItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

// ---------------------------------------------------------------------------
// Main audit page
// ---------------------------------------------------------------------------

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

export default function ComponentAudit() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20rem 1fr', gap: '4rem', alignItems: 'start' }}>
      {/* TOC */}
      <nav style={{ position: 'sticky', top: '2rem', maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto', paddingRight: '1.6rem' }}>
        <div style={{ marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--label-font-family)', color: 'var(--neutral-90)' }}>
            Component Audit
          </span>
        </div>
        {TOC.map(({ category, items }) => (
          <div key={category}>
            <div style={tocCategoryStyle}>{category}</div>
            {items.map(({ id, label }) => (
              <a key={id} href={`#${id}`} style={tocLinkStyle}>{label}</a>
            ))}
          </div>
        ))}
      </nav>

      {/* Content */}
      <div>
        {/* ============================================================= */}
        {/* FORM CONTROLS */}
        {/* ============================================================= */}

        <Section id="button" title="Button" classes={['tale-button', 'tale-button--primary', 'tale-button--neutral', 'tale-button--ghost', 'tale-button--danger', 'tale-button--sm', 'tale-button--md', 'tale-button--lg']}>
          <SubHeading>Variants</SubHeading>
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Button disabled variant="primary">Primary</Button>
            <Button disabled variant="neutral">Neutral</Button>
            <Button disabled variant="ghost">Ghost</Button>
            <Button disabled variant="danger">Danger</Button>
          </Row>
        </Section>

        <Section id="input" title="Input" classes={['tale-input', 'tale-input--sm', 'tale-input--lg']}>
          <SubHeading>Sizes</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem', marginBottom: '2rem' }}>
            <Input size="sm" placeholder="Small input" />
            <Input placeholder="Medium input (default)" />
            <Input size="lg" placeholder="Large input" />
          </div>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem' }}>
            <Input placeholder="Default" />
            <Input defaultValue="With value" />
            <Input disabled placeholder="Disabled" />
          </div>
        </Section>

        <Section id="checkbox" title="Checkbox" classes={['tale-checkbox', 'tale-checkbox__indicator']}>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { label: 'Unchecked', checked: false },
              { label: 'Checked', checked: true },
              { label: 'Disabled', checked: false, disabled: true },
              { label: 'Disabled + Checked', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Checkbox.Root defaultChecked={checked} disabled={disabled}>
                  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <span style={labelStyle}>{label}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Checkbox.Root indeterminate>
                <Checkbox.Indicator><MinusIcon /></Checkbox.Indicator>
              </Checkbox.Root>
              <span style={labelStyle}>Indeterminate</span>
            </div>
          </div>
        </Section>

        <Section id="radio" title="Radio" classes={['tale-radio', 'tale-radio__indicator', 'tale-radio--sm', 'tale-radio--lg']}>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio.Root value="unchecked">
                <Radio.Indicator />
              </Radio.Root>
              <span style={labelStyle}>Unchecked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio.Group value="checked">
                <Radio.Root value="checked">
                  <Radio.Indicator />
                </Radio.Root>
              </Radio.Group>
              <span style={labelStyle}>Checked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio.Root value="disabled" disabled>
                <Radio.Indicator />
              </Radio.Root>
              <span style={labelStyle}>Disabled</span>
            </div>
          </div>
          <SubHeading>Radio Group</SubHeading>
          <Radio.Group defaultValue="option-a" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const value = `option-${String.fromCharCode(97 + i)}`;
              return (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Radio.Root value={value}>
                    <Radio.Indicator />
                  </Radio.Root>
                  <span style={labelStyle}>{label}</span>
                </div>
              );
            })}
          </Radio.Group>
        </Section>

        <Section id="switch" title="Switch" classes={['tale-switch', 'tale-switch__thumb']}>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {[
              { label: 'Off', checked: false },
              { label: 'On', checked: true },
              { label: 'Disabled (Off)', checked: false, disabled: true },
              { label: 'Disabled (On)', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <Switch.Root defaultChecked={checked} disabled={disabled}>
                  <Switch.Thumb />
                </Switch.Root>
                <span style={labelStyle}>{label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="toggle" title="Toggle" classes={['tale-toggle', 'tale-toggle--sm', 'tale-toggle--md', 'tale-toggle--lg']}>
          <SubHeading>Sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Toggle key={size} size={size}>{size.toUpperCase()}</Toggle>
            ))}
          </Row>
          <SubHeading>States</SubHeading>
          <Row>
            <Toggle size="md">Unpressed</Toggle>
            <Toggle size="md" defaultPressed>Pressed</Toggle>
            <Toggle size="md" disabled>Disabled</Toggle>
          </Row>
        </Section>

        <Section id="select" title="Select" classes={['tale-select__trigger', 'tale-select__value', 'tale-select__icon', 'tale-select__popup', 'tale-select__list', 'tale-select__item', 'tale-select__item-text', 'tale-select__item-indicator', 'tale-select__group-label', 'tale-select__separator']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Select a fruit…" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={4}>
                  <Select.Popup>
                    <Select.List>
                      {fruits.map((fruit) => (
                        <Select.Item key={fruit} value={fruit.toLowerCase()}>
                          <Select.ItemText>{fruit}</Select.ItemText>
                          <Select.ItemIndicator><CheckIcon14 /></Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Select.Root disabled>
              <Select.Trigger>
                <Select.Value placeholder="Disabled select" />
              </Select.Trigger>
            </Select.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}>
              <Select.Label>Fruit</Select.Label>
              <Select.Root>
                <Select.Trigger>
                  <Select.Value placeholder="Select a fruit…" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={4}>
                    <Select.Popup>
                      <Select.List>
                        {fruits.map((fruit) => (
                          <Select.Item key={fruit} value={fruit.toLowerCase()}>
                            <Select.ItemText>{fruit}</Select.ItemText>
                            <Select.ItemIndicator><CheckIcon14 /></Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          </Row>
          <SubHeading>With Groups</SubHeading>
          <Row>
            <Select.Root>
              <Select.Trigger>
                <Select.Value placeholder="Select a country…" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={4}>
                  <Select.Popup>
                    <Select.List>
                      <Select.Group>
                        <Select.GroupLabel>Europe</Select.GroupLabel>
                        {['France', 'Germany', 'Spain'].map((c) => (
                          <Select.Item key={c} value={c.toLowerCase()}>
                            <Select.ItemText>{c}</Select.ItemText>
                            <Select.ItemIndicator><CheckIcon14 /></Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Separator />
                      <Select.Group>
                        <Select.GroupLabel>Americas</Select.GroupLabel>
                        {['Brazil', 'Canada', 'Mexico'].map((c) => (
                          <Select.Item key={c} value={c.toLowerCase()}>
                            <Select.ItemText>{c}</Select.ItemText>
                            <Select.ItemIndicator><CheckIcon14 /></Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </Row>
        </Section>

        <Section id="combobox" title="Combobox" classes={['tale-combobox__input', 'tale-combobox__popup', 'tale-combobox__item', 'tale-combobox__empty']}>
          <SubHeading>Default</SubHeading>
          <ComboboxDemo />
          <SubHeading>With Label</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)', marginBottom: '2rem' }}>
            <Combobox.Label>Country</Combobox.Label>
            <ComboboxDemo />
          </div>
        </Section>

        <Section id="number-field" title="NumberField" classes={['tale-number-field', 'tale-number-field__group', 'tale-number-field__input', 'tale-number-field__decrement', 'tale-number-field__increment']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <NumberField.Root defaultValue={0} min={0} max={100}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <NumberField.Root disabled defaultValue={42}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
        </Section>

        <Section id="slider" title="Slider" classes={['tale-slider', 'tale-slider__control', 'tale-slider__track', 'tale-slider__indicator', 'tale-slider__thumb']}>
          <SubHeading>With Label</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)', marginBottom: '2rem' }}>
            <Slider.Label>Volume</Slider.Label>
            <Slider.Root defaultValue={[40]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Slider.Root defaultValue={[40]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Range (two thumbs)</SubHeading>
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Slider.Root defaultValue={[20, 80]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb index={0} />
                  <Slider.Thumb index={1} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div style={{ width: '28rem' }}>
            <Slider.Root disabled defaultValue={[60]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
        </Section>

        <CalendarSection />

        {/* ============================================================= */}
        {/* OVERLAY */}
        {/* ============================================================= */}

        <Section id="dialog" title="Dialog" classes={['tale-dialog__backdrop', 'tale-dialog__popup', 'tale-dialog__title', 'tale-dialog__description', 'tale-dialog__close', 'tale-dialog__actions']}>
          <Row>
            <Dialog.Root>
              <Dialog.Trigger render={<Button variant="primary">Open Dialog</Button>} />
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                  <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
                  <Dialog.Title>Dialog Title</Dialog.Title>
                  <Dialog.Description>
                    This is a modal dialog. It traps focus and requires the user to take action.
                  </Dialog.Description>
                  <div className="tale-dialog__actions">
                    <Dialog.Close render={<Button variant="neutral">Cancel</Button>} />
                    <Dialog.Close render={<Button variant="primary">Confirm</Button>} />
                  </div>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </Row>
        </Section>

        <Section id="alert-dialog" title="AlertDialog" classes={['tale-alert-dialog__backdrop', 'tale-alert-dialog__popup', 'tale-alert-dialog__title', 'tale-alert-dialog__description', 'tale-alert-dialog__actions']}>
          <Row>
            <AlertDialog.Root>
              <AlertDialog.Trigger render={<Button variant="danger">Delete Item</Button>} />
              <AlertDialog.Portal>
                <AlertDialog.Backdrop />
                <AlertDialog.Popup>
                  <AlertDialog.Title>Are you sure?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This will permanently delete the item. This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="tale-alert-dialog__actions">
                    <AlertDialog.Close render={<Button variant="neutral">Cancel</Button>} />
                    <AlertDialog.Close render={<Button variant="danger">Delete</Button>} />
                  </div>
                </AlertDialog.Popup>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </Row>
        </Section>

        <Section id="popover" title="Popover" classes={['tale-popover__popup', 'tale-popover__title', 'tale-popover__description', 'tale-popover__close']}>
          <SubHeading>All sides</SubHeading>
          <Row style={{ gap: '1.2rem', padding: '4rem 0' }}>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Popover.Root key={side}>
                <Popover.Trigger render={<Button variant="neutral">{side}</Button>} />
                <Popover.Portal>
                  <Popover.Positioner side={side} align="center" sideOffset={8}>
                    <Popover.Popup>
                      <Popover.Close aria-label="Close"><XIconSm /></Popover.Close>
                      <Popover.Title>Popover ({side})</Popover.Title>
                      <Popover.Description>
                        Appears on the {side}.
                      </Popover.Description>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            ))}
          </Row>
        </Section>

        <Section id="drawer" title="Drawer" classes={['tale-drawer__backdrop', 'tale-drawer__popup', 'tale-drawer__handle', 'tale-drawer__title', 'tale-drawer__description']}>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger render={<Button variant="neutral">Open Drawer</Button>} />
              <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                  <div className="tale-drawer__handle" />
                  <Drawer.Title>Drawer</Drawer.Title>
                  <Drawer.Description>
                    This is a bottom sheet drawer. Swipe down or click outside to close.
                  </Drawer.Description>
                  <div style={{ marginTop: '1.6rem', display: 'flex', gap: '1.2rem' }}>
                    <Drawer.Close render={<Button variant="neutral" style={{ flex: 1 }}>Cancel</Button>} />
                    <Drawer.Close render={<Button variant="primary" style={{ flex: 1 }}>Confirm</Button>} />
                  </div>
                </Drawer.Popup>
              </Drawer.Portal>
            </Drawer.Root>
          </Row>
        </Section>

        <Section id="tooltip" title="Tooltip" classes={['tale-tooltip__popup']}>
          <SubHeading>All sides</SubHeading>
          <Tooltip.Provider delay={300} closeDelay={150}>
            <Row style={{ padding: '4rem 0' }}>
              {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                <Tooltip.Root key={side}>
                  <Tooltip.Trigger render={<Button variant="neutral">Hover ({side})</Button>} />
                  <Tooltip.Portal>
                    <Tooltip.Positioner side={side} sideOffset={8}>
                      <Tooltip.Popup>Appears on the {side}</Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </Row>
          </Tooltip.Provider>
        </Section>

        {/* ============================================================= */}
        {/* NAVIGATION */}
        {/* ============================================================= */}

        <Section id="menu" title="Menu" classes={['tale-menu__popup', 'tale-menu__item', 'tale-menu__separator', 'tale-menu__group-label', 'tale-menu__checkbox-item', 'tale-menu__submenu-trigger']}>
          <SubHeading>Basic</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger render={<Button variant="neutral">Options ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Duplicate</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>Share</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>Delete</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Row>
          <SubHeading>With Group Labels</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger render={<Button variant="neutral">Account ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Group>
                      <Menu.GroupLabel>Account</Menu.GroupLabel>
                      <Menu.Item>Profile</Menu.Item>
                      <Menu.Item>Settings</Menu.Item>
                    </Menu.Group>
                    <Menu.Separator />
                    <Menu.Group>
                      <Menu.GroupLabel>Danger Zone</Menu.GroupLabel>
                      <Menu.Item>Sign out</Menu.Item>
                    </Menu.Group>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Row>
          <SubHeading>Checkbox Items</SubHeading>
          <Row>
            <MenuCheckboxDemo />
          </Row>
          <SubHeading>With Submenu</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger render={<Button variant="neutral">More ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.SubmenuRoot>
                      <Menu.SubmenuTrigger>Export</Menu.SubmenuTrigger>
                      <Menu.Portal>
                        <Menu.Positioner side="right" sideOffset={4}>
                          <Menu.Popup>
                            <Menu.Item>PNG</Menu.Item>
                            <Menu.Item>SVG</Menu.Item>
                            <Menu.Item>PDF</Menu.Item>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.SubmenuRoot>
                    <Menu.Separator />
                    <Menu.Item>Delete</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* LAYOUT */}
        {/* ============================================================= */}

        <Section id="accordion" title="Accordion" classes={['tale-accordion', 'tale-accordion__item', 'tale-accordion__trigger', 'tale-accordion__trigger-icon', 'tale-accordion__panel']}>
          <div style={{ width: '48rem' }}>
            <Accordion.Root defaultValue={['a']}>
              {[
                { value: 'a', title: 'What is Tale UI?', content: 'Tale UI is a styled component library forked from MUI Base UI, providing accessible headless components with opinionated CSS.' },
                { value: 'b', title: 'How does styling work?', content: 'Styling lives in @tale-ui/react-styles. Components are headless — you apply CSS classes like .tale-button.' },
                { value: 'c', title: 'Can I use dark mode?', content: 'Yes! Set data-color-mode="dark" on the <html> element. Tokens auto-invert.' },
              ].map(({ value, title, content }) => (
                <Accordion.Item key={value} value={value}>
                  <Accordion.Header>
                    <Accordion.Trigger>
                      {title}
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>{content}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </Section>

        <Section id="collapsible" title="Collapsible" classes={['tale-collapsible', 'tale-collapsible__trigger', 'tale-collapsible__panel']}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', width: '36rem' }}>
            <Collapsible.Root defaultOpen>
              <Collapsible.Trigger>Open by default</Collapsible.Trigger>
              <Collapsible.Panel>
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is visible by default.
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
            <Collapsible.Root>
              <Collapsible.Trigger>Click to expand</Collapsible.Trigger>
              <Collapsible.Panel>
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is hidden by default.
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
            <Collapsible.Root disabled>
              <Collapsible.Trigger>Disabled</Collapsible.Trigger>
              <Collapsible.Panel>
                <div style={{ padding: '1.2rem 0' }}>Content</div>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        </Section>

        <Section id="tabs" title="Tabs" classes={['tale-tabs', 'tale-tabs__list', 'tale-tabs__tab', 'tale-tabs__panel', 'tale-tabs__indicator']}>
          <SubHeading>Horizontal</SubHeading>
          <div style={{ width: '48rem', marginBottom: '2rem' }}>
            <Tabs.Root defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="features">Features</Tabs.Tab>
                <Tabs.Tab value="disabled" disabled>Disabled</Tabs.Tab>
                <Tabs.Tab value="docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel value="overview">Overview content goes here.</Tabs.Panel>
              <Tabs.Panel value="features">Features list.</Tabs.Panel>
              <Tabs.Panel value="disabled">Disabled tab content.</Tabs.Panel>
              <Tabs.Panel value="docs">Documentation.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div style={{ width: '48rem', height: '20rem' }}>
            <Tabs.Root defaultValue="overview" orientation="vertical">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="features">Features</Tabs.Tab>
                <Tabs.Tab value="docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
              <Tabs.Panel value="features">Features.</Tabs.Panel>
              <Tabs.Panel value="docs">Docs.</Tabs.Panel>
            </Tabs.Root>
          </div>
        </Section>

        <Section id="scroll-area" title="ScrollArea" classes={['tale-scroll-area', 'tale-scroll-area__viewport', 'tale-scroll-area__scrollbar', 'tale-scroll-area__thumb', 'tale-scroll-area__corner']}>
          <ScrollArea.Root style={{ width: '32rem', height: '20rem', border: '1px solid var(--neutral-20)', borderRadius: '0.8rem' }}>
            <ScrollArea.Viewport>
              <div style={{ padding: '1.6rem' }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} style={{ margin: '0 0 0.8rem', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                    Line {i + 1}: Scrollable content with custom styled scrollbars.
                  </p>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Section>

        <Section id="separator" title="Separator" classes={['tale-separator']}>
          <SubHeading>Horizontal</SubHeading>
          <div style={{ width: '32rem', marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 1.2rem', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content above</p>
            <Separator />
            <p style={{ margin: '1.2rem 0 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content below</p>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', height: '2.4rem' }}>
            <span style={{ color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Left</span>
            <Separator orientation="vertical" />
            <span style={{ color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Right</span>
          </div>
        </Section>

        {/* ============================================================= */}
        {/* FEEDBACK */}
        {/* ============================================================= */}

        <Section id="progress" title="Progress" classes={['tale-progress', 'tale-progress__track', 'tale-progress__indicator', 'tale-progress__value']}>
          <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { label: '20%', value: 20 },
              { label: '60%', value: 60 },
              { label: '100% (Complete)', value: 100 },
              { label: 'Indeterminate', value: null },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{label}</span>
                <Progress.Root value={value}>
                  <Progress.Track>
                    <Progress.Indicator />
                  </Progress.Track>
                </Progress.Root>
              </div>
            ))}
          </div>
        </Section>

        <Section id="meter" title="Meter" classes={['tale-meter', 'tale-meter__track', 'tale-meter__indicator', 'tale-meter__label', 'tale-meter__value']}>
          <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { label: '25%', value: 25 },
              { label: '60%', value: 60 },
              { label: '90%', value: 90 },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{label}</span>
                <Meter.Root value={value}>
                  <Meter.Track>
                    <Meter.Indicator />
                  </Meter.Track>
                </Meter.Root>
              </div>
            ))}
          </div>
        </Section>

        <ToastSection />

        {/* ============================================================= */}
        {/* DISPLAY */}
        {/* ============================================================= */}

        <Section id="avatar" title="Avatar" classes={['tale-avatar', 'tale-avatar--sm', 'tale-avatar--md', 'tale-avatar--lg', 'tale-avatar--xl', 'tale-avatar__image', 'tale-avatar__fallback']}>
          <SubHeading>Sizes (fallback)</SubHeading>
          <Row>
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Avatar.Root key={size} size={size}>
                <Avatar.Fallback>AB</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </Row>
          <SubHeading>With image</SubHeading>
          <Row>
            <Avatar.Root size="lg">
              <Avatar.Image src="https://avatars.githubusercontent.com/u/1" alt="User" />
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar.Root>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* FORM STRUCTURE */}
        {/* ============================================================= */}

        <Section id="field" title="Field" classes={['tale-field', 'tale-field__label', 'tale-field__description', 'tale-field__error']}>
          <div style={{ width: '32rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Field.Root>
              <Field.Label>Default</Field.Label>
              <Input placeholder="Type here…" />
              <Field.Description>Helper text goes here.</Field.Description>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <Input disabled placeholder="Cannot edit" />
              <Field.Description>This field is disabled.</Field.Description>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Invalid</Field.Label>
              <Input defaultValue="bad value" />
              <Field.Error>This field has an error.</Field.Error>
            </Field.Root>
          </div>
        </Section>

        {/* ============================================================= */}
        {/* OTHER */}
        {/* ============================================================= */}

        <Section id="toolbar" title="Toolbar" classes={['tale-toolbar', 'tale-toolbar__button', 'tale-toolbar__separator', 'tale-toolbar__link', 'tale-toolbar__input']}>
          <SubHeading>Default</SubHeading>
          <Toolbar.Root aria-label="Text formatting">
            <Toolbar.Button aria-label="Bold"><strong>B</strong></Toolbar.Button>
            <Toolbar.Button aria-label="Italic"><em>I</em></Toolbar.Button>
            <Toolbar.Button aria-label="Underline"><u>U</u></Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Button disabled>Undo</Toolbar.Button>
            <Toolbar.Button disabled>Redo</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Link href="#">Help</Toolbar.Link>
          </Toolbar.Root>
          <SubHeading>With Input</SubHeading>
          <Toolbar.Root aria-label="Search toolbar" style={{ marginTop: '1.2rem' }}>
            <Toolbar.Button>Filter</Toolbar.Button>
            <Toolbar.Button>Sort</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Input placeholder="Search…" aria-label="Search" />
          </Toolbar.Root>
        </Section>
      </div>
    </div>
  );
}
