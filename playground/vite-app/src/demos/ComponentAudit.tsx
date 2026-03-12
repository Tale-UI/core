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
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Switch } from '@tale-ui/react/switch';
import { Select } from '@tale-ui/react/select';
import { Combobox } from '@tale-ui/react/combobox';
import { NumberField } from '@tale-ui/react/number-field';
import { Slider } from '@tale-ui/react/slider';

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

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const CheckIcon14 = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <polyline points="2,7 5.5,10.5 12,3.5" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="6" x2="10" y2="6" />
  </svg>
);

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <polyline points="4,6 8,10 12,6" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="16" height="16">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

const XIconSm = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="14" height="14">
    <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

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
        <Combobox.Input className="tale-combobox__input" placeholder="Search country…" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className="tale-combobox__popup">
              <Combobox.List>
                {items.length === 0 ? (
                  <Combobox.Empty className="tale-combobox__empty">No results</Combobox.Empty>
                ) : (
                  items.map((c) => (
                    <Combobox.Item key={c} className="tale-combobox__item" value={c}>{c}</Combobox.Item>
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
    <Toast.Viewport className="tale-toast__positioner">
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} className="tale-toast__root" toast={toast}>
          <Toast.Content className="tale-toast__content">
            <Toast.Title className="tale-toast__title">{toast.title}</Toast.Title>
            {toast.description && (
              <Toast.Description className="tale-toast__description">{toast.description}</Toast.Description>
            )}
          </Toast.Content>
          <Toast.Close className="tale-toast__close" aria-label="Close"><XIconSm /></Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

function ToastTriggers() {
  const { add } = Toast.useToastManager();
  return (
    <Row>
      {[
        { label: 'Default', type: undefined, variant: 'neutral' },
        { label: 'Success', type: 'success', variant: 'primary' },
        { label: 'Error', type: 'error', variant: 'danger' },
        { label: 'Warning', type: 'warning', variant: 'neutral' },
      ].map(({ label, type, variant }) => (
        <Button
          key={label}
          className={`tale-button tale-button--${variant}`}
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
  const MenuCheckIcon = () => (
    <svg className="tale-menu__item-indicator" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="2,7 5.5,10.5 12,3.5" />
    </svg>
  );
  return (
    <Menu.Root>
      <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Format ▾</Button>} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className="tale-menu__popup">
            {(Object.keys(checked) as (keyof typeof checked)[]).map((key) => (
              <Menu.CheckboxItem
                key={key}
                className="tale-menu__checkbox-item"
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
            <Button className="tale-button tale-button--primary">Primary</Button>
            <Button className="tale-button tale-button--neutral">Neutral</Button>
            <Button className="tale-button tale-button--ghost">Ghost</Button>
            <Button className="tale-button tale-button--danger">Danger</Button>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <Button className="tale-button tale-button--primary tale-button--sm">Small</Button>
            <Button className="tale-button tale-button--primary tale-button--md">Medium</Button>
            <Button className="tale-button tale-button--primary tale-button--lg">Large</Button>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Button disabled className="tale-button tale-button--primary">Primary</Button>
            <Button disabled className="tale-button tale-button--neutral">Neutral</Button>
            <Button disabled className="tale-button tale-button--ghost">Ghost</Button>
            <Button disabled className="tale-button tale-button--danger">Danger</Button>
          </Row>
        </Section>

        <Section id="input" title="Input" classes={['tale-input', 'tale-input--sm', 'tale-input--lg']}>
          <SubHeading>Sizes</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem', marginBottom: '2rem' }}>
            <Input className="tale-input tale-input--sm" placeholder="Small input" />
            <Input className="tale-input" placeholder="Medium input (default)" />
            <Input className="tale-input tale-input--lg" placeholder="Large input" />
          </div>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem' }}>
            <Input className="tale-input" placeholder="Default" />
            <Input className="tale-input" defaultValue="With value" />
            <Input className="tale-input" disabled placeholder="Disabled" />
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
                <Checkbox.Root className="tale-checkbox" defaultChecked={checked} disabled={disabled}>
                  <Checkbox.Indicator className="tale-checkbox__indicator"><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <span style={labelStyle}>{label}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Checkbox.Root className="tale-checkbox" indeterminate>
                <Checkbox.Indicator className="tale-checkbox__indicator"><MinusIcon /></Checkbox.Indicator>
              </Checkbox.Root>
              <span style={labelStyle}>Indeterminate</span>
            </div>
          </div>
        </Section>

        <Section id="radio" title="Radio" classes={['tale-radio', 'tale-radio__indicator', 'tale-radio--sm', 'tale-radio--lg']}>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio.Root className="tale-radio" value="unchecked">
                <Radio.Indicator className="tale-radio__indicator" />
              </Radio.Root>
              <span style={labelStyle}>Unchecked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <RadioGroup value="checked">
                <Radio.Root className="tale-radio" value="checked">
                  <Radio.Indicator className="tale-radio__indicator" />
                </Radio.Root>
              </RadioGroup>
              <span style={labelStyle}>Checked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio.Root className="tale-radio" value="disabled" disabled>
                <Radio.Indicator className="tale-radio__indicator" />
              </Radio.Root>
              <span style={labelStyle}>Disabled</span>
            </div>
          </div>
          <SubHeading>Radio Group</SubHeading>
          <RadioGroup defaultValue="option-a" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const value = `option-${String.fromCharCode(97 + i)}`;
              return (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Radio.Root className="tale-radio" value={value}>
                    <Radio.Indicator className="tale-radio__indicator" />
                  </Radio.Root>
                  <span style={labelStyle}>{label}</span>
                </div>
              );
            })}
          </RadioGroup>
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
                <Switch.Root className="tale-switch" defaultChecked={checked} disabled={disabled}>
                  <Switch.Thumb className="tale-switch__thumb" />
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
              <Toggle key={size} className={`tale-toggle tale-toggle--${size}`}>{size.toUpperCase()}</Toggle>
            ))}
          </Row>
          <SubHeading>States</SubHeading>
          <Row>
            <Toggle className="tale-toggle tale-toggle--md">Unpressed</Toggle>
            <Toggle className="tale-toggle tale-toggle--md" defaultPressed>Pressed</Toggle>
            <Toggle className="tale-toggle tale-toggle--md" disabled>Disabled</Toggle>
          </Row>
        </Section>

        <Section id="select" title="Select" classes={['tale-select__trigger', 'tale-select__value', 'tale-select__icon', 'tale-select__popup', 'tale-select__list', 'tale-select__item', 'tale-select__item-text', 'tale-select__item-indicator', 'tale-select__group-label', 'tale-select__separator']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <Select.Root>
              <Select.Trigger className="tale-select__trigger">
                <Select.Value className="tale-select__value" placeholder="Select a fruit…" />
                <ChevronIcon className="tale-select__icon" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={4}>
                  <Select.Popup className="tale-select__popup">
                    <Select.List className="tale-select__list">
                      {fruits.map((fruit) => (
                        <Select.Item key={fruit} className="tale-select__item" value={fruit.toLowerCase()}>
                          <Select.ItemText className="tale-select__item-text">{fruit}</Select.ItemText>
                          <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon14 /></Select.ItemIndicator>
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
              <Select.Trigger className="tale-select__trigger">
                <Select.Value className="tale-select__value" placeholder="Disabled select" />
                <ChevronIcon className="tale-select__icon" />
              </Select.Trigger>
            </Select.Root>
          </Row>
          <SubHeading>With Groups</SubHeading>
          <Row>
            <Select.Root>
              <Select.Trigger className="tale-select__trigger">
                <Select.Value className="tale-select__value" placeholder="Select a country…" />
                <ChevronIcon className="tale-select__icon" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={4}>
                  <Select.Popup className="tale-select__popup">
                    <Select.List className="tale-select__list">
                      <Select.Group>
                        <Select.GroupLabel className="tale-select__group-label">Europe</Select.GroupLabel>
                        {['France', 'Germany', 'Spain'].map((c) => (
                          <Select.Item key={c} className="tale-select__item" value={c.toLowerCase()}>
                            <Select.ItemText className="tale-select__item-text">{c}</Select.ItemText>
                            <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon14 /></Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Separator className="tale-select__separator" />
                      <Select.Group>
                        <Select.GroupLabel className="tale-select__group-label">Americas</Select.GroupLabel>
                        {['Brazil', 'Canada', 'Mexico'].map((c) => (
                          <Select.Item key={c} className="tale-select__item" value={c.toLowerCase()}>
                            <Select.ItemText className="tale-select__item-text">{c}</Select.ItemText>
                            <Select.ItemIndicator className="tale-select__item-indicator"><CheckIcon14 /></Select.ItemIndicator>
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
        </Section>

        <Section id="number-field" title="NumberField" classes={['tale-number-field', 'tale-number-field__group', 'tale-number-field__input', 'tale-number-field__decrement', 'tale-number-field__increment']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <NumberField.Root className="tale-number-field" defaultValue={0} min={0} max={100}>
              <NumberField.Group className="tale-number-field__group">
                <NumberField.Decrement className="tale-number-field__decrement">−</NumberField.Decrement>
                <NumberField.Input className="tale-number-field__input" />
                <NumberField.Increment className="tale-number-field__increment">+</NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <NumberField.Root className="tale-number-field" disabled defaultValue={42}>
              <NumberField.Group className="tale-number-field__group">
                <NumberField.Decrement className="tale-number-field__decrement">−</NumberField.Decrement>
                <NumberField.Input className="tale-number-field__input" />
                <NumberField.Increment className="tale-number-field__increment">+</NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>
          </Row>
        </Section>

        <Section id="slider" title="Slider" classes={['tale-slider', 'tale-slider__control', 'tale-slider__track', 'tale-slider__indicator', 'tale-slider__thumb']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Slider.Root className="tale-slider" defaultValue={[40]}>
              <Slider.Control className="tale-slider__control">
                <Slider.Track className="tale-slider__track">
                  <Slider.Indicator className="tale-slider__indicator" />
                  <Slider.Thumb className="tale-slider__thumb" />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Range (two thumbs)</SubHeading>
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Slider.Root className="tale-slider" defaultValue={[20, 80]}>
              <Slider.Control className="tale-slider__control">
                <Slider.Track className="tale-slider__track">
                  <Slider.Indicator className="tale-slider__indicator" />
                  <Slider.Thumb className="tale-slider__thumb" index={0} />
                  <Slider.Thumb className="tale-slider__thumb" index={1} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div style={{ width: '28rem' }}>
            <Slider.Root className="tale-slider" disabled defaultValue={[60]}>
              <Slider.Control className="tale-slider__control">
                <Slider.Track className="tale-slider__track">
                  <Slider.Indicator className="tale-slider__indicator" />
                  <Slider.Thumb className="tale-slider__thumb" />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
        </Section>

        {/* ============================================================= */}
        {/* OVERLAY */}
        {/* ============================================================= */}

        <Section id="dialog" title="Dialog" classes={['tale-dialog__backdrop', 'tale-dialog__popup', 'tale-dialog__title', 'tale-dialog__description', 'tale-dialog__close', 'tale-dialog__actions']}>
          <Row>
            <Dialog.Root>
              <Dialog.Trigger render={<Button className="tale-button tale-button--primary">Open Dialog</Button>} />
              <Dialog.Portal>
                <Dialog.Backdrop className="tale-dialog__backdrop" />
                <Dialog.Popup className="tale-dialog__popup">
                  <Dialog.Close className="tale-dialog__close" aria-label="Close"><XIcon /></Dialog.Close>
                  <Dialog.Title className="tale-dialog__title">Dialog Title</Dialog.Title>
                  <Dialog.Description className="tale-dialog__description">
                    This is a modal dialog. It traps focus and requires the user to take action.
                  </Dialog.Description>
                  <div className="tale-dialog__actions">
                    <Dialog.Close render={<Button className="tale-button tale-button--neutral">Cancel</Button>} />
                    <Dialog.Close render={<Button className="tale-button tale-button--primary">Confirm</Button>} />
                  </div>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </Row>
        </Section>

        <Section id="alert-dialog" title="AlertDialog" classes={['tale-alert-dialog__backdrop', 'tale-alert-dialog__popup', 'tale-alert-dialog__title', 'tale-alert-dialog__description', 'tale-alert-dialog__actions']}>
          <Row>
            <AlertDialog.Root>
              <AlertDialog.Trigger render={<Button className="tale-button tale-button--danger">Delete Item</Button>} />
              <AlertDialog.Portal>
                <AlertDialog.Backdrop className="tale-alert-dialog__backdrop" />
                <AlertDialog.Popup className="tale-alert-dialog__popup">
                  <AlertDialog.Title className="tale-alert-dialog__title">Are you sure?</AlertDialog.Title>
                  <AlertDialog.Description className="tale-alert-dialog__description">
                    This will permanently delete the item. This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="tale-alert-dialog__actions">
                    <AlertDialog.Close render={<Button className="tale-button tale-button--neutral">Cancel</Button>} />
                    <AlertDialog.Close render={<Button className="tale-button tale-button--danger">Delete</Button>} />
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
                <Popover.Trigger render={<Button className="tale-button tale-button--neutral">{side}</Button>} />
                <Popover.Portal>
                  <Popover.Positioner side={side} align="center" sideOffset={8}>
                    <Popover.Popup className="tale-popover__popup">
                      <Popover.Close className="tale-popover__close" aria-label="Close"><XIconSm /></Popover.Close>
                      <Popover.Title className="tale-popover__title">Popover ({side})</Popover.Title>
                      <Popover.Description className="tale-popover__description">
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
              <Drawer.Trigger render={<Button className="tale-button tale-button--neutral">Open Drawer</Button>} />
              <Drawer.Portal>
                <Drawer.Backdrop className="tale-drawer__backdrop" />
                <Drawer.Popup className="tale-drawer__popup">
                  <div className="tale-drawer__handle" />
                  <Drawer.Title className="tale-drawer__title">Drawer</Drawer.Title>
                  <Drawer.Description className="tale-drawer__description">
                    This is a bottom sheet drawer. Swipe down or click outside to close.
                  </Drawer.Description>
                  <div style={{ marginTop: '1.6rem', display: 'flex', gap: '1.2rem' }}>
                    <Drawer.Close render={<Button className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Button>} />
                    <Drawer.Close render={<Button className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Button>} />
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
                  <Tooltip.Trigger render={<Button className="tale-button tale-button--neutral">Hover ({side})</Button>} />
                  <Tooltip.Portal>
                    <Tooltip.Positioner side={side} sideOffset={8}>
                      <Tooltip.Popup className="tale-tooltip__popup">Appears on the {side}</Tooltip.Popup>
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
              <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Options ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup className="tale-menu__popup">
                    <Menu.Item className="tale-menu__item">Edit</Menu.Item>
                    <Menu.Item className="tale-menu__item">Duplicate</Menu.Item>
                    <Menu.Separator className="tale-menu__separator" />
                    <Menu.Item className="tale-menu__item">Share</Menu.Item>
                    <Menu.Separator className="tale-menu__separator" />
                    <Menu.Item className="tale-menu__item">Delete</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Row>
          <SubHeading>With Group Labels</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger render={<Button className="tale-button tale-button--neutral">Account ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup className="tale-menu__popup">
                    <Menu.Group>
                      <Menu.GroupLabel className="tale-menu__group-label">Account</Menu.GroupLabel>
                      <Menu.Item className="tale-menu__item">Profile</Menu.Item>
                      <Menu.Item className="tale-menu__item">Settings</Menu.Item>
                    </Menu.Group>
                    <Menu.Separator className="tale-menu__separator" />
                    <Menu.Group>
                      <Menu.GroupLabel className="tale-menu__group-label">Danger Zone</Menu.GroupLabel>
                      <Menu.Item className="tale-menu__item">Sign out</Menu.Item>
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
              <Menu.Trigger render={<Button className="tale-button tale-button--neutral">More ▾</Button>} />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup className="tale-menu__popup">
                    <Menu.Item className="tale-menu__item">Edit</Menu.Item>
                    <Menu.SubmenuRoot>
                      <Menu.SubmenuTrigger className="tale-menu__submenu-trigger">Export</Menu.SubmenuTrigger>
                      <Menu.Portal>
                        <Menu.Positioner side="right" sideOffset={4}>
                          <Menu.Popup className="tale-menu__popup">
                            <Menu.Item className="tale-menu__item">PNG</Menu.Item>
                            <Menu.Item className="tale-menu__item">SVG</Menu.Item>
                            <Menu.Item className="tale-menu__item">PDF</Menu.Item>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.SubmenuRoot>
                    <Menu.Separator className="tale-menu__separator" />
                    <Menu.Item className="tale-menu__item">Delete</Menu.Item>
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
            <Accordion.Root className="tale-accordion" defaultValue={['a']}>
              {[
                { value: 'a', title: 'What is Tale UI?', content: 'Tale UI is a styled component library forked from MUI Base UI, providing accessible headless components with opinionated CSS.' },
                { value: 'b', title: 'How does styling work?', content: 'Styling lives in @tale-ui/react-styles. Components are headless — you apply CSS classes like .tale-button.' },
                { value: 'c', title: 'Can I use dark mode?', content: 'Yes! Set data-color-mode="dark" on the <html> element. Tokens auto-invert.' },
              ].map(({ value, title, content }) => (
                <Accordion.Item key={value} className="tale-accordion__item" value={value}>
                  <Accordion.Header>
                    <Accordion.Trigger className="tale-accordion__trigger">
                      {title}
                      <ChevronIcon className="tale-accordion__trigger-icon" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel className="tale-accordion__panel">{content}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </Section>

        <Section id="collapsible" title="Collapsible" classes={['tale-collapsible', 'tale-collapsible__trigger', 'tale-collapsible__panel']}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', width: '36rem' }}>
            <Collapsible.Root className="tale-collapsible" defaultOpen>
              <Collapsible.Trigger className="tale-collapsible__trigger">Open by default</Collapsible.Trigger>
              <Collapsible.Panel className="tale-collapsible__panel">
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is visible by default.
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
            <Collapsible.Root className="tale-collapsible">
              <Collapsible.Trigger className="tale-collapsible__trigger">Click to expand</Collapsible.Trigger>
              <Collapsible.Panel className="tale-collapsible__panel">
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is hidden by default.
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
            <Collapsible.Root className="tale-collapsible" disabled>
              <Collapsible.Trigger className="tale-collapsible__trigger">Disabled</Collapsible.Trigger>
              <Collapsible.Panel className="tale-collapsible__panel">
                <div style={{ padding: '1.2rem 0' }}>Content</div>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        </Section>

        <Section id="tabs" title="Tabs" classes={['tale-tabs', 'tale-tabs__list', 'tale-tabs__tab', 'tale-tabs__panel', 'tale-tabs__indicator']}>
          <SubHeading>Horizontal</SubHeading>
          <div style={{ width: '48rem', marginBottom: '2rem' }}>
            <Tabs.Root className="tale-tabs" defaultValue="overview">
              <Tabs.List className="tale-tabs__list">
                <Tabs.Tab className="tale-tabs__tab" value="overview">Overview</Tabs.Tab>
                <Tabs.Tab className="tale-tabs__tab" value="features">Features</Tabs.Tab>
                <Tabs.Tab className="tale-tabs__tab" value="disabled" disabled>Disabled</Tabs.Tab>
                <Tabs.Tab className="tale-tabs__tab" value="docs">Docs</Tabs.Tab>
                <Tabs.Indicator className="tale-tabs__indicator" />
              </Tabs.List>
              <Tabs.Panel className="tale-tabs__panel" value="overview">Overview content goes here.</Tabs.Panel>
              <Tabs.Panel className="tale-tabs__panel" value="features">Features list.</Tabs.Panel>
              <Tabs.Panel className="tale-tabs__panel" value="disabled">Disabled tab content.</Tabs.Panel>
              <Tabs.Panel className="tale-tabs__panel" value="docs">Documentation.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div style={{ width: '48rem', height: '20rem' }}>
            <Tabs.Root className="tale-tabs" defaultValue="overview" orientation="vertical">
              <Tabs.List className="tale-tabs__list">
                <Tabs.Tab className="tale-tabs__tab" value="overview">Overview</Tabs.Tab>
                <Tabs.Tab className="tale-tabs__tab" value="features">Features</Tabs.Tab>
                <Tabs.Tab className="tale-tabs__tab" value="docs">Docs</Tabs.Tab>
                <Tabs.Indicator className="tale-tabs__indicator" />
              </Tabs.List>
              <Tabs.Panel className="tale-tabs__panel" value="overview">Overview content.</Tabs.Panel>
              <Tabs.Panel className="tale-tabs__panel" value="features">Features.</Tabs.Panel>
              <Tabs.Panel className="tale-tabs__panel" value="docs">Docs.</Tabs.Panel>
            </Tabs.Root>
          </div>
        </Section>

        <Section id="scroll-area" title="ScrollArea" classes={['tale-scroll-area', 'tale-scroll-area__viewport', 'tale-scroll-area__scrollbar', 'tale-scroll-area__thumb', 'tale-scroll-area__corner']}>
          <ScrollArea.Root className="tale-scroll-area" style={{ width: '32rem', height: '20rem', border: '1px solid var(--neutral-20)', borderRadius: '0.8rem' }}>
            <ScrollArea.Viewport className="tale-scroll-area__viewport">
              <div style={{ padding: '1.6rem' }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} style={{ margin: '0 0 0.8rem', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                    Line {i + 1}: Scrollable content with custom styled scrollbars.
                  </p>
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="tale-scroll-area__scrollbar" orientation="vertical">
              <ScrollArea.Thumb className="tale-scroll-area__thumb" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="tale-scroll-area__corner" />
          </ScrollArea.Root>
        </Section>

        <Section id="separator" title="Separator" classes={['tale-separator']}>
          <SubHeading>Horizontal</SubHeading>
          <div style={{ width: '32rem', marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 1.2rem', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content above</p>
            <Separator className="tale-separator" />
            <p style={{ margin: '1.2rem 0 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Content below</p>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', height: '2.4rem' }}>
            <span style={{ color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>Left</span>
            <Separator orientation="vertical" className="tale-separator" />
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
                <Progress.Root className="tale-progress" value={value}>
                  <Progress.Track className="tale-progress__track">
                    <Progress.Indicator className="tale-progress__indicator" />
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
                <Meter.Root className="tale-meter" value={value}>
                  <Meter.Track className="tale-meter__track">
                    <Meter.Indicator className="tale-meter__indicator" />
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
              <Avatar.Root key={size} className={`tale-avatar tale-avatar--${size}`}>
                <Avatar.Fallback className="tale-avatar__fallback">AB</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </Row>
          <SubHeading>With image</SubHeading>
          <Row>
            <Avatar.Root className="tale-avatar tale-avatar--lg">
              <Avatar.Image className="tale-avatar__image" src="https://avatars.githubusercontent.com/u/1" alt="User" />
              <Avatar.Fallback className="tale-avatar__fallback">AB</Avatar.Fallback>
            </Avatar.Root>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* FORM STRUCTURE */}
        {/* ============================================================= */}

        <Section id="field" title="Field" classes={['tale-field', 'tale-field__label', 'tale-field__description', 'tale-field__error']}>
          <div style={{ width: '32rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Field.Root className="tale-field">
              <Field.Label className="tale-field__label">Default</Field.Label>
              <Input className="tale-input" placeholder="Type here…" />
              <Field.Description className="tale-field__description">Helper text goes here.</Field.Description>
            </Field.Root>
            <Field.Root className="tale-field" disabled>
              <Field.Label className="tale-field__label">Disabled</Field.Label>
              <Input className="tale-input" disabled placeholder="Cannot edit" />
              <Field.Description className="tale-field__description">This field is disabled.</Field.Description>
            </Field.Root>
            <Field.Root className="tale-field" invalid>
              <Field.Label className="tale-field__label">Invalid</Field.Label>
              <Input className="tale-input" defaultValue="bad value" />
              <Field.Error className="tale-field__error">This field has an error.</Field.Error>
            </Field.Root>
          </div>
        </Section>

        {/* ============================================================= */}
        {/* OTHER */}
        {/* ============================================================= */}

        <Section id="toolbar" title="Toolbar" classes={['tale-toolbar', 'tale-toolbar__button', 'tale-toolbar__separator', 'tale-toolbar__link', 'tale-toolbar__input']}>
          <SubHeading>Default</SubHeading>
          <Toolbar.Root className="tale-toolbar" aria-label="Text formatting">
            <Toolbar.Button className="tale-toolbar__button" aria-label="Bold"><strong>B</strong></Toolbar.Button>
            <Toolbar.Button className="tale-toolbar__button" aria-label="Italic"><em>I</em></Toolbar.Button>
            <Toolbar.Button className="tale-toolbar__button" aria-label="Underline"><u>U</u></Toolbar.Button>
            <Toolbar.Separator className="tale-toolbar__separator" />
            <Toolbar.Button className="tale-toolbar__button" disabled>Undo</Toolbar.Button>
            <Toolbar.Button className="tale-toolbar__button" disabled>Redo</Toolbar.Button>
            <Toolbar.Separator className="tale-toolbar__separator" />
            <Toolbar.Link className="tale-toolbar__link" href="#">Help</Toolbar.Link>
          </Toolbar.Root>
          <SubHeading>With Input</SubHeading>
          <Toolbar.Root className="tale-toolbar" aria-label="Search toolbar" style={{ marginTop: '1.2rem' }}>
            <Toolbar.Button className="tale-toolbar__button">Filter</Toolbar.Button>
            <Toolbar.Button className="tale-toolbar__button">Sort</Toolbar.Button>
            <Toolbar.Separator className="tale-toolbar__separator" />
            <Toolbar.Input className="tale-toolbar__input tale-input" placeholder="Search…" aria-label="Search" />
          </Toolbar.Root>
        </Section>
      </div>
    </div>
  );
}
