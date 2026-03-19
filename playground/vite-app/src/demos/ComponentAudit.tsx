import * as React from 'react';
import { useFilter } from 'react-aria-components';
import '@tale-ui/react-styles/index.css';

// Simple components
import { Button } from '@tale-ui/react/button';
import { Input } from '@tale-ui/react/input';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
import { Separator } from '@tale-ui/react/separator';

// Compound components
import { Checkbox } from '@tale-ui/react/checkbox';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Radio } from '@tale-ui/react/radio';
import { Switch } from '@tale-ui/react/switch';
import { Select } from '@tale-ui/react/select';
import { Autocomplete } from '@tale-ui/react/autocomplete';
import { Combobox } from '@tale-ui/react/combobox';
import { NumberField } from '@tale-ui/react/number-field';
import { Slider } from '@tale-ui/react/slider';
import { Calendar } from '@tale-ui/react/calendar';

// Overlay
import { Dialog } from '@tale-ui/react/dialog';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Popover } from '@tale-ui/react/popover';
import { PreviewCard } from '@tale-ui/react/preview-card';
import { Drawer } from '@tale-ui/react/drawer';
import { Tooltip } from '@tale-ui/react/tooltip';

// Navigation
import { Menu } from '@tale-ui/react/menu';
import { ContextMenu } from '@tale-ui/react/context-menu';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Menubar } from '@tale-ui/react/menubar';

// Layout
import { Accordion } from '@tale-ui/react/accordion';
import { Disclosure } from '@tale-ui/react/disclosure';
import { Tabs } from '@tale-ui/react/tabs';
import { ScrollArea } from '@tale-ui/react/scroll-area';
import { Container } from '@tale-ui/react/container';

// Feedback
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { Meter } from '@tale-ui/react/meter';
// Display
import { Avatar } from '@tale-ui/react/avatar';

// Form Structure
import { Field } from '@tale-ui/react/field';
import { Fieldset } from '@tale-ui/react/fieldset';
import { Form } from '@tale-ui/react/form';

// Other
import { Toolbar } from '@tale-ui/react/toolbar';

// --- Missing components ---

// Additional form controls
import { RadioGroup } from '@tale-ui/react/radio-group';
import { SearchField } from '@tale-ui/react/search-field';
import { TextField } from '@tale-ui/react/text-field';
import { TextArea } from '@tale-ui/react/text-area';

// Date & Time
import { DateField } from '@tale-ui/react/date-field';
import { DatePicker } from '@tale-ui/react/date-picker';
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { TimeField } from '@tale-ui/react/time-field';
import { RangeCalendar } from '@tale-ui/react/range-calendar';

// Color
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorField } from '@tale-ui/react/color-field';
import { ColorPicker } from '@tale-ui/react/color-picker';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorWheel } from '@tale-ui/react/color-wheel';

// Data display
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';
import { GridList } from '@tale-ui/react/grid-list';
import { Link } from '@tale-ui/react/link';
import { Table } from '@tale-ui/react/table';
import { TagGroup } from '@tale-ui/react/tag-group';
import { Tree } from '@tale-ui/react/tree';

// Interaction
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

// Re-export (ToggleGroup = ToggleButtonGroup)
import { ToggleButtonGroup as ToggleGroup } from '@tale-ui/react/toggle-group';

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

// TOC — order matches the content sections below
const TOC = [
  { category: 'Utility', items: [
    { id: 'color-mode-toggle', label: 'ColorModeToggle' },
  ]},
  { category: 'Form Controls', items: [
    { id: 'button', label: 'Button' },
    { id: 'input', label: 'Input' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'checkbox-group', label: 'CheckboxGroup' },
    { id: 'radio', label: 'Radio' },
    { id: 'radio-group', label: 'RadioGroup' },
    { id: 'switch', label: 'Switch' },
    { id: 'toggle-button', label: 'ToggleButton' },
    { id: 'toggle-button-group', label: 'ToggleButtonGroup' },
    { id: 'toggle-group', label: 'ToggleGroup' },
    { id: 'select', label: 'Select' },
    { id: 'autocomplete', label: 'Autocomplete' },
    { id: 'combobox', label: 'Combobox' },
    { id: 'number-field', label: 'NumberField' },
    { id: 'slider', label: 'Slider' },
    { id: 'search-field', label: 'SearchField' },
    { id: 'text-field', label: 'TextField' },
    { id: 'text-area', label: 'TextArea' },
  ]},
  { category: 'Overlay', items: [
    { id: 'dialog', label: 'Dialog' },
    { id: 'alert-dialog', label: 'AlertDialog' },
    { id: 'popover', label: 'Popover' },
    { id: 'preview-card', label: 'PreviewCard' },
    { id: 'drawer', label: 'Drawer' },
    { id: 'tooltip', label: 'Tooltip' },
  ]},
  { category: 'Navigation', items: [
    { id: 'menu', label: 'Menu' },
    { id: 'context-menu', label: 'ContextMenu' },
    { id: 'navigation-menu', label: 'NavigationMenu' },
    { id: 'menubar', label: 'Menubar' },
  ]},
  { category: 'Layout', items: [
    { id: 'accordion', label: 'Accordion' },
    { id: 'disclosure', label: 'Disclosure' },
    { id: 'container', label: 'Container' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'scroll-area', label: 'ScrollArea' },
    { id: 'separator', label: 'Separator' },
  ]},
  { category: 'Feedback', items: [
    { id: 'progress-bar', label: 'ProgressBar' },
    { id: 'meter', label: 'Meter' },
  ]},
  { category: 'Display', items: [
    { id: 'avatar', label: 'Avatar' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'link', label: 'Link' },
    { id: 'grid-list', label: 'GridList' },
    { id: 'table', label: 'Table' },
    { id: 'tag-group', label: 'TagGroup' },
    { id: 'tree', label: 'Tree' },
  ]},
  { category: 'Form Structure', items: [
    { id: 'field', label: 'Field' },
    { id: 'fieldset', label: 'Fieldset' },
    { id: 'form', label: 'Form' },
    { id: 'toolbar', label: 'Toolbar' },
  ]},
  { category: 'Date & Time', items: [
    { id: 'date-field', label: 'DateField' },
    { id: 'time-field', label: 'TimeField' },
    { id: 'date-picker', label: 'DatePicker' },
    { id: 'date-range-picker', label: 'DateRangePicker' },
    { id: 'range-calendar', label: 'RangeCalendar' },
  ]},
  { category: 'Color', items: [
    { id: 'color-area', label: 'ColorArea' },
    { id: 'color-slider', label: 'ColorSlider' },
    { id: 'color-wheel', label: 'ColorWheel' },
    { id: 'color-swatch', label: 'ColorSwatch' },
    { id: 'color-swatch-picker', label: 'ColorSwatchPicker' },
    { id: 'color-field', label: 'ColorField' },
    { id: 'color-picker', label: 'ColorPicker' },
  ]},
  { category: 'Interaction', items: [
    { id: 'drop-zone', label: 'DropZone' },
    { id: 'file-trigger', label: 'FileTrigger' },
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
// Calendar section (react-aria-components)
// ---------------------------------------------------------------------------

function CalendarSection() {
  return (
    <Section
      id="calendar"
      title="Calendar"
      classes={['tale-calendar', 'tale-calendar__grid', 'tale-calendar__grid-header', 'tale-calendar__grid-body', 'tale-calendar__cell', 'tale-calendar__heading', 'tale-calendar__prev-button', 'tale-calendar__next-button']}
    >
      <SubHeading>Interactive</SubHeading>
      <Calendar.Root>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {(date) => <Calendar.Cell date={date} />}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Combobox section (needs state)
// ---------------------------------------------------------------------------

const countries = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece'];

function ComboboxDemo() {
  return (
    <div style={{ width: '28rem' }}>
      <Combobox.Root>
        <Combobox.Input placeholder="Search country…" />
        <Combobox.Popover offset={4}>
          <Combobox.ListBox>
            {countries.map((c) => (
              <Combobox.Item key={c} id={c} textValue={c}>{c}</Combobox.Item>
            ))}
          </Combobox.ListBox>
        </Combobox.Popover>
      </Combobox.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autocomplete section (needs state)
// ---------------------------------------------------------------------------

const cities = ['Amsterdam', 'Berlin', 'Chicago', 'Dublin', 'Edinburgh', 'Florence', 'Geneva', 'Helsinki'];

function AutocompleteDemo() {
  const { contains } = useFilter({ sensitivity: 'base' });
  return (
    <div style={{ width: '28rem' }}>
      <Autocomplete.Root filter={contains}>
        <Autocomplete.SearchField aria-label="Search city">
          <Autocomplete.Input placeholder="Search city…" />
        </Autocomplete.SearchField>
        <Autocomplete.ListBox aria-label="Cities">
          {cities.map((c) => (
            <Autocomplete.Item key={c} id={c} textValue={c}>{c}</Autocomplete.Item>
          ))}
        </Autocomplete.ListBox>
      </Autocomplete.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu with checkbox items (needs state)
// ---------------------------------------------------------------------------

function MenuCheckboxDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Format ▾</Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="Format">
          <Menu.Item textValue="Bold">Bold</Menu.Item>
          <Menu.Item textValue="Italic">Italic</Menu.Item>
          <Menu.Item textValue="Underline">Underline</Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

// ---------------------------------------------------------------------------
// Dialog demo (controlled, matches Storybook patterns)
// ---------------------------------------------------------------------------

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--primary">Open Dialog</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close"><XIcon /></Dialog.Close>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a modal dialog. It traps focus and requires the user to take action.
          </Dialog.Description>
          <div className="tale-dialog__actions">
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Confirm</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// AlertDialog demo (controlled, matches Storybook patterns)
// ---------------------------------------------------------------------------

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialog.Root isOpen={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="tale-button tale-button--danger">Delete Item</AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently delete the item. This action cannot be undone.
            </AlertDialog.Description>
            <div className="tale-alert-dialog__actions">
              <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Main audit page
// ---------------------------------------------------------------------------

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

const CSS_OVERRIDE_KEY = 'tale-ui-audit-css-override';

export default function ComponentAudit() {
  const [cssOverride, setCssOverride] = React.useState(() => {
    try { return localStorage.getItem(CSS_OVERRIDE_KEY) ?? ''; } catch { return ''; }
  });
  const [panelOpen, setPanelOpen] = React.useState(() => cssOverride.length > 0);

  // Extract .color-* and .neutral-* class names from pasted CSS so we can
  // apply them to the wrapper element (the Scale app scopes overrides to these).
  const themeClasses = React.useMemo(() => {
    const classes = new Set<string>();
    const re = /\.(color-[a-z][\w-]*|neutral-[a-z][\w-]*)\b/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(cssOverride))) classes.add(m[1]);
    return [...classes].join(' ');
  }, [cssOverride]);

  React.useEffect(() => {
    const STYLE_ID = 'tale-ui-css-override';
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = cssOverride;
    try { localStorage.setItem(CSS_OVERRIDE_KEY, cssOverride); } catch { /* quota */ }
    return () => { el?.remove(); };
  }, [cssOverride]);

  // Apply detected theme classes (.color-*, .neutral-*) to <html> so the
  // overridden tokens affect the page background and everything else.
  React.useEffect(() => {
    const root = document.documentElement;
    const classes = themeClasses.split(' ').filter(Boolean);
    classes.forEach(c => root.classList.add(c));
    return () => { classes.forEach(c => root.classList.remove(c)); };
  }, [themeClasses]);

  return (
    <>
    {/* CSS Override Panel */}
    <div style={{
      marginBottom: '1.6rem',
      border: '1px solid var(--neutral-20)',
      borderRadius: '0.6rem',
      background: 'var(--neutral-10)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setPanelOpen(p => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          width: '100%',
          padding: '0.8rem 1.2rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: 'var(--label-font-family)',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: 'var(--neutral-70)',
          textAlign: 'left' as const,
        }}
      >
        <span style={{ transform: panelOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s', display: 'inline-block' }}>
          &#9654;
        </span>
        CSS Override
        {cssOverride.trim() && <span style={{ fontSize: '1rem', color: 'var(--neutral-50)', fontWeight: 400 }}>(active)</span>}
      </button>

      {panelOpen && (
        <div style={{ padding: '0 1.2rem 1.2rem' }}>
          <textarea
            value={cssOverride}
            onChange={e => setCssOverride(e.target.value)}
            placeholder={'Paste CSS from Scale app here…\ne.g. :root { --red-60: #e53e3e; }\n     .color-red { --brand-60: var(--red-60); }'}
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: '12rem',
              padding: '1rem',
              border: '1px solid var(--neutral-20)',
              borderRadius: '0.4rem',
              background: 'var(--neutral-5)',
              color: 'var(--neutral-90)',
              fontFamily: 'var(--mono-font-family)',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
            <button
              onClick={() => setCssOverride('')}
              style={{
                padding: '0.4rem 1rem',
                border: '1px solid var(--neutral-20)',
                borderRadius: '0.4rem',
                background: 'var(--neutral-14)',
                color: 'var(--neutral-70)',
                fontFamily: 'var(--label-font-family)',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>

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
        {/* UTILITY */}
        {/* ============================================================= */}

        <Section id="color-mode-toggle" title="ColorModeToggle" classes={['tale-color-mode-toggle']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <ColorModeToggle />
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <ColorModeToggle isDisabled />
          </Row>
        </Section>

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
            <Input.Input size="sm" placeholder="Small input" />
            <Input.Input placeholder="Medium input (default)" />
            <Input.Input size="lg" placeholder="Large input" />
          </div>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '28rem' }}>
            <Input.Input placeholder="Default" />
            <Input.Input defaultValue="With value" />
            <Input.Input disabled placeholder="Disabled" />
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
                <Checkbox.Root defaultSelected={checked} isDisabled={disabled}>
                  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <span style={labelStyle}>{label}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Checkbox.Root isIndeterminate>
                <Checkbox.Indicator><MinusIcon /></Checkbox.Indicator>
              </Checkbox.Root>
              <span style={labelStyle}>Indeterminate</span>
            </div>
          </div>
        </Section>

        <Section id="checkbox-group" title="CheckboxGroup" classes={['tale-checkbox-group']}>
          <SubHeading>Default</SubHeading>
          <CheckboxGroup aria-label="Interests">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Reading', 'Gaming', 'Cooking'].map((label) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Checkbox.Root>
                    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                  </Checkbox.Root>
                  <span style={labelStyle}>{label}</span>
                </div>
              ))}
            </div>
          </CheckboxGroup>
          <SubHeading>Disabled</SubHeading>
          <CheckboxGroup aria-label="Disabled group" isDisabled>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Option A', 'Option B'].map((label) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Checkbox.Root isDisabled>
                    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                  </Checkbox.Root>
                  <span style={labelStyle}>{label}</span>
                </div>
              ))}
            </div>
          </CheckboxGroup>
        </Section>

        <Section id="radio" title="Radio" classes={['tale-radio', 'tale-radio__indicator', 'tale-radio--sm', 'tale-radio--lg']}>
          <SubHeading>States</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <Radio.Group aria-label="Radio states">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <Radio.Root value="unchecked">
                  <Radio.Indicator />
                </Radio.Root>
                <span style={labelStyle}>Unchecked</span>
              </div>
            </Radio.Group>
            <Radio.Group value="checked" aria-label="Checked demo">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Radio.Root value="checked">
                  <Radio.Indicator />
                </Radio.Root>
                <span style={labelStyle}>Checked</span>
              </div>
            </Radio.Group>
            <Radio.Group aria-label="Disabled demo" isDisabled>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Radio.Root value="disabled">
                  <Radio.Indicator />
                </Radio.Root>
                <span style={labelStyle}>Disabled</span>
              </div>
            </Radio.Group>
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
                <Switch.Root defaultSelected={checked} isDisabled={disabled}>
                  <Switch.Thumb />
                </Switch.Root>
                <span style={labelStyle}>{label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="toggle-button" title="ToggleButton" classes={['tale-toggle-button', 'tale-toggle-button--sm', 'tale-toggle-button--md', 'tale-toggle-button--lg']}>
          <SubHeading>Sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <ToggleButton key={size} size={size}>{size.toUpperCase()}</ToggleButton>
            ))}
          </Row>
          <SubHeading>States</SubHeading>
          <Row>
            <ToggleButton size="md">Unpressed</ToggleButton>
            <ToggleButton size="md" defaultSelected>Pressed</ToggleButton>
            <ToggleButton size="md" isDisabled>Disabled</ToggleButton>
          </Row>
        </Section>

        <Section id="toggle-button-group" title="ToggleButtonGroup" classes={['tale-toggle-button-group']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <ToggleButtonGroup aria-label="Text alignment">
              <ToggleButton size="md">Left</ToggleButton>
              <ToggleButton size="md" defaultSelected>Center</ToggleButton>
              <ToggleButton size="md">Right</ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </Section>

        <Section id="select" title="Select" classes={['tale-select__trigger', 'tale-select__value', 'tale-select__icon', 'tale-select__popup', 'tale-select__list', 'tale-select__item', 'tale-select__group-label', 'tale-select__separator']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  {fruits.map((fruit) => (
                    <Select.Item key={fruit} id={fruit.toLowerCase()} textValue={fruit}>{fruit}</Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Select.Root isDisabled placeholder="Disabled select">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
            </Select.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Label>Fruit</Select.Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  {fruits.map((fruit) => (
                    <Select.Item key={fruit} id={fruit.toLowerCase()} textValue={fruit}>{fruit}</Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
          <SubHeading>With Groups</SubHeading>
          <Row>
            <Select.Root placeholder="Select a country…">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  <Select.Section>
                    <Select.Header>Europe</Select.Header>
                    {['France', 'Germany', 'Spain'].map((c) => (
                      <Select.Item key={c} id={c.toLowerCase()} textValue={c}>{c}</Select.Item>
                    ))}
                  </Select.Section>
                  <Select.Separator />
                  <Select.Section>
                    <Select.Header>Americas</Select.Header>
                    {['Brazil', 'Canada', 'Mexico'].map((c) => (
                      <Select.Item key={c} id={c.toLowerCase()} textValue={c}>{c}</Select.Item>
                    ))}
                  </Select.Section>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
        </Section>

        <Section id="autocomplete" title="Autocomplete" classes={['tale-combobox__input', 'tale-combobox__popup', 'tale-combobox__item', 'tale-combobox__empty']}>
          <SubHeading>Default</SubHeading>
          <AutocompleteDemo />
        </Section>

        <Section id="combobox" title="Combobox" classes={['tale-combobox__input', 'tale-combobox__popup', 'tale-combobox__item', 'tale-combobox__empty']}>
          <SubHeading>Default</SubHeading>
          <ComboboxDemo />
          <SubHeading>With Label</SubHeading>
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Combobox.Root>
              <Combobox.Label>Country</Combobox.Label>
              <Combobox.Input placeholder="Search country…" />
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  {countries.slice(0, 8).map((c) => (
                    <Combobox.Item key={c} id={c} textValue={c}>{c}</Combobox.Item>
                  ))}
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
        </Section>

        <Section id="number-field" title="NumberField" classes={['tale-number-field', 'tale-number-field__group', 'tale-number-field__input', 'tale-number-field__decrement', 'tale-number-field__increment']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <NumberField.Root defaultValue={0} minValue={0} maxValue={100}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <NumberField.Root isDisabled defaultValue={42}>
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
          <div style={{ width: '28rem', marginBottom: '2rem' }}>
            <Slider.Root defaultValue={[40]}>
              <Slider.Label>Volume</Slider.Label>
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
            <Slider.Root isDisabled defaultValue={[60]}>
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
            <DialogDemo />
          </Row>
        </Section>

        <Section id="alert-dialog" title="AlertDialog" classes={['tale-alert-dialog__backdrop', 'tale-alert-dialog__popup', 'tale-alert-dialog__title', 'tale-alert-dialog__description', 'tale-alert-dialog__actions']}>
          <Row>
            <AlertDialogDemo />
          </Row>
        </Section>

        <Section id="popover" title="Popover" classes={['tale-popover__popup', 'tale-popover__title', 'tale-popover__description', 'tale-popover__close']}>
          <SubHeading>All sides</SubHeading>
          <Row style={{ gap: '1.2rem', padding: '4rem 0' }}>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Popover.Root key={side}>
                <Popover.Trigger>{side}</Popover.Trigger>
                <Popover.Popup placement={side} offset={8}>
                  <Popover.Close aria-label="Close"><XIconSm /></Popover.Close>
                  <Popover.Title>Popover ({side})</Popover.Title>
                  <Popover.Description>
                    Appears on the {side}.
                  </Popover.Description>
                </Popover.Popup>
              </Popover.Root>
            ))}
          </Row>
        </Section>

        <Section id="preview-card" title="PreviewCard" classes={['tale-preview-card', 'tale-preview-card__trigger', 'tale-preview-card__popup']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
              <PreviewCard.Popup>
                <PreviewCard.Content>
                  <div style={{ padding: '1.6rem', maxWidth: '28rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--label-font-family)' }}>Preview Card</strong>
                    <p style={{ margin: 0, color: 'var(--neutral-60)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-s-font-size)' }}>
                      A card that appears on hover to show a preview of linked content.
                    </p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </Row>
        </Section>

        <Section id="drawer" title="Drawer" classes={['tale-drawer', 'tale-drawer__trigger', 'tale-drawer__popup', 'tale-drawer__backdrop', 'tale-drawer__title', 'tale-drawer__description', 'tale-drawer__close']}>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.Description>
                  A drawer panel for side or bottom content.
                </Drawer.Description>
                <div style={{ marginTop: 'var(--space-m)', display: 'flex', gap: 'var(--space-xs)' }}>
                  <Drawer.Close className="tale-button tale-button--neutral" style={{ flex: 1 }}>Cancel</Drawer.Close>
                  <Drawer.Close className="tale-button tale-button--primary" style={{ flex: 1 }}>Confirm</Drawer.Close>
                </div>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
        </Section>

        <Section id="tooltip" title="Tooltip" classes={['tale-tooltip__popup', 'tale-tooltip__arrow']}>
          <SubHeading>All sides</SubHeading>
          <Row style={{ padding: '4rem 0' }}>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger>Hover ({side})</Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={8}>Appears on the {side}</Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>With arrows</SubHeading>
          <Row style={{ padding: '4rem 0' }}>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger>Arrow ({side})</Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={4}>
                  <Tooltip.Arrow />
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* NAVIGATION */}
        {/* ============================================================= */}

        <Section id="menu" title="Menu" classes={['tale-menu__popup', 'tale-menu__item', 'tale-menu__separator', 'tale-menu__group-label', 'tale-menu__trigger', 'tale-menu__popover']}>
          <SubHeading>Basic</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options ▾</Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Options">
                  <Menu.Item textValue="Edit">Edit</Menu.Item>
                  <Menu.Item textValue="Duplicate">Duplicate</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item textValue="Share">Share</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item textValue="Delete">Delete</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>With Group Labels</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Account ▾</Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Account">
                  <Menu.Group>
                    <Menu.Header>Account</Menu.Header>
                    <Menu.Item textValue="Profile">Profile</Menu.Item>
                    <Menu.Item textValue="Settings">Settings</Menu.Item>
                  </Menu.Group>
                  <Menu.Separator />
                  <Menu.Group>
                    <Menu.Header>Danger Zone</Menu.Header>
                    <Menu.Item textValue="Sign out">Sign out</Menu.Item>
                  </Menu.Group>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>Format Menu</SubHeading>
          <Row>
            <MenuCheckboxDemo />
          </Row>
        </Section>

        <Section id="context-menu" title="ContextMenu" classes={['tale-context-menu', 'tale-context-menu__trigger', 'tale-context-menu__item', 'tale-context-menu__separator']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div style={{ padding: 'var(--space-l)', border: '2px dashed var(--neutral-30)', borderRadius: 'var(--space-2xs)', textAlign: 'center', color: 'var(--neutral-60)', fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)' }}>
                  Right-click this area
                </div>
              </ContextMenu.Trigger>
              <ContextMenu.Popup aria-label="Context menu">
                <ContextMenu.MenuList aria-label="Context menu">
                  <ContextMenu.Item textValue="Cut">Cut</ContextMenu.Item>
                  <ContextMenu.Item textValue="Copy">Copy</ContextMenu.Item>
                  <ContextMenu.Item textValue="Paste">Paste</ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item textValue="Delete">Delete</ContextMenu.Item>
                </ContextMenu.MenuList>
              </ContextMenu.Popup>
            </ContextMenu.Root>
          </Row>
        </Section>

        <Section id="navigation-menu" title="NavigationMenu" classes={['tale-navigation-menu', 'tale-navigation-menu__list', 'tale-navigation-menu__item', 'tale-navigation-menu__trigger', 'tale-navigation-menu__link']}>
          <SubHeading>Default</SubHeading>
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Products</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">About</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </Section>

        <Section id="menubar" title="Menubar" classes={['tale-menubar']}>
          <SubHeading>Default</SubHeading>
          <Menubar.Root>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>File</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="File">
                    <Menu.Item textValue="New">New</Menu.Item>
                    <Menu.Item textValue="Open">Open</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item textValue="Save">Save</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>Edit</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="Edit">
                    <Menu.Item textValue="Undo">Undo</Menu.Item>
                    <Menu.Item textValue="Redo">Redo</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item textValue="Cut">Cut</Menu.Item>
                    <Menu.Item textValue="Copy">Copy</Menu.Item>
                    <Menu.Item textValue="Paste">Paste</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>View</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="View">
                    <Menu.Item textValue="Zoom In">Zoom In</Menu.Item>
                    <Menu.Item textValue="Zoom Out">Zoom Out</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item textValue="Full Screen">Full Screen</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
          </Menubar.Root>
        </Section>

        {/* ============================================================= */}
        {/* LAYOUT */}
        {/* ============================================================= */}

        <Section id="accordion" title="Accordion" classes={['tale-accordion', 'tale-accordion__item', 'tale-accordion__trigger', 'tale-accordion__trigger-icon', 'tale-accordion__panel']}>
          <div style={{ width: '48rem' }}>
            <Accordion.Root defaultExpandedKeys={['a']}>
              {[
                { id: 'a', title: 'What is Tale UI?', content: 'Tale UI is a styled component library providing accessible headless components with opinionated CSS via @tale-ui/core design tokens.' },
                { id: 'b', title: 'How does styling work?', content: 'Styling lives in @tale-ui/react-styles. Components are headless — you apply CSS classes like .tale-button.' },
                { id: 'c', title: 'Can I use dark mode?', content: 'Yes! Set data-color-mode="dark" on the <html> element. Tokens auto-invert.' },
              ].map(({ id, title, content }) => (
                <Accordion.Item key={id} id={id}>
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

        <Section id="disclosure" title="Disclosure" classes={['tale-disclosure', 'tale-disclosure__trigger', 'tale-disclosure__panel']}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', width: '36rem' }}>
            <Disclosure.Root defaultExpanded>
              <Disclosure.Trigger>Open by default</Disclosure.Trigger>
              <Disclosure.Panel>
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is visible by default.
                </div>
              </Disclosure.Panel>
            </Disclosure.Root>
            <Disclosure.Root>
              <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
              <Disclosure.Panel>
                <div style={{ padding: '1.2rem 0', color: 'var(--neutral-70)', fontFamily: 'var(--body-font-family)', fontSize: 'var(--text-m-font-size)' }}>
                  This content is hidden by default.
                </div>
              </Disclosure.Panel>
            </Disclosure.Root>
            <Disclosure.Root isDisabled>
              <Disclosure.Trigger>Disabled</Disclosure.Trigger>
              <Disclosure.Panel>
                <div style={{ padding: '1.2rem 0' }}>Content</div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
        </Section>

        <Section id="container" title="Container" classes={[]}>
          <SubHeading>Color overrides</SubHeading>
          <Row>
            {(['brand', 'red', 'indigo', 'green', 'random'] as const).map((color) => (
              <Container key={color} color={color} style={{ padding: '1.6rem 2.4rem', borderRadius: '0.8rem', background: 'var(--color-10)', border: '1px solid var(--color-20)' }}>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--color-70)' }}>{color}</span>
              </Container>
            ))}
          </Row>
        </Section>

        <Section id="tabs" title="Tabs" classes={['tale-tabs', 'tale-tabs__list', 'tale-tabs__tab', 'tale-tabs__panel', 'tale-tabs__indicator']}>
          <SubHeading>Horizontal</SubHeading>
          <div style={{ width: '48rem', marginBottom: '2rem' }}>
            <Tabs.Root defaultSelectedKey="overview">
              <Tabs.List>
                <Tabs.Tab id="overview">Overview</Tabs.Tab>
                <Tabs.Tab id="features">Features</Tabs.Tab>
                <Tabs.Tab id="disabled-tab" isDisabled>Disabled</Tabs.Tab>
                <Tabs.Tab id="docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="overview">Overview content goes here.</Tabs.Panel>
              <Tabs.Panel id="features">Features list.</Tabs.Panel>
              <Tabs.Panel id="disabled-tab">Disabled tab content.</Tabs.Panel>
              <Tabs.Panel id="docs">Documentation.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div style={{ width: '48rem', height: '20rem' }}>
            <Tabs.Root defaultSelectedKey="overview2" orientation="vertical">
              <Tabs.List>
                <Tabs.Tab id="overview2">Overview</Tabs.Tab>
                <Tabs.Tab id="features2">Features</Tabs.Tab>
                <Tabs.Tab id="docs2">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="overview2">Overview content.</Tabs.Panel>
              <Tabs.Panel id="features2">Features.</Tabs.Panel>
              <Tabs.Panel id="docs2">Docs.</Tabs.Panel>
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

        <Section id="progress-bar" title="ProgressBar" classes={['tale-progress-bar', 'tale-progress-bar__track', 'tale-progress-bar__indicator', 'tale-progress-bar__value']}>
          <div style={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { label: '20%', value: 20 },
              { label: '60%', value: 60 },
              { label: '100% (Complete)', value: 100 },
              { label: 'Indeterminate', value: null },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>{label}</span>
                <ProgressBar.Root {...(value == null ? { isIndeterminate: true } : { value })}>
                  <ProgressBar.Track>
                    <ProgressBar.Indicator {...(value == null ? {} : { value })} />
                  </ProgressBar.Track>
                </ProgressBar.Root>
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
                    <Meter.Indicator value={value} />
                  </Meter.Track>
                </Meter.Root>
              </div>
            ))}
          </div>
        </Section>


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
              <Input.Input placeholder="Type here…" />
              <Field.Description>Helper text goes here.</Field.Description>
            </Field.Root>
            <Field.Root data-disabled>
              <Field.Label>Disabled</Field.Label>
              <Input.Input disabled placeholder="Cannot edit" />
              <Field.Description>This field is disabled.</Field.Description>
            </Field.Root>
            <Field.Root data-invalid>
              <Field.Label>Invalid</Field.Label>
              <Input.Input defaultValue="bad value" />
              <Field.Error>This field has an error.</Field.Error>
            </Field.Root>
          </div>
        </Section>

        <Section id="fieldset" title="Fieldset" classes={['tale-fieldset', 'tale-fieldset__legend']}>
          <SubHeading>Default</SubHeading>
          <Fieldset.Root>
            <Fieldset.Legend>Personal Information</Fieldset.Legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingTop: '1.2rem' }}>
              <Field.Root>
                <Field.Label>First name</Field.Label>
                <Input.Input placeholder="John" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Last name</Field.Label>
                <Input.Input placeholder="Doe" />
              </Field.Root>
            </div>
          </Fieldset.Root>
        </Section>

        <Section id="form" title="Form" classes={['tale-form']}>
          <SubHeading>Default</SubHeading>
          <Form style={{ width: '32rem', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input.Input type="email" placeholder="you@example.com" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input.Input type="password" placeholder="Enter password" />
            </Field.Root>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
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

        {/* ============================================================= */}
        {/* ADDITIONAL FORM CONTROLS                                       */}
        {/* ============================================================= */}

        <Section id="radio-group" title="RadioGroup" classes={['tale-radio']}>
          <SubHeading>Standalone RadioGroup</SubHeading>
          <RadioGroup aria-label="Favourite colour" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Red', 'Green', 'Blue'].map((c) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Radio.Root value={c.toLowerCase()}>
                  <Radio.Indicator />
                </Radio.Root>
                <span style={labelStyle}>{c}</span>
              </div>
            ))}
          </RadioGroup>
        </Section>

        <Section id="toggle-group" title="ToggleGroup" classes={['tale-toggle-button-group']}>
          <SubHeading>Default (re‑export of ToggleButtonGroup)</SubHeading>
          <Row>
            <ToggleGroup aria-label="Text style">
              <ToggleButton size="md">Bold</ToggleButton>
              <ToggleButton size="md">Italic</ToggleButton>
              <ToggleButton size="md">Underline</ToggleButton>
            </ToggleGroup>
          </Row>
        </Section>

        <Section id="search-field" title="SearchField" classes={['tale-search-field', 'tale-search-field__input', 'tale-search-field__clear']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <SearchField.Root>
              <SearchField.Label>Search</SearchField.Label>
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton>
                <XIconSm />
              </SearchField.ClearButton>
            </SearchField.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div style={{ width: '28rem' }}>
            <SearchField.Root isDisabled>
              <SearchField.Input placeholder="Disabled search" />
            </SearchField.Root>
          </div>
        </Section>

        <Section id="text-field" title="TextField" classes={['tale-text-field__input']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <TextField.Root>
              <TextField.Label>Name</TextField.Label>
              <TextField.Input placeholder="Enter name…" />
              <TextField.Description>Your full name.</TextField.Description>
            </TextField.Root>
            <TextField.Root isDisabled>
              <TextField.Label>Disabled</TextField.Label>
              <TextField.Input placeholder="Cannot edit" />
            </TextField.Root>
          </div>
        </Section>

        <Section id="text-area" title="TextArea" classes={['tale-text-area', 'tale-text-area__textarea']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <TextArea.Root>
              <TextArea.Label>Bio</TextArea.Label>
              <TextArea.TextArea placeholder="Tell us about yourself…" />
              <TextArea.Description>Max 200 characters.</TextArea.Description>
            </TextArea.Root>
            <TextArea.Root isDisabled>
              <TextArea.Label>Disabled</TextArea.Label>
              <TextArea.TextArea placeholder="Cannot edit" />
            </TextArea.Root>
          </div>
        </Section>

        {/* ============================================================= */}
        {/* DISPLAY (additional)                                           */}
        {/* ============================================================= */}

        <Section id="breadcrumbs" title="Breadcrumbs" classes={['tale-breadcrumbs', 'tale-breadcrumbs__item', 'tale-breadcrumbs__link']}>
          <SubHeading>Default</SubHeading>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item><Breadcrumbs.Link href="#">Home</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="#">Products</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link>Current Page</Breadcrumbs.Link></Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </Section>

        <Section id="link" title="Link" classes={['tale-link']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <Link href="#">Default link</Link>
            <Link href="#" isDisabled>Disabled link</Link>
          </Row>
        </Section>

        <Section id="grid-list" title="GridList" classes={['tale-grid-list', 'tale-grid-list__item']}>
          <SubHeading>Default</SubHeading>
          <GridList.Root aria-label="Items" selectionMode="multiple" style={{ width: '32rem' }}>
            {['Item One', 'Item Two', 'Item Three', 'Item Four'].map((item) => (
              <GridList.Item key={item} id={item}>{item}</GridList.Item>
            ))}
          </GridList.Root>
        </Section>

        <Section id="table" title="Table" classes={['tale-table', 'tale-table__header', 'tale-table__column', 'tale-table__body', 'tale-table__row', 'tale-table__cell']}>
          <SubHeading>Default</SubHeading>
          <Table.Root aria-label="People" style={{ width: '48rem' }}>
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Section>

        <Section id="tag-group" title="TagGroup" classes={['tale-tag-group', 'tale-tag-group__list', 'tale-tag-group__tag', 'tale-tag-group__label']}>
          <SubHeading>Default</SubHeading>
          <TagGroup.Root>
            <TagGroup.Label>Categories</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="react">React</TagGroup.Tag>
              <TagGroup.Tag id="css">CSS</TagGroup.Tag>
              <TagGroup.Tag id="design">Design</TagGroup.Tag>
              <TagGroup.Tag id="a11y">Accessibility</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
          <SubHeading>Removable</SubHeading>
          <TagGroup.Root onRemove={() => {}}>
            <TagGroup.Label>Skills</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="ts">TypeScript</TagGroup.Tag>
              <TagGroup.Tag id="node">Node.js</TagGroup.Tag>
              <TagGroup.Tag id="gql">GraphQL</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
        </Section>

        <Section id="tree" title="Tree" classes={['tale-tree', 'tale-tree__item', 'tale-tree__item-content']}>
          <SubHeading>Default</SubHeading>
          <Tree.Root aria-label="File browser" style={{ width: '32rem' }}>
            <Tree.Item id="src" textValue="src">
              <Tree.ItemContent>src/</Tree.ItemContent>
              <Tree.Item id="components" textValue="components">
                <Tree.ItemContent>components/</Tree.ItemContent>
                <Tree.Item id="button" textValue="Button.tsx">
                  <Tree.ItemContent>Button.tsx</Tree.ItemContent>
                </Tree.Item>
                <Tree.Item id="input" textValue="Input.tsx">
                  <Tree.ItemContent>Input.tsx</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
              <Tree.Item id="utils" textValue="utils">
                <Tree.ItemContent>utils/</Tree.ItemContent>
                <Tree.Item id="helpers" textValue="helpers.ts">
                  <Tree.ItemContent>helpers.ts</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
        </Section>

        {/* ============================================================= */}
        {/* DATE & TIME                                                    */}
        {/* ============================================================= */}

        <Section id="date-field" title="DateField" classes={['tale-date-field']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <DateField.Root>
              <DateField.Label>Date</DateField.Label>
              <DateField.DateInput>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.DateInput>
            </DateField.Root>
            <DateField.Root isDisabled>
              <DateField.Label>Disabled</DateField.Label>
              <DateField.DateInput>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.DateInput>
            </DateField.Root>
          </div>
        </Section>

        <Section id="time-field" title="TimeField" classes={['tale-time-field']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <TimeField.Root>
              <TimeField.Label>Time</TimeField.Label>
              <TimeField.DateInput>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.DateInput>
            </TimeField.Root>
            <TimeField.Root isDisabled>
              <TimeField.Label>Disabled</TimeField.Label>
              <TimeField.DateInput>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.DateInput>
            </TimeField.Root>
          </div>
        </Section>

        <Section id="date-picker" title="DatePicker" classes={['tale-date-picker']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem' }}>
            <DatePicker.Root>
              <DatePicker.Label>Date</DatePicker.Label>
              <DatePicker.Group>
                <DatePicker.DateInput>
                  {(segment) => <DatePicker.Segment segment={segment} />}
                </DatePicker.DateInput>
                <DatePicker.Trigger>📅</DatePicker.Trigger>
              </DatePicker.Group>
              <DatePicker.Popover>
                <DatePicker.Dialog>
                  <Calendar.Root>
                    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
                      <Calendar.PreviousButton />
                      <Calendar.Heading />
                      <Calendar.NextButton />
                    </header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar.Root>
                </DatePicker.Dialog>
              </DatePicker.Popover>
            </DatePicker.Root>
          </div>
        </Section>

        <Section id="date-range-picker" title="DateRangePicker" classes={['tale-date-range-picker']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '36rem' }}>
            <DateRangePicker.Root>
              <DateRangePicker.Label>Trip dates</DateRangePicker.Label>
              <DateRangePicker.Group>
                <DateRangePicker.StartDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.StartDate>
                <span aria-hidden="true" style={{ padding: '0 0.4rem' }}>–</span>
                <DateRangePicker.EndDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.EndDate>
                <DateRangePicker.Trigger>📅</DateRangePicker.Trigger>
              </DateRangePicker.Group>
              <DateRangePicker.Popover>
                <DateRangePicker.Dialog>
                  <RangeCalendar.Root>
                    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
                      <RangeCalendar.PreviousButton />
                      <RangeCalendar.Heading />
                      <RangeCalendar.NextButton />
                    </header>
                    <RangeCalendar.Grid>
                      <RangeCalendar.GridHeader>
                        {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
                      </RangeCalendar.GridHeader>
                      <RangeCalendar.GridBody>
                        {(date) => <RangeCalendar.Cell date={date} />}
                      </RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                  </RangeCalendar.Root>
                </DateRangePicker.Dialog>
              </DateRangePicker.Popover>
            </DateRangePicker.Root>
          </div>
        </Section>

        <Section id="range-calendar" title="RangeCalendar" classes={['tale-range-calendar__heading', 'tale-range-calendar__grid', 'tale-range-calendar__grid-header', 'tale-range-calendar__grid-body', 'tale-range-calendar__cell']}>
          <SubHeading>Interactive</SubHeading>
          <RangeCalendar.Root>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-3xs)', marginBottom: 'var(--space-2xs)' }}>
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar.Root>
        </Section>

        {/* ============================================================= */}
        {/* COLOR                                                          */}
        {/* ============================================================= */}

        <Section id="color-area" title="ColorArea" classes={['tale-color-area']}>
          <SubHeading>Default</SubHeading>
          <ColorArea.Root defaultValue="hsl(0, 100%, 50%)" style={{ width: '20rem', height: '20rem' }}>
            <ColorArea.Thumb />
          </ColorArea.Root>
        </Section>

        <Section id="color-slider" title="ColorSlider" classes={['tale-color-slider', 'tale-color-slider__label', 'tale-color-slider__output', 'tale-color-slider__track', 'tale-color-slider__thumb']}>
          <SubHeading>Hue</SubHeading>
          <div style={{ width: '28rem' }}>
            <ColorSlider.Root channel="hue" defaultValue="hsl(0, 100%, 50%)">
              <ColorSlider.Label />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
              <ColorSlider.Output />
            </ColorSlider.Root>
          </div>
        </Section>

        <Section id="color-wheel" title="ColorWheel" classes={['tale-color-wheel', 'tale-color-wheel__track']}>
          <SubHeading>Default</SubHeading>
          <ColorWheel.Root defaultValue="hsl(0, 100%, 50%)" outerRadius={100} innerRadius={70}>
            <ColorWheel.Track />
            <ColorWheel.Thumb />
          </ColorWheel.Root>
        </Section>

        <Section id="color-swatch" title="ColorSwatch" classes={['tale-color-swatch']}>
          <SubHeading>Default</SubHeading>
          <Row>
            {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((color) => (
              <ColorSwatch key={color} color={color} />
            ))}
          </Row>
        </Section>

        <Section id="color-swatch-picker" title="ColorSwatchPicker" classes={['tale-color-swatch-picker', 'tale-color-swatch-picker__item']}>
          <SubHeading>Default</SubHeading>
          <ColorSwatchPicker.Root>
            {['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'].map((color) => (
              <ColorSwatchPicker.Item key={color} color={color}>
                <ColorSwatch color={color} />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
        </Section>

        <Section id="color-field" title="ColorField" classes={['tale-color-field', 'tale-color-field__input', 'tale-color-field__description', 'tale-color-field__error']}>
          <SubHeading>Default</SubHeading>
          <div style={{ width: '28rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <ColorField.Root defaultValue="#ff0000">
              <ColorField.Label>Color</ColorField.Label>
              <ColorField.Input />
              <ColorField.Description>Enter a hex colour value.</ColorField.Description>
            </ColorField.Root>
            <ColorField.Root isDisabled defaultValue="#cccccc">
              <ColorField.Label>Disabled</ColorField.Label>
              <ColorField.Input />
            </ColorField.Root>
          </div>
        </Section>

        <Section id="color-picker" title="ColorPicker" classes={[]}>
          <SubHeading>Default (headless provider)</SubHeading>
          <ColorPicker.Root defaultValue="hsl(200, 100%, 50%)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '20rem' }}>
              <ColorArea.Root style={{ width: '20rem', height: '20rem' }}>
                <ColorArea.Thumb />
              </ColorArea.Root>
              <ColorSlider.Root channel="hue">
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider.Root>
              <ColorSlider.Root channel="alpha">
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider.Root>
            </div>
          </ColorPicker.Root>
        </Section>

        {/* ============================================================= */}
        {/* INTERACTION                                                    */}
        {/* ============================================================= */}

        <Section id="drop-zone" title="DropZone" classes={['tale-drop-zone']}>
          <SubHeading>Default</SubHeading>
          <DropZone onDrop={() => {}}>
            <div style={{ padding: '3.2rem 4.8rem', textAlign: 'center', fontFamily: 'var(--label-font-family)', fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-50)' }}>
              Drop files here
            </div>
          </DropZone>
        </Section>

        <Section id="file-trigger" title="FileTrigger" classes={[]}>
          <SubHeading>Default</SubHeading>
          <Row>
            <FileTrigger onSelect={() => {}}>
              <Button variant="neutral">Choose file…</Button>
            </FileTrigger>
          </Row>
        </Section>

      </div>
    </div>
    </>
  );
}
