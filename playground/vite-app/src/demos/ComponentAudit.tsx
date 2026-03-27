import * as React from 'react';
import { useFilter, parseColor } from 'react-aria-components';
import type { SortDescriptor } from 'react-aria-components';
import '@tale-ui/react-styles/index.css';
import './ComponentAudit.css';

// Simple components
import { Button } from '@tale-ui/react/button';
import { IconButton } from '@tale-ui/react/icon-button';
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
import { Carousel } from '@tale-ui/react/carousel';
import { Accordion } from '@tale-ui/react/accordion';
import { Disclosure } from '@tale-ui/react/disclosure';
import { Tabs } from '@tale-ui/react/tabs';
import { ScrollArea } from '@tale-ui/react/scroll-area';
import { Container } from '@tale-ui/react/container';

// Feedback
import { Banner } from '@tale-ui/react/banner';
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { Meter } from '@tale-ui/react/meter';
import { Spinner } from '@tale-ui/react/spinner';
// Display
import { Avatar } from '@tale-ui/react/avatar';
import { EmptyState } from '@tale-ui/react/empty-state';

// Form Structure
import { Field } from '@tale-ui/react/field';
import { Fieldset } from '@tale-ui/react/fieldset';
import { Form } from '@tale-ui/react/form';

// Other
import { Toolbar } from '@tale-ui/react/toolbar';
import { Icon } from '@tale-ui/react/icon';
import {
  Heart,
  Star,
  Bell,
  Settings,
  Search,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Mail,
  User,
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Check,
  Minus as MinusLucide,
  X as XLucide,
} from 'lucide-react';

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
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorWheel } from '@tale-ui/react/color-wheel';

// Data display
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';
import { GridList } from '@tale-ui/react/grid-list';
import { Link } from '@tale-ui/react/link';
import { Pagination } from '@tale-ui/react/pagination';
import { PinInput } from '@tale-ui/react/pin-input';
import { Table } from '@tale-ui/react/table';
import { TagGroup } from '@tale-ui/react/tag-group';
import { Tree } from '@tale-ui/react/tree';

// Interaction
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

// New components
import { Badge } from '@tale-ui/react/badge';
import { DotIcon } from '@tale-ui/react/dot-icon';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { RatingStars } from '@tale-ui/react/rating-stars';
import { RatingBadge } from '@tale-ui/react/rating-badge';
import { SelectNative } from '@tale-ui/react/select-native';
import { AppStoreButton } from '@tale-ui/react/app-store-button';
import { SocialButton } from '@tale-ui/react/social-button';
import { PaymentInput } from '@tale-ui/react/payment-input';


// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function Section({ id, title, classes, children }: { id: string; title: string; classes: string[]; children: React.ReactNode }) {
  return (
    <section id={id} className="audit__section">
      <h2 className="audit__heading">{title}</h2>
      <div className="audit__class-list">
        {classes.map((c) => <code key={c} className="audit__class-tag">.{c}</code>)}
      </div>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="audit__subheading">{children}</h3>;
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`audit__demo-row${className ? ` ${className}` : ''}`}>{children}</div>;
}

// ---------------------------------------------------------------------------
// TOC data
// ---------------------------------------------------------------------------

// TOC — order matches the content sections below
const TOC = [
  { category: 'Form Controls', items: [
    { id: 'button', label: 'Button' },
    { id: 'icon-button', label: 'IconButton' },
    { id: 'input', label: 'Input' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'checkbox-group', label: 'CheckboxGroup' },
    { id: 'radio', label: 'Radio' },
    { id: 'radio-group', label: 'RadioGroup' },
    { id: 'switch', label: 'Switch' },
    { id: 'toggle-button', label: 'ToggleButton' },
    { id: 'toggle-button-group', label: 'ToggleButtonGroup' },
    { id: 'select', label: 'Select' },
    { id: 'autocomplete', label: 'Autocomplete' },
    { id: 'combobox', label: 'Combobox' },
    { id: 'number-field', label: 'NumberField' },
    { id: 'pin-input', label: 'PinInput' },
    { id: 'payment-input', label: 'PaymentInput' },
    { id: 'slider', label: 'Slider' },
    { id: 'search-field', label: 'SearchField' },
    { id: 'text-field', label: 'TextField' },
    { id: 'text-area', label: 'TextArea' },
    { id: 'select-native', label: 'SelectNative' },
  ]},
  { category: 'Date & Time', items: [
    { id: 'calendar', label: 'Calendar' },
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
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'link', label: 'Link' },
    { id: 'pagination', label: 'Pagination' },
  ]},
  { category: 'Layout', items: [
    { id: 'carousel', label: 'Carousel' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'disclosure', label: 'Disclosure' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'scroll-area', label: 'ScrollArea' },
    { id: 'separator', label: 'Separator' },
    { id: 'toolbar', label: 'Toolbar' },
  ]},
  { category: 'Feedback', items: [
    { id: 'banner', label: 'Banner' },
    { id: 'progress-bar', label: 'ProgressBar' },
    { id: 'meter', label: 'Meter' },
    { id: 'spinner', label: 'Spinner' },
  ]},
  { category: 'Display', items: [
    { id: 'avatar', label: 'Avatar' },
    { id: 'badge', label: 'Badge' },
    { id: 'dot-icon', label: 'DotIcon' },
    { id: 'empty-state', label: 'EmptyState' },
    { id: 'featured-icon', label: 'FeaturedIcon' },
    { id: 'grid-list', label: 'GridList' },
    { id: 'rating-badge', label: 'RatingBadge' },
    { id: 'rating-stars', label: 'RatingStars' },
    { id: 'table', label: 'Table' },
    { id: 'tag-group', label: 'TagGroup' },
    { id: 'tree', label: 'Tree' },
  ]},
  { category: 'Form Structure', items: [
    { id: 'field', label: 'Field' },
    { id: 'fieldset', label: 'Fieldset' },
    { id: 'form', label: 'Form' },
  ]},
  { category: 'Interaction', items: [
    { id: 'drop-zone', label: 'DropZone' },
    { id: 'file-trigger', label: 'FileTrigger' },
  ]},
  { category: 'Marketing', items: [
    { id: 'app-store-button', label: 'AppStoreButton' },
    { id: 'social-button', label: 'SocialButton' },
  ]},
  { category: 'Utility', items: [
    { id: 'color-mode-toggle', label: 'ColorModeToggle' },
    { id: 'icon', label: 'Icon' },
    { id: 'container', label: 'Container' },
  ]},
];

// ---------------------------------------------------------------------------
// Calendar section (react-aria-components)
// ---------------------------------------------------------------------------

function CalendarSection() {
  return (
    <Section
      id="calendar"
      title="Calendar"
      classes={['tale-calendar', 'tale-calendar__header', 'tale-calendar__grid', 'tale-calendar__grid-header', 'tale-calendar__grid-body', 'tale-calendar__cell', 'tale-calendar__heading', 'tale-calendar__prev-button', 'tale-calendar__next-button']}
    >
      <SubHeading>Interactive</SubHeading>
      <Calendar.Root>
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {(date) => <Calendar.Cell date={date} />}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>
      <SubHeading>Disabled</SubHeading>
      <Calendar.Root isDisabled>
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {(date) => <Calendar.Cell date={date} />}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar.Root>
      <SubHeading>Read Only</SubHeading>
      <Calendar.Root isReadOnly>
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </Calendar.Header>
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
// ColorPicker section (needs shared state — ColorSlider must NOT nest inside
// ColorPicker.Root, so we use standalone components with useState)
// ---------------------------------------------------------------------------

function ColorPickerDemo() {
  const [color, setColor] = React.useState(parseColor('hsb(200, 100%, 100%)'));
  return (
    <div className="display--flex flex--col gap--2xs audit__color-area-wrap">
      <ColorArea.Root value={color} onChange={setColor} className="audit__color-area">
        <ColorArea.Thumb />
      </ColorArea.Root>
      <ColorSlider.Root channel="hue" value={color} onChange={setColor}>
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider.Root>
      <ColorSlider.Root channel="alpha" value={color} onChange={setColor}>
        <ColorSlider.Track>
          <ColorSlider.Thumb />
        </ColorSlider.Track>
      </ColorSlider.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Combobox section (needs state)
// ---------------------------------------------------------------------------

const countries = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece'];

function ComboboxDemo() {
  return (
    <div className="audit__demo-narrow">
      <Combobox.Root>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Search country…" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
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
    <div className="audit__demo-narrow">
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
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Format <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="Format">
          <Menu.CheckboxItem textValue="Bold">Bold</Menu.CheckboxItem>
          <Menu.CheckboxItem textValue="Italic">Italic</Menu.CheckboxItem>
          <Menu.CheckboxItem textValue="Underline">Underline</Menu.CheckboxItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

function MenuRadioDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">View <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="View">
          <Menu.RadioItem textValue="List">List</Menu.RadioItem>
          <Menu.RadioItem textValue="Grid">Grid</Menu.RadioItem>
          <Menu.RadioItem textValue="Board">Board</Menu.RadioItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

function MenuLinkDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Links <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="Links">
          <Menu.LinkItem textValue="Documentation" href="#">Documentation</Menu.LinkItem>
          <Menu.LinkItem textValue="GitHub" href="#">GitHub</Menu.LinkItem>
          <Menu.Separator />
          <Menu.LinkItem textValue="Report Issue" href="#">Report Issue</Menu.LinkItem>
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
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a modal dialog. It traps focus and requires the user to take action.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Confirm</Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function DestructiveDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--danger">Delete Account</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Delete your account?</Dialog.Title>
          <Dialog.Description>
            This action is permanent and cannot be undone. All your data will be lost.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onPress={() => setOpen(false)}>Delete Account</Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function DismissableDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--neutral">Open Dismissable</Dialog.Trigger>
      <Dialog.Backdrop isDismissable>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Dismissable Dialog</Dialog.Title>
          <Dialog.Description>
            Click the backdrop or press Escape to dismiss this dialog.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>Dismiss</Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function ScrollableDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--primary">Terms &amp; Conditions</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>Please read the following terms carefully.</Dialog.Description>
          <div className="audit__dialog-scroll">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="audit__dialog-scroll-paragraph">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>Decline</Button>
            <Button variant="primary" onPress={() => setOpen(false)}>Accept</Button>
          </Dialog.Actions>
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
            <AlertDialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onPress={() => setOpen(false)}>Delete</Button>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Sortable Table demo
// ---------------------------------------------------------------------------

const tableRows = [
  { id: '1', name: 'Alice', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Bob', role: 'Designer', status: 'Away' },
  { id: '3', name: 'Charlie', role: 'Manager', status: 'Active' },
  { id: '4', name: 'Dave', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Eve', role: 'Admin', status: 'Away' },
];

function SortableTableDemo() {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const sorted = [...tableRows].sort((a, b) => {
    const col = sortDescriptor.column as keyof typeof a;
    const cmp = a[col].localeCompare(b[col]);
    return sortDescriptor.direction === 'descending' ? -cmp : cmp;
  });

  return (
    <Table.Root
      aria-label="Sortable people"
      className="audit__demo-extra-wide"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>Name</Table.Column>
        <Table.Column id="role" allowsSorting>Role</Table.Column>
        <Table.Column id="status" allowsSorting>Status</Table.Column>
      </Table.Header>
      <Table.Body>
        {sorted.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

// ---------------------------------------------------------------------------
// Main audit page
// ---------------------------------------------------------------------------

function ControlledTabsDemo() {
  const [selected, setSelected] = React.useState<string>('tab-home');
  return (
    <div className="audit__demo-extra-wide">
      <Tabs.Root selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>
        <Tabs.List>
          <Tabs.Tab id="tab-home">Home</Tabs.Tab>
          <Tabs.Tab id="tab-profile">Profile</Tabs.Tab>
          <Tabs.Tab id="tab-settings">Settings</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel id="tab-home">Home content.</Tabs.Panel>
        <Tabs.Panel id="tab-profile">Profile content.</Tabs.Panel>
        <Tabs.Panel id="tab-settings">Settings content.</Tabs.Panel>
      </Tabs.Root>
      <span className="audit__controlled-tab-label">Selected: {String(selected)}</span>
    </div>
  );
}

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
    <div className="audit__override-panel">
      <button
        onClick={() => setPanelOpen(p => !p)}
        className="audit__override-toggle"
      >
        <span className={`audit__override-chevron${panelOpen ? ' audit__override-chevron--open' : ''}`}>
          &#9654;
        </span>
        CSS Override
        {cssOverride.trim() && <span className="audit__override-label">(active)</span>}
      </button>

      {panelOpen && (
        <div className="audit__override-body">
          <textarea
            value={cssOverride}
            onChange={e => setCssOverride(e.target.value)}
            placeholder={'Paste CSS from Scale app here…\ne.g. :root { --red-60: #e53e3e; }\n     .color-red { --brand-60: var(--red-60); }'}
            spellCheck={false}
            className="audit__override-textarea"
          />
          <div className="audit__override-actions">
            <button
              onClick={() => setCssOverride('')}
              className="audit__override-button"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>

    <div className="audit">
      {/* TOC */}
      <nav className="audit__sidebar">
        <div className="audit__sidebar-header">
          <span className="audit__sidebar-title">
            Component Audit
          </span>
        </div>
        {TOC.map(({ category, items }) => (
          <div key={category}>
            <div className="audit__toc-category">{category}</div>
            {items.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="audit__toc-link">{label}</a>
            ))}
          </div>
        ))}
      </nav>

      {/* Content */}
      <main>
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

        <Section id="icon" title="Icon" classes={['tale-icon', 'tale-icon--sm', 'tale-icon--lg', 'tale-icon--xl']}>
          <SubHeading>All Sizes</SubHeading>
          <Row>
            <Icon icon={Star} size="sm" />
            <Icon icon={Star} />
            <Icon icon={Star} size="lg" />
            <Icon icon={Star} size="xl" />
          </Row>
          <SubHeading>Icon Gallery</SubHeading>
          <Row>
            <Icon icon={Heart} />
            <Icon icon={Star} />
            <Icon icon={Bell} />
            <Icon icon={Settings} />
            <Icon icon={Search} />
            <Icon icon={Plus} />
            <Icon icon={Trash2} />
            <Icon icon={Download} />
            <Icon icon={AlertCircle} />
            <Icon icon={CheckCircle} />
            <Icon icon={Info} />
            <Icon icon={Mail} />
            <Icon icon={User} />
            <Icon icon={Home} />
            <Icon icon={ChevronRight} />
            <Icon icon={ArrowRight} />
          </Row>
          <SubHeading>Color Inheritance</SubHeading>
          <Row>
            <span style={{ color: 'var(--color-60)' }}><Icon icon={Heart} /></span>
            <span style={{ color: 'var(--neutral-50)' }}><Icon icon={Heart} /></span>
            <span style={{ color: 'var(--neutral-80)' }}><Icon icon={Heart} /></span>
          </Row>
          <SubHeading>With Button</SubHeading>
          <Row>
            <Button variant="primary"><Icon icon={Plus} size="sm" /> Add</Button>
            <Button variant="neutral"><Icon icon={Download} size="sm" /> Download</Button>
            <Button variant="ghost"><Icon icon={Settings} size="sm" /> Settings</Button>
            <Button variant="danger"><Icon icon={Trash2} size="sm" /> Delete</Button>
          </Row>
        </Section>

        <Section id="container" title="Container" classes={[]}>
          <SubHeading>Color overrides</SubHeading>
          <Row>
            {(['brand', 'red', 'indigo', 'green', 'random'] as const).map((color) => (
              <Container key={color} color={color} className="audit__color-demo">
                <span className="audit__color-label">{color}</span>
              </Container>
            ))}
          </Row>
        </Section>

        {/* FORM CONTROLS */}
        {/* ============================================================= */}

        <Section id="button" title="Button" classes={['tale-button', 'tale-button--primary', 'tale-button--neutral', 'tale-button--ghost', 'tale-button--danger', 'tale-button--inverse', 'tale-button--sm', 'tale-button--md', 'tale-button--lg']}>
          <SubHeading>Variants</SubHeading>
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="inverse">Inverse</Button>
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
            <Button disabled variant="inverse">Inverse</Button>
          </Row>
          <SubHeading>With Icons</SubHeading>
          <Row>
            <Button variant="primary" size="md">
              <Icon icon={Plus} size="sm" />
              Add Item
            </Button>
            <Button variant="neutral" size="md">
              Settings
              <Icon icon={ChevronDown} size="sm" />
            </Button>
          </Row>
        </Section>

        <Section id="icon-button" title="IconButton" classes={['tale-icon-button', 'tale-icon-button--sm', 'tale-icon-button--md', 'tale-icon-button--lg']}>
          <SubHeading>Variants</SubHeading>
          <Row>
            <IconButton variant="primary" aria-label="Add"><Icon icon={Plus} /></IconButton>
            <IconButton variant="neutral" aria-label="Settings"><Icon icon={Settings} /></IconButton>
            <IconButton variant="ghost" aria-label="Search"><Icon icon={Search} /></IconButton>
            <IconButton variant="danger" aria-label="Delete"><Icon icon={Trash2} /></IconButton>
            <IconButton variant="inverse" aria-label="Download"><Icon icon={Download} /></IconButton>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <IconButton variant="primary" size="sm" aria-label="Small"><Icon icon={Heart} /></IconButton>
            <IconButton variant="primary" size="md" aria-label="Medium"><Icon icon={Heart} /></IconButton>
            <IconButton variant="primary" size="lg" aria-label="Large"><Icon icon={Heart} /></IconButton>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <IconButton disabled variant="primary" aria-label="Add"><Icon icon={Plus} /></IconButton>
            <IconButton disabled variant="neutral" aria-label="Settings"><Icon icon={Settings} /></IconButton>
            <IconButton disabled variant="ghost" aria-label="Search"><Icon icon={Search} /></IconButton>
            <IconButton disabled variant="danger" aria-label="Delete"><Icon icon={Trash2} /></IconButton>
            <IconButton disabled variant="inverse" aria-label="Download"><Icon icon={Download} /></IconButton>
          </Row>
        </Section>

        <Section id="input" title="Input" classes={['tale-input', 'tale-input--sm', 'tale-input--lg']}>
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced display--flex flex--col gap--2xs">
            <Input.Input size="sm" placeholder="Small input" />
            <Input.Input placeholder="Medium input (default)" />
            <Input.Input size="lg" placeholder="Large input" />
          </div>
          <SubHeading>States</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <Input.Input placeholder="Default" />
            <Input.Input defaultValue="With value" />
            <Input.Input disabled placeholder="Disabled" />
          </div>
          <SubHeading>With Label &amp; Description</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Input.Root>
              <Input.Label>Username</Input.Label>
              <Input.Input placeholder="Enter username…" />
              <Input.Description>Your unique display name.</Input.Description>
            </Input.Root>
          </div>
          <SubHeading>Error State</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Input.Root isInvalid>
              <Input.Label>Email</Input.Label>
              <Input.Input defaultValue="not-an-email" />
              <Input.ErrorMessage>Please enter a valid email address.</Input.ErrorMessage>
            </Input.Root>
          </div>
          <SubHeading>Read Only</SubHeading>
          <div className="audit__demo-narrow">
            <Input.Root isReadOnly>
              <Input.Label>Account ID</Input.Label>
              <Input.Input defaultValue="acct_12345" />
            </Input.Root>
          </div>
        </Section>

        <Section id="checkbox" title="Checkbox" classes={['tale-checkbox', 'tale-checkbox__indicator']}>
          <SubHeading>States</SubHeading>
          <div className="display--flex flex--col gap--2xs">
            {[
              { label: 'Unchecked', checked: false },
              { label: 'Checked', checked: true },
              { label: 'Disabled', checked: false, disabled: true },
              { label: 'Disabled + Checked', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <Checkbox.Root key={label} defaultSelected={checked} isDisabled={disabled}>
                <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
            <Checkbox.Root isIndeterminate>
              <Checkbox.Indicator><Icon icon={MinusLucide} size="sm" /></Checkbox.Indicator>
              Indeterminate
            </Checkbox.Root>
          </div>
        </Section>

        <Section id="checkbox-group" title="CheckboxGroup" classes={['tale-checkbox-group']}>
          <SubHeading>Default</SubHeading>
          <CheckboxGroup aria-label="Interests">
            <div className="display--flex flex--col gap--3xs">
              {['Reading', 'Gaming', 'Cooking'].map((label) => (
                <Checkbox.Root key={label} value={label.toLowerCase()}>
                  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
                  {label}
                </Checkbox.Root>
              ))}
            </div>
          </CheckboxGroup>
          <SubHeading>Disabled</SubHeading>
          <CheckboxGroup aria-label="Disabled group" isDisabled>
            <div className="display--flex flex--col gap--3xs">
              {['Option A', 'Option B'].map((label) => (
                <Checkbox.Root key={label} value={label.toLowerCase().replace(' ', '-')} isDisabled>
                  <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
                  {label}
                </Checkbox.Root>
              ))}
            </div>
          </CheckboxGroup>
          <SubHeading>With Description</SubHeading>
          <CheckboxGroup aria-label="Notification preferences">
            <Field.Description>Select how you would like to be notified.</Field.Description>
            {['Email', 'SMS', 'Push notification'].map((label) => (
              <Checkbox.Root key={label} value={label.toLowerCase().replace(/\s+/g, '-')}>
                <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
          </CheckboxGroup>
          <SubHeading>Horizontal</SubHeading>
          <CheckboxGroup aria-label="Pick toppings" orientation="horizontal">
            {['Cheese', 'Pepperoni', 'Mushrooms'].map((label) => (
              <Checkbox.Root key={label} value={label.toLowerCase()}>
                <Checkbox.Indicator><Icon icon={Check} size="sm" /></Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
          </CheckboxGroup>
        </Section>

        <Section id="radio" title="Radio" classes={['tale-radio', 'tale-radio__indicator', 'tale-radio__dot', 'tale-radio--sm', 'tale-radio--lg']}>
          <SubHeading>States</SubHeading>
          <div className="audit__demo-spaced display--flex flex--col gap--2xs">
            <Radio.Group aria-label="Radio states">
              <Radio.Root value="unchecked">
                <Radio.Indicator />
                Unchecked
              </Radio.Root>
            </Radio.Group>
            <Radio.Group value="checked" aria-label="Checked demo">
              <Radio.Root value="checked">
                <Radio.Indicator />
                Checked
              </Radio.Root>
            </Radio.Group>
            <Radio.Group aria-label="Disabled demo" isDisabled>
              <Radio.Root value="disabled">
                <Radio.Indicator />
                Disabled
              </Radio.Root>
            </Radio.Group>
          </div>
          <SubHeading>Radio Group</SubHeading>
          <Radio.Group defaultValue="option-a">
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const value = `option-${String.fromCharCode(97 + i)}`;
              return (
                <Radio.Root key={value} value={value}>
                  <Radio.Indicator />
                  {label}
                </Radio.Root>
              );
            })}
          </Radio.Group>
          <SubHeading>Horizontal</SubHeading>
          <Radio.Group aria-label="Pick a plan" orientation="horizontal">
            {['Free', 'Pro', 'Enterprise'].map((label) => (
              <Radio.Root key={label} value={label.toLowerCase()}>
                <Radio.Indicator />
                {label}
              </Radio.Root>
            ))}
          </Radio.Group>
        </Section>

        <Section id="switch" title="Switch" classes={['tale-switch', 'tale-switch__thumb']}>
          <SubHeading>States</SubHeading>
          <div className="display--flex flex--col gap--xs">
            {[
              { label: 'Off', checked: false },
              { label: 'On', checked: true },
              { label: 'Disabled (Off)', checked: false, disabled: true },
              { label: 'Disabled (On)', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <Switch.Root key={label} defaultSelected={checked} isDisabled={disabled}>
                <Switch.Thumb />
                {label}
              </Switch.Root>
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
                <Select.Icon />
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
                <Select.Icon />
              </Select.Trigger>
            </Select.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Label>Fruit</Select.Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
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
                <Select.Icon />
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
          <SubHeading>With Disabled Items</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  <Select.Item id="apple-d" textValue="Apple">Apple</Select.Item>
                  <Select.Item id="banana-d" textValue="Banana" isDisabled>Banana</Select.Item>
                  <Select.Item id="cherry-d" textValue="Cherry">Cherry</Select.Item>
                  <Select.Item id="date-d" textValue="Date" isDisabled>Date</Select.Item>
                  <Select.Item id="elderberry-d" textValue="Elderberry">Elderberry</Select.Item>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
        </Section>

        <Section id="autocomplete" title="Autocomplete" classes={['tale-combobox__input', 'tale-combobox__popup', 'tale-combobox__item', 'tale-combobox__empty']}>
          <SubHeading>Default</SubHeading>
          <AutocompleteDemo />
        </Section>

        <Section id="combobox" title="Combobox" classes={['tale-combobox__input', 'tale-combobox__input-group', 'tale-combobox__trigger', 'tale-combobox__popup', 'tale-combobox__item', 'tale-combobox__empty', 'tale-combobox__section', 'tale-combobox__header', 'tale-combobox__chips', 'tale-combobox__chip', 'tale-combobox__chip-remove']}>
          <SubHeading>Default</SubHeading>
          <ComboboxDemo />
          <SubHeading>With Label</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Country</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Search country…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  {countries.slice(0, 8).map((c) => (
                    <Combobox.Item key={c} id={c} textValue={c}>{c}</Combobox.Item>
                  ))}
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>With Sections</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Food</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Search food…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Section>
                    <Combobox.Header>Fruits</Combobox.Header>
                    <Combobox.Item id="apple" textValue="Apple">Apple</Combobox.Item>
                    <Combobox.Item id="banana" textValue="Banana">Banana</Combobox.Item>
                    <Combobox.Item id="cherry" textValue="Cherry">Cherry</Combobox.Item>
                  </Combobox.Section>
                  <Combobox.Section>
                    <Combobox.Header>Vegetables</Combobox.Header>
                    <Combobox.Item id="carrot" textValue="Carrot">Carrot</Combobox.Item>
                    <Combobox.Item id="broccoli" textValue="Broccoli">Broccoli</Combobox.Item>
                    <Combobox.Item id="spinach" textValue="Spinach">Spinach</Combobox.Item>
                  </Combobox.Section>
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>Empty</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Search (try typing something not in list)</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Type to filter…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Empty>No results found.</Combobox.Empty>
                  <Combobox.Item id="apple-e" textValue="Apple">Apple</Combobox.Item>
                  <Combobox.Item id="banana-e" textValue="Banana">Banana</Combobox.Item>
                  <Combobox.Item id="cherry-e" textValue="Cherry">Cherry</Combobox.Item>
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>Multi-select Chips</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Frameworks</Combobox.Label>
              <Combobox.Chips>
                <Combobox.Chip>
                  React <Combobox.ChipRemove aria-label="Remove React" />
                </Combobox.Chip>
                <Combobox.Chip>
                  Vue <Combobox.ChipRemove aria-label="Remove Vue" />
                </Combobox.Chip>
                <Combobox.Chip>
                  Angular <Combobox.ChipRemove aria-label="Remove Angular" />
                </Combobox.Chip>
              </Combobox.Chips>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Add framework…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Item id="react-ms" textValue="React">React</Combobox.Item>
                  <Combobox.Item id="vue-ms" textValue="Vue">Vue</Combobox.Item>
                  <Combobox.Item id="angular-ms" textValue="Angular">Angular</Combobox.Item>
                  <Combobox.Item id="svelte-ms" textValue="Svelte">Svelte</Combobox.Item>
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
          <SubHeading>With Label</SubHeading>
          <Row>
            <NumberField.Root defaultValue={1}>
              <NumberField.Label>Quantity</NumberField.Label>
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
          <SubHeading>Currency Format</SubHeading>
          <Row>
            <NumberField.Root defaultValue={99.99} formatOptions={{ style: 'currency', currency: 'USD' }}>
              <NumberField.Label>Price</NumberField.Label>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
        </Section>

        <Section id="slider" title="Slider" classes={['tale-slider', 'tale-slider__header', 'tale-slider__label', 'tale-slider__output', 'tale-slider__control', 'tale-slider__track', 'tale-slider__indicator', 'tale-slider__thumb']}>
          <SubHeading>With Header &amp; Output</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50}>
              <Slider.Header>
                <Slider.Label>Volume</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={40}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Range (two thumbs)</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
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
          <SubHeading>Steps</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50} step={10}>
              <Slider.Header>
                <Slider.Label>Brightness</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div className="audit__slider-vertical audit__demo-spaced">
            <Slider.Root defaultValue={60} orientation="vertical">
              <Slider.Header>
                <Slider.Label>Level</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <Slider.Root isDisabled defaultValue={60}>
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
          <SubHeading>Default</SubHeading>
          <Row>
            <DialogDemo />
          </Row>
          <SubHeading>Destructive</SubHeading>
          <Row>
            <DestructiveDialogDemo />
          </Row>
          <SubHeading>Dismissable</SubHeading>
          <Row>
            <DismissableDialogDemo />
          </Row>
          <SubHeading>Scrollable Content</SubHeading>
          <Row>
            <ScrollableDialogDemo />
          </Row>
        </Section>

        <Section id="alert-dialog" title="AlertDialog" classes={['tale-alert-dialog__backdrop', 'tale-alert-dialog__popup', 'tale-alert-dialog__title', 'tale-alert-dialog__description', 'tale-alert-dialog__actions']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <AlertDialogDemo />
          </Row>
        </Section>

        <Section id="popover" title="Popover" classes={['tale-popover__popup', 'tale-popover__title', 'tale-popover__description', 'tale-popover__close', 'tale-popover__arrow']}>
          <SubHeading>All sides</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Popover.Root key={side}>
                <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">{side}</Popover.Trigger>
                <Popover.Popup placement={side} offset={8}>
                  <Popover.Close aria-label="Close" />
                  <Popover.Title>Popover ({side})</Popover.Title>
                  <Popover.Description>
                    Appears on the {side}.
                  </Popover.Description>
                </Popover.Popup>
              </Popover.Root>
            ))}
          </Row>
          <SubHeading>With Arrow</SubHeading>
          <Row className="audit__demo-row--padded">
            <Popover.Root>
              <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">With Arrow</Popover.Trigger>
              <Popover.Popup placement="bottom" offset={8}>
                <Popover.Arrow />
                <Popover.Title>Arrow Popover</Popover.Title>
                <Popover.Description>
                  This popover includes an arrow pointing to the trigger.
                </Popover.Description>
              </Popover.Popup>
            </Popover.Root>
          </Row>
        </Section>

        <Section id="preview-card" title="PreviewCard" classes={['tale-preview-card', 'tale-preview-card__trigger', 'tale-preview-card__popup', 'tale-preview-card__arrow']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
              <PreviewCard.Popup>
                <PreviewCard.Content aria-label="Preview">
                  <div className="audit__preview-content">
                    <strong className="audit__preview-title">Preview Card</strong>
                    <p className="audit__preview-description">
                      A card that appears on hover to show a preview of linked content.
                    </p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </Row>
          <SubHeading>With Arrow</SubHeading>
          <Row>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
              <PreviewCard.Popup>
                <PreviewCard.Arrow />
                <PreviewCard.Content aria-label="Preview">
                  <div className="audit__preview-content">
                    <strong className="audit__preview-title">Arrow Preview</strong>
                    <p className="audit__preview-description">
                      This preview card includes an arrow pointing to the trigger.
                    </p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </Row>
        </Section>

        <Section id="drawer" title="Drawer" classes={['tale-drawer', 'tale-drawer__trigger', 'tale-drawer__popup', 'tale-drawer__backdrop', 'tale-drawer__title', 'tale-drawer__description', 'tale-drawer__close', 'tale-drawer__handle', 'tale-drawer__swipe-area']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Popup>
                <p>Drawer content goes here.</p>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Title</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Popup>
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.Description>This is a description of the drawer content.</Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Backdrop</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Title>Drawer with Backdrop</Drawer.Title>
                <Drawer.Description>Click the backdrop to close.</Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Handle</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Handle />
                <Drawer.Title>Drawer with Handle</Drawer.Title>
                <Drawer.Description>The handle bar indicates this drawer is draggable.</Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Actions</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">Open Drawer</Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Handle />
                <Drawer.Title>Confirm Action</Drawer.Title>
                <Drawer.Description>Are you sure you want to proceed?</Drawer.Description>
                <div className="audit__drawer-actions">
                  <Drawer.Close className="tale-button tale-button--neutral audit__drawer-action">Cancel</Drawer.Close>
                  <Drawer.Close className="tale-button tale-button--primary audit__drawer-action">Confirm</Drawer.Close>
                </div>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
        </Section>

        <Section id="tooltip" title="Tooltip" classes={['tale-tooltip__popup', 'tale-tooltip__arrow']}>
          <SubHeading>Without arrow</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Hover ({side})</Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={8}>
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>With arrow</SubHeading>
          <Row className="audit__demo-row--padded">

            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Arrow ({side})</Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={4}>
                  <Tooltip.Arrow />
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>Long Text</SubHeading>
          <Row className="audit__demo-row--padded">
            <Tooltip.Root>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">Long tooltip</Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                This is a tooltip with a longer description that wraps across multiple
                lines to demonstrate how the tooltip handles extended content gracefully.
              </Tooltip.Popup>
            </Tooltip.Root>
          </Row>
          <SubHeading>With Delay</SubHeading>
          <Row className="audit__demo-row--padded">
            <Tooltip.Root delay={500}>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">500ms delay</Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                Appeared after 500ms
              </Tooltip.Popup>
            </Tooltip.Root>
            <Tooltip.Root delay={0}>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">No delay</Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                Instant tooltip
              </Tooltip.Popup>
            </Tooltip.Root>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* NAVIGATION */}
        {/* ============================================================= */}

        <Section id="menu" title="Menu" classes={['tale-menu__popup', 'tale-menu__item', 'tale-menu__separator', 'tale-menu__group-label', 'tale-menu__trigger', 'tale-menu__popover', 'tale-menu__arrow', 'tale-menu__checkbox-item', 'tale-menu__radio-item', 'tale-menu__link-item', 'tale-menu__submenu-trigger']}>
          <SubHeading>Basic</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Options <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Options">
                  <Menu.Item id="edit" textValue="Edit">Edit</Menu.Item>
                  <Menu.Item id="duplicate" textValue="Duplicate">Duplicate</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="share" textValue="Share">Share</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="delete" textValue="Delete">Delete</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>With Group Labels</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Account <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Account">
                  <Menu.Group>
                    <Menu.Header>Account</Menu.Header>
                    <Menu.Item id="profile" textValue="Profile">Profile</Menu.Item>
                    <Menu.Item id="settings" textValue="Settings">Settings</Menu.Item>
                  </Menu.Group>
                  <Menu.Separator />
                  <Menu.Group>
                    <Menu.Header>Danger Zone</Menu.Header>
                    <Menu.Item id="sign-out" textValue="Sign out">Sign out</Menu.Item>
                  </Menu.Group>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>Checkbox Items</SubHeading>
          <Row>
            <MenuCheckboxDemo />
          </Row>
          <SubHeading>Radio Items</SubHeading>
          <Row>
            <MenuRadioDemo />
          </Row>
          <SubHeading>Link Items</SubHeading>
          <Row>
            <MenuLinkDemo />
          </Row>
          <SubHeading>With Disabled Items</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">Actions <Icon icon={ChevronDown} size="sm" /></Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Actions">
                  <Menu.Item id="edit" textValue="Edit">Edit</Menu.Item>
                  <Menu.Item id="duplicate" textValue="Duplicate" isDisabled>Duplicate</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="archive" textValue="Archive">Archive</Menu.Item>
                  <Menu.Item id="delete" textValue="Delete" isDisabled>Delete</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
        </Section>

        <Section id="context-menu" title="ContextMenu" classes={['tale-context-menu', 'tale-context-menu__trigger', 'tale-context-menu__list', 'tale-context-menu__item', 'tale-context-menu__separator', 'tale-context-menu__group']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div className="audit__context-trigger">
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
          <SubHeading>With Groups</SubHeading>
          <Row>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div className="audit__context-trigger">
                  Right-click for grouped menu
                </div>
              </ContextMenu.Trigger>
              <ContextMenu.Popup aria-label="Grouped context menu">
                <ContextMenu.MenuList aria-label="Grouped context menu">
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Cut">Cut</ContextMenu.Item>
                    <ContextMenu.Item textValue="Copy">Copy</ContextMenu.Item>
                    <ContextMenu.Item textValue="Paste">Paste</ContextMenu.Item>
                  </ContextMenu.Group>
                  <ContextMenu.Separator />
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Find">Find</ContextMenu.Item>
                    <ContextMenu.Item textValue="Replace">Replace</ContextMenu.Item>
                  </ContextMenu.Group>
                  <ContextMenu.Separator />
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Inspect">Inspect</ContextMenu.Item>
                  </ContextMenu.Group>
                </ContextMenu.MenuList>
              </ContextMenu.Popup>
            </ContextMenu.Root>
          </Row>
        </Section>

        <Section id="navigation-menu" title="NavigationMenu" classes={['tale-navigation-menu', 'tale-navigation-menu__list', 'tale-navigation-menu__item', 'tale-navigation-menu__trigger', 'tale-navigation-menu__link', 'tale-navigation-menu__icon']}>
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
          <SubHeading>With Dropdown &amp; Icon</SubHeading>
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>
                  Products <NavigationMenu.Icon />
                </NavigationMenu.Trigger>
                <NavigationMenu.Popup>
                  <NavigationMenu.Content>
                    <NavigationMenu.Link href="#">Widget</NavigationMenu.Link>
                    <NavigationMenu.Link href="#">Gadget</NavigationMenu.Link>
                  </NavigationMenu.Content>
                </NavigationMenu.Popup>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </Section>

        <Section id="menubar" title="Menubar" classes={['tale-menubar', 'tale-menubar__item']}>
          <SubHeading>Default</SubHeading>
          <Menubar.Root>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>File</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="File">
                    <Menu.Item id="new" textValue="New">New</Menu.Item>
                    <Menu.Item id="open" textValue="Open">Open</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="save" textValue="Save">Save</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>Edit</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="Edit">
                    <Menu.Item id="undo" textValue="Undo">Undo</Menu.Item>
                    <Menu.Item id="redo" textValue="Redo">Redo</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="cut" textValue="Cut">Cut</Menu.Item>
                    <Menu.Item id="copy" textValue="Copy">Copy</Menu.Item>
                    <Menu.Item id="paste" textValue="Paste">Paste</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>View</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="View">
                    <Menu.Item id="zoom-in" textValue="Zoom In">Zoom In</Menu.Item>
                    <Menu.Item id="zoom-out" textValue="Zoom Out">Zoom Out</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="full-screen" textValue="Full Screen">Full Screen</Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
          </Menubar.Root>
        </Section>

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
          <SubHeading>External</SubHeading>
          <Row>
            <Link href="https://example.com" target="_blank">Opens in new tab</Link>
          </Row>
        </Section>

        <Section id="pagination" title="Pagination" classes={['tale-pagination', 'tale-pagination__item', 'tale-pagination__item--current', 'tale-pagination__ellipsis', 'tale-pagination__previous', 'tale-pagination__next']}>
          <SubHeading>Default</SubHeading>
          <Pagination.Root aria-label="Pagination">
            <Pagination.PreviousTrigger />
            <Pagination.Item page={1} />
            <Pagination.Item page={2} current />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger />
          </Pagination.Root>
          <SubHeading>Many Pages</SubHeading>
          <Pagination.Root aria-label="Pagination">
            <Pagination.PreviousTrigger />
            <Pagination.Item page={1} />
            <Pagination.Ellipsis />
            <Pagination.Item page={4} />
            <Pagination.Item page={5} current />
            <Pagination.Item page={6} />
            <Pagination.Ellipsis />
            <Pagination.Item page={20} />
            <Pagination.NextTrigger />
          </Pagination.Root>
          <SubHeading>First Page (Previous Disabled)</SubHeading>
          <Pagination.Root aria-label="Pagination">
            <Pagination.PreviousTrigger disabled />
            <Pagination.Item page={1} current />
            <Pagination.Item page={2} />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger />
          </Pagination.Root>
        </Section>

        <Section id="pin-input" title="PinInput" classes={['tale-pin-input', 'tale-pin-input__group', 'tale-pin-input__slot', 'tale-pin-input__separator', 'tale-pin-input__caret']}>
          <SubHeading>4-digit</SubHeading>
          <PinInput.Root maxLength={4}>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
              <PinInput.Slot index={3} />
            </PinInput.Group>
          </PinInput.Root>
          <SubHeading>6-digit with separator</SubHeading>
          <PinInput.Root maxLength={6}>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
            </PinInput.Group>
            <PinInput.Separator />
            <PinInput.Group>
              <PinInput.Slot index={3} />
              <PinInput.Slot index={4} />
              <PinInput.Slot index={5} />
            </PinInput.Group>
          </PinInput.Root>
          <SubHeading>Disabled</SubHeading>
          <PinInput.Root maxLength={4} disabled>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
              <PinInput.Slot index={3} />
            </PinInput.Group>
          </PinInput.Root>
        </Section>

        <Section id="payment-input" title="PaymentInput" classes={['tale-payment-input', 'tale-payment-input__group', 'tale-payment-input__input', 'tale-payment-input__label', 'tale-payment-input__card-icon', 'tale-payment-input__description', 'tale-payment-input__error']}>
          <SubHeading>Default</SubHeading>
          <PaymentInput.Root>
            <PaymentInput.Group>
              <PaymentInput.Input placeholder="1234 5678 9012 3456" />
              <PaymentInput.CardIcon />
            </PaymentInput.Group>
          </PaymentInput.Root>
          <SubHeading>With Label</SubHeading>
          <PaymentInput.Root>
            <PaymentInput.Label>Card number</PaymentInput.Label>
            <PaymentInput.Group>
              <PaymentInput.Input placeholder="1234 5678 9012 3456" />
              <PaymentInput.CardIcon />
            </PaymentInput.Group>
            <PaymentInput.Description>Visa, Mastercard, Amex, or Discover</PaymentInput.Description>
          </PaymentInput.Root>
        </Section>

        {/* ============================================================= */}
        {/* LAYOUT */}
        {/* ============================================================= */}

        <Section id="carousel" title="Carousel" classes={['tale-carousel', 'tale-carousel__content', 'tale-carousel__container', 'tale-carousel__item', 'tale-carousel__previous', 'tale-carousel__next', 'tale-carousel__indicators', 'tale-carousel__indicator']}>
          <SubHeading>Default</SubHeading>
          <div style={{ maxWidth: 400 }}>
            <Carousel.Root>
              <Carousel.Content>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 1</div></Carousel.Item>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 2</div></Carousel.Item>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 3</div></Carousel.Item>
              </Carousel.Content>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
                <Carousel.PreviousTrigger />
                <Carousel.NextTrigger />
              </div>
            </Carousel.Root>
          </div>
          <SubHeading>With indicators + loop</SubHeading>
          <div style={{ maxWidth: 400 }}>
            <Carousel.Root loop>
              <Carousel.Content>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 1</div></Carousel.Item>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 2</div></Carousel.Item>
                <Carousel.Item><div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-12)', borderRadius: 'var(--radius-m)' }}>Slide 3</div></Carousel.Item>
              </Carousel.Content>
              <Carousel.Indicators>
                <Carousel.Indicator index={0} />
                <Carousel.Indicator index={1} />
                <Carousel.Indicator index={2} />
              </Carousel.Indicators>
            </Carousel.Root>
          </div>
        </Section>

        <Section id="accordion" title="Accordion" classes={['tale-accordion', 'tale-accordion__item', 'tale-accordion__trigger', 'tale-accordion__trigger-icon', 'tale-accordion__panel']}>
          <SubHeading>Default Open</SubHeading>
          <div className="audit__demo-extra-wide">
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
          <SubHeading>Multiple Open</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Accordion.Root allowsMultipleExpanded defaultExpandedKeys={['m-a', 'm-b']}>
              {[
                { id: 'm-a', title: 'First Section', content: 'This section starts open. Multiple sections can be expanded simultaneously.' },
                { id: 'm-b', title: 'Second Section', content: 'This section also starts open.' },
                { id: 'm-c', title: 'Third Section', content: 'Click to expand alongside the others.' },
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
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-extra-wide">
            <Accordion.Root isDisabled>
              {[
                { id: 'd-a', title: 'Disabled Item A', content: 'Cannot be expanded.' },
                { id: 'd-b', title: 'Disabled Item B', content: 'Cannot be expanded.' },
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
          <SubHeading>Default Expanded</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root defaultExpanded>
              <Disclosure.Trigger>Open by default</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">
                  This content is visible by default.
                </div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
          <SubHeading>Collapsed</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root>
              <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">
                  This content is hidden by default.
                </div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root isDisabled>
              <Disclosure.Trigger>Disabled</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">Content</div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
        </Section>

        <Section id="tabs" title="Tabs" classes={['tale-tabs', 'tale-tabs__list', 'tale-tabs__tab', 'tale-tabs__panel', 'tale-tabs__indicator']}>
          <SubHeading>Horizontal</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
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
          <div className="audit__demo-extra-wide audit__tabs-vertical">
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
          <SubHeading>Controlled</SubHeading>
          <ControlledTabsDemo />
          <SubHeading>With Disabled Tab</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="active">
              <Tabs.List>
                <Tabs.Tab id="active">Active</Tabs.Tab>
                <Tabs.Tab id="disabled-only" isDisabled>Disabled</Tabs.Tab>
                <Tabs.Tab id="another">Another</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="active">This tab is active.</Tabs.Panel>
              <Tabs.Panel id="disabled-only">This tab is disabled and cannot be selected.</Tabs.Panel>
              <Tabs.Panel id="another">Another tab panel.</Tabs.Panel>
            </Tabs.Root>
          </div>
        </Section>

        <Section id="scroll-area" title="ScrollArea" classes={['tale-scroll-area', 'tale-scroll-area__viewport', 'tale-scroll-area__content', 'tale-scroll-area__scrollbar', 'tale-scroll-area__thumb', 'tale-scroll-area__corner']}>
          <ScrollArea.Root className="audit__scroll-area">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="audit__scroll-text">
                    Line {i + 1}: Scrollable content with custom styled scrollbars.
                  </p>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Section>

        <Section id="separator" title="Separator" classes={['tale-separator']}>
          <SubHeading>Horizontal</SubHeading>
          <div className="audit__demo-medium audit__demo-spaced">
            <p className="audit__separator-text audit__separator-above">Content above</p>
            <Separator />
            <p className="audit__separator-text audit__separator-below">Content below</p>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div className="audit__separator-vertical">
            <span className="audit__separator-text">Left</span>
            <Separator orientation="vertical" />
            <span className="audit__separator-text">Right</span>
          </div>
        </Section>

        <Section id="toolbar" title="Toolbar" classes={['tale-toolbar', 'tale-toolbar__group', 'tale-toolbar__button', 'tale-toolbar__separator', 'tale-toolbar__link', 'tale-toolbar__input']}>
          <SubHeading>Default</SubHeading>
          <Toolbar.Root aria-label="Text formatting">
            <Toolbar.Group>
              <Toolbar.Button aria-label="Bold"><strong>B</strong></Toolbar.Button>
              <Toolbar.Button aria-label="Italic"><em>I</em></Toolbar.Button>
              <Toolbar.Button aria-label="Underline"><u>U</u></Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Button disabled>Undo</Toolbar.Button>
              <Toolbar.Button disabled>Redo</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Link href="#">Help</Toolbar.Link>
          </Toolbar.Root>
          <SubHeading>With Input</SubHeading>
          <Toolbar.Root aria-label="Search toolbar" className="audit__demo-spaced">
            <Toolbar.Group>
              <Toolbar.Button>Filter</Toolbar.Button>
              <Toolbar.Button>Sort</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Input placeholder="Search…" aria-label="Search" />
          </Toolbar.Root>
        </Section>

        {/* ============================================================= */}
        {/* FEEDBACK */}
        {/* ============================================================= */}

        <Section id="banner" title="Banner" classes={['tale-banner', 'tale-banner--success', 'tale-banner--warning', 'tale-banner--error', 'tale-banner--sm', 'tale-banner__icon', 'tale-banner__title', 'tale-banner__description', 'tale-banner__actions', 'tale-banner__close']}>
          <SubHeading>Info (default)</SubHeading>
          <Banner.Root variant="info">
            <Banner.Title>Heads up</Banner.Title>
            <Banner.Description>Your trial expires in 3 days.</Banner.Description>
          </Banner.Root>
          <SubHeading>Success</SubHeading>
          <Banner.Root variant="success">
            <Banner.Title>Success</Banner.Title>
            <Banner.Description>Operation completed.</Banner.Description>
          </Banner.Root>
          <SubHeading>Warning</SubHeading>
          <Banner.Root variant="warning">
            <Banner.Title>Warning</Banner.Title>
            <Banner.Description>Please review before continuing.</Banner.Description>
          </Banner.Root>
          <SubHeading>Error</SubHeading>
          <Banner.Root variant="error">
            <Banner.Title>Error</Banner.Title>
            <Banner.Description>Something went wrong.</Banner.Description>
          </Banner.Root>
          <SubHeading>With Close</SubHeading>
          <Banner.Root variant="info">
            <Banner.Title>Tip</Banner.Title>
            <Banner.Description>You can customise your dashboard.</Banner.Description>
            <Banner.Close aria-label="Dismiss" />
          </Banner.Root>
          <SubHeading>Small</SubHeading>
          <Banner.Root variant="info" size="sm">
            <Banner.Title>Note</Banner.Title>
            <Banner.Description>Compact banner.</Banner.Description>
          </Banner.Root>
        </Section>

        <Section id="progress-bar" title="ProgressBar" classes={['tale-progress-bar', 'tale-progress-bar__header', 'tale-progress-bar__label', 'tale-progress-bar__value', 'tale-progress-bar__track', 'tale-progress-bar__indicator']}>
          <SubHeading>With Header, Label &amp; Value</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            <ProgressBar.Root value={20}>
              <ProgressBar.Header>
                <ProgressBar.Label>Downloading</ProgressBar.Label>
                <ProgressBar.Value>20%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={20} />
              </ProgressBar.Track>
            </ProgressBar.Root>
            <ProgressBar.Root value={60}>
              <ProgressBar.Header>
                <ProgressBar.Label>Upload</ProgressBar.Label>
                <ProgressBar.Value>60%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={60} />
              </ProgressBar.Track>
            </ProgressBar.Root>
            <ProgressBar.Root value={100}>
              <ProgressBar.Header>
                <ProgressBar.Label>Complete</ProgressBar.Label>
                <ProgressBar.Value>100%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={100} />
              </ProgressBar.Track>
            </ProgressBar.Root>
          </div>
          <SubHeading>Indeterminate</SubHeading>
          <div className="audit__demo-wide">
            <ProgressBar.Root isIndeterminate>
              <ProgressBar.Header>
                <ProgressBar.Label>Processing</ProgressBar.Label>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator />
              </ProgressBar.Track>
            </ProgressBar.Root>
          </div>
        </Section>

        <Section id="meter" title="Meter" classes={['tale-meter', 'tale-meter__header', 'tale-meter__label', 'tale-meter__value', 'tale-meter__track', 'tale-meter__indicator']}>
          <SubHeading>With Header, Label &amp; Value</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            <Meter.Root value={25}>
              <Meter.Header>
                <Meter.Label>Battery</Meter.Label>
                <Meter.Value>25%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={25} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={60}>
              <Meter.Header>
                <Meter.Label>Memory</Meter.Label>
                <Meter.Value>60%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={60} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={72}>
              <Meter.Header>
                <Meter.Label>Storage</Meter.Label>
                <Meter.Value>72%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={72} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={90}>
              <Meter.Header>
                <Meter.Label>CPU</Meter.Label>
                <Meter.Value>90%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={90} />
              </Meter.Track>
            </Meter.Root>
          </div>
        </Section>


        <Section id="spinner" title="Spinner" classes={['tale-spinner', 'tale-spinner--line', 'tale-spinner--dots', 'tale-spinner--sm', 'tale-spinner--lg']}>
          <SubHeading>Circle (default)</SubHeading>
          <Row>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Row>
          <SubHeading>Dots</SubHeading>
          <Row>
            <Spinner variant="dots" size="sm" />
            <Spinner variant="dots" size="md" />
            <Spinner variant="dots" size="lg" />
          </Row>
          <SubHeading>Line</SubHeading>
          <div className="audit__demo-wide">
            <Spinner variant="line" />
          </div>
        </Section>

        {/* ============================================================= */}
        {/* DISPLAY */}
        {/* ============================================================= */}

        <Section id="avatar" title="Avatar" classes={['tale-avatar', 'tale-avatar--sm', 'tale-avatar--md', 'tale-avatar--lg', 'tale-avatar--xl', 'tale-avatar__image', 'tale-avatar__fallback', 'tale-avatar-group', 'tale-avatar-count']}>
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
          <SubHeading>Group with Count</SubHeading>
          <Row>
            <Avatar.Group size="md">
              <Avatar.Root>
                <Avatar.Fallback>AB</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>CD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>EF</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Count>+5</Avatar.Count>
            </Avatar.Group>
          </Row>
        </Section>

        <Section id="badge" title="Badge" classes={['tale-badge', 'tale-badge--neutral', 'tale-badge--brand', 'tale-badge--error', 'tale-badge--warning', 'tale-badge--success', 'tale-badge--sm', 'tale-badge--md', 'tale-badge--lg']}>
          <SubHeading>Variants</SubHeading>
          <Row>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="success">Success</Badge>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Row>
        </Section>

        <Section id="dot-icon" title="DotIcon" classes={['tale-dot-icon', 'tale-dot-icon--neutral', 'tale-dot-icon--brand', 'tale-dot-icon--error', 'tale-dot-icon--warning', 'tale-dot-icon--success', 'tale-dot-icon--sm', 'tale-dot-icon--md', 'tale-dot-icon--lg']}>
          <SubHeading>Colors</SubHeading>
          <Row>
            <DotIcon color="neutral" />
            <DotIcon color="brand" />
            <DotIcon color="error" />
            <DotIcon color="warning" />
            <DotIcon color="success" />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <DotIcon size="sm" />
            <DotIcon size="md" />
            <DotIcon size="lg" />
          </Row>
        </Section>

        <Section id="empty-state" title="EmptyState" classes={['tale-empty-state', 'tale-empty-state--sm', 'tale-empty-state--lg', 'tale-empty-state__icon', 'tale-empty-state__title', 'tale-empty-state__description', 'tale-empty-state__actions']}>
          <SubHeading>Default (md)</SubHeading>
          <EmptyState.Root>
            <EmptyState.Title>No items</EmptyState.Title>
            <EmptyState.Description>Nothing here yet.</EmptyState.Description>
          </EmptyState.Root>
          <SubHeading>With Actions</SubHeading>
          <EmptyState.Root>
            <EmptyState.Title>No projects</EmptyState.Title>
            <EmptyState.Description>Get started by creating your first project.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="primary" size="sm">Create project</Button>
            </EmptyState.Actions>
          </EmptyState.Root>
          <SubHeading>Small</SubHeading>
          <EmptyState.Root size="sm">
            <EmptyState.Title>No results</EmptyState.Title>
            <EmptyState.Description>Try adjusting your filters.</EmptyState.Description>
          </EmptyState.Root>
          <SubHeading>Large</SubHeading>
          <EmptyState.Root size="lg">
            <EmptyState.Title>Welcome</EmptyState.Title>
            <EmptyState.Description>Your dashboard is empty.</EmptyState.Description>
          </EmptyState.Root>
        </Section>

        {/* ============================================================= */}
        {/* FORM STRUCTURE */}
        {/* ============================================================= */}

        <Section id="field" title="Field" classes={['tale-field', 'tale-field__label', 'tale-field__control', 'tale-field__description', 'tale-field__error']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root>
              <Field.Label>Label</Field.Label>
              <Field.Control>
                <Input.Input placeholder="Type here…" />
              </Field.Control>
            </Field.Root>
          </div>
          <SubHeading>With Description</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Field.Control>
                <Input.Input placeholder="you@example.com" />
              </Field.Control>
              <Field.Description>We will never share your email.</Field.Description>
            </Field.Root>
          </div>
          <SubHeading>With Error</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root data-invalid>
              <Field.Label>Password</Field.Label>
              <Field.Control>
                <Input.Input type="password" defaultValue="123" />
              </Field.Control>
              <Field.Error>Password must be at least 8 characters.</Field.Error>
            </Field.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root data-disabled>
              <Field.Label>Disabled</Field.Label>
              <Field.Control>
                <Input.Input disabled placeholder="Cannot edit" />
              </Field.Control>
              <Field.Description>This field is disabled.</Field.Description>
            </Field.Root>
          </div>
        </Section>

        <Section id="fieldset" title="Fieldset" classes={['tale-fieldset', 'tale-fieldset__legend']}>
          <SubHeading>Default</SubHeading>
          <Fieldset.Root>
            <Fieldset.Legend>Personal Information</Fieldset.Legend>
            <div className="audit__fieldset-content">
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
          <SubHeading>Disabled</SubHeading>
          <Fieldset.Root data-disabled>
            <Fieldset.Legend>Billing Address</Fieldset.Legend>
            <div className="audit__fieldset-content">
              <Field.Root data-disabled>
                <Field.Label>Street</Field.Label>
                <Input.Input placeholder="123 Main St" disabled />
              </Field.Root>
              <Field.Root data-disabled>
                <Field.Label>City</Field.Label>
                <Input.Input placeholder="Springfield" disabled />
              </Field.Root>
            </div>
          </Fieldset.Root>
        </Section>

        <Section id="form" title="Form" classes={['tale-form']}>
          <SubHeading>Default</SubHeading>
          <Form className="audit__demo-medium display--flex flex--col gap--xs">
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
          <SubHeading>With Validation</SubHeading>
          <Form className="audit__demo-medium display--flex flex--col gap--xs">
            <Field.Root>
              <Field.Label>Full name</Field.Label>
              <Input.Input placeholder="Jane Doe" required />
              <Field.Description>Required field.</Field.Description>
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input.Input type="password" placeholder="Min 8 characters" minLength={8} required />
            </Field.Root>
            <Button variant="primary" type="submit">Create Account</Button>
          </Form>
        </Section>

        {/* ============================================================= */}
        {/* ADDITIONAL FORM CONTROLS                                       */}
        {/* ============================================================= */}

        <Section id="radio-group" title="RadioGroup" classes={['tale-radio']}>
          <SubHeading>Standalone RadioGroup</SubHeading>
          <RadioGroup aria-label="Favourite colour" className="display--flex flex--col gap--3xs">
            {['Red', 'Green', 'Blue'].map((c) => (
              <Radio.Root key={c} value={c.toLowerCase()}>
                <Radio.Indicator />
                {c}
              </Radio.Root>
            ))}
          </RadioGroup>
        </Section>

        <Section id="search-field" title="SearchField" classes={['tale-search-field', 'tale-search-field__input', 'tale-search-field__clear']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SearchField.Root>
              <SearchField.Label>Search</SearchField.Label>
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton><Icon icon={XLucide} size="sm" /></SearchField.ClearButton>
            </SearchField.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <SearchField.Root isDisabled>
              <SearchField.Input placeholder="Disabled search" />
            </SearchField.Root>
          </div>
        </Section>

        <Section id="text-field" title="TextField" classes={['tale-text-field__input']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
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
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
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

        <Section id="select-native" title="SelectNative" classes={['tale-select-native', 'tale-select-native--sm', 'tale-select-native--md', 'tale-select-native--lg']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SelectNative>
              <option value="">Select an option</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </SelectNative>
          </div>
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SelectNative size="sm"><option>Small</option></SelectNative>
            <SelectNative size="md"><option>Medium</option></SelectNative>
            <SelectNative size="lg"><option>Large</option></SelectNative>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <SelectNative disabled><option>Disabled</option></SelectNative>
          </div>
        </Section>

        <Section id="grid-list" title="GridList" classes={['tale-grid-list', 'tale-grid-list__item']}>
          <SubHeading>Default</SubHeading>
          <GridList.Root aria-label="Items" className="audit__demo-medium">
            {['Item One', 'Item Two', 'Item Three', 'Item Four'].map((item) => (
              <GridList.Item key={item} id={item} textValue={item}>{item}</GridList.Item>
            ))}
          </GridList.Root>
          <SubHeading>With Selection</SubHeading>
          <GridList.Root aria-label="Selectable items" selectionMode="multiple" className="audit__demo-medium">
            {['Design tokens', 'Components', 'Documentation', 'Testing'].map((item) => (
              <GridList.Item key={item} id={item} textValue={item}>{item}</GridList.Item>
            ))}
          </GridList.Root>
          <SubHeading>With Icons</SubHeading>
          <GridList.Root aria-label="Items with icons" selectionMode="single" className="audit__demo-medium">
            {([['Favorites', Star], ['Liked', Heart], ['Alerts', Bell], ['Settings', Settings]] as const).map(([label, icon]) => (
              <GridList.Item key={label} id={label} textValue={label}><Icon icon={icon} size="sm" />{label}</GridList.Item>
            ))}
          </GridList.Root>
        </Section>

        <Section id="table" title="Table" classes={['tale-table', 'tale-table__header', 'tale-table__column', 'tale-table__body', 'tale-table__row', 'tale-table__cell']}>
          <SubHeading>Default</SubHeading>
          <Table.Root aria-label="People" className="audit__demo-extra-wide">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="alice-default">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row id="bob-default">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row id="charlie-default">
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <SubHeading>With Selection</SubHeading>
          <Table.Root aria-label="Selectable people" selectionMode="multiple" className="audit__demo-extra-wide">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="alice">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row id="bob">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row id="charlie">
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <SubHeading>With Sorting</SubHeading>
          <SortableTableDemo />
        </Section>

        <Section id="featured-icon" title="FeaturedIcon" classes={['tale-featured-icon', 'tale-featured-icon--brand', 'tale-featured-icon--error', 'tale-featured-icon--warning', 'tale-featured-icon--success', 'tale-featured-icon--neutral', 'tale-featured-icon--square', 'tale-featured-icon--sm', 'tale-featured-icon--md', 'tale-featured-icon--lg']}>
          <SubHeading>Variants</SubHeading>
          <Row>
            <FeaturedIcon variant="brand"><Icon icon={Star} /></FeaturedIcon>
            <FeaturedIcon variant="error"><Icon icon={AlertCircle} /></FeaturedIcon>
            <FeaturedIcon variant="warning"><Icon icon={AlertCircle} /></FeaturedIcon>
            <FeaturedIcon variant="success"><Icon icon={CheckCircle} /></FeaturedIcon>
            <FeaturedIcon variant="neutral"><Icon icon={Info} /></FeaturedIcon>
          </Row>
          <SubHeading>Square shape</SubHeading>
          <Row>
            <FeaturedIcon variant="brand" shape="square"><Icon icon={Star} /></FeaturedIcon>
            <FeaturedIcon variant="error" shape="square"><Icon icon={AlertCircle} /></FeaturedIcon>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <FeaturedIcon size="sm"><Icon icon={Star} /></FeaturedIcon>
            <FeaturedIcon size="md"><Icon icon={Star} /></FeaturedIcon>
            <FeaturedIcon size="lg"><Icon icon={Star} /></FeaturedIcon>
          </Row>
        </Section>

        <Section id="rating-badge" title="RatingBadge" classes={['tale-rating-badge', 'tale-rating-badge--sm', 'tale-rating-badge--md', 'tale-rating-badge--lg']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <RatingBadge value={4.5} />
            <RatingBadge value={3.8} />
            <RatingBadge value={5.0} />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <RatingBadge value={4.5} size="sm" />
            <RatingBadge value={4.5} size="md" />
            <RatingBadge value={4.5} size="lg" />
          </Row>
        </Section>

        <Section id="rating-stars" title="RatingStars" classes={['tale-rating-stars', 'tale-rating-stars__star', 'tale-rating-stars__star--filled', 'tale-rating-stars__star--half']}>
          <SubHeading>Default</SubHeading>
          <Row>
            <RatingStars value={3} />
            <RatingStars value={3.5} />
            <RatingStars value={5} />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <RatingStars value={4} size="sm" />
            <RatingStars value={4} size="md" />
            <RatingStars value={4} size="lg" />
          </Row>
        </Section>

        <Section id="tag-group" title="TagGroup" classes={['tale-tag-group', 'tale-tag-group__list', 'tale-tag-group__tag', 'tale-tag-group__label', 'tale-tag-group__description']}>
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
          <SubHeading>With Description</SubHeading>
          <TagGroup.Root>
            <TagGroup.Label>Interests</TagGroup.Label>
            <TagGroup.Description>Select your areas of interest.</TagGroup.Description>
            <TagGroup.List>
              <TagGroup.Tag id="frontend">Frontend</TagGroup.Tag>
              <TagGroup.Tag id="backend">Backend</TagGroup.Tag>
              <TagGroup.Tag id="devops">DevOps</TagGroup.Tag>
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
          <SubHeading>With Selection</SubHeading>
          <TagGroup.Root selectionMode="multiple" defaultSelectedKeys={['rust']}>
            <TagGroup.Label>Languages</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="ts2">TypeScript</TagGroup.Tag>
              <TagGroup.Tag id="rust">Rust</TagGroup.Tag>
              <TagGroup.Tag id="python">Python</TagGroup.Tag>
              <TagGroup.Tag id="go">Go</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
        </Section>

        <Section id="tree" title="Tree" classes={['tale-tree', 'tale-tree__item', 'tale-tree__item-content']}>
          <SubHeading>Default</SubHeading>
          <Tree.Root aria-label="File browser" className="audit__demo-medium">
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
          <SubHeading>With Expanded</SubHeading>
          <Tree.Root aria-label="Documents" defaultExpandedKeys={['docs', 'guides']} className="audit__demo-medium">
            <Tree.Item id="docs" textValue="docs">
              <Tree.ItemContent>docs/</Tree.ItemContent>
              <Tree.Item id="guides" textValue="guides">
                <Tree.ItemContent>guides/</Tree.ItemContent>
                <Tree.Item id="getting-started" textValue="getting-started.md">
                  <Tree.ItemContent>getting-started.md</Tree.ItemContent>
                </Tree.Item>
                <Tree.Item id="advanced" textValue="advanced.md">
                  <Tree.ItemContent>advanced.md</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
              <Tree.Item id="api" textValue="api">
                <Tree.ItemContent>api/</Tree.ItemContent>
                <Tree.Item id="ref" textValue="reference.md">
                  <Tree.ItemContent>reference.md</Tree.ItemContent>
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
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
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
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
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
          <div className="audit__demo-narrow">
            <DatePicker.Root>
              <DatePicker.Label>Date</DatePicker.Label>
              <DatePicker.Group>
                <DatePicker.DateInput>
                  {(segment) => <DatePicker.Segment segment={segment} />}
                </DatePicker.DateInput>
                <DatePicker.Trigger />
              </DatePicker.Group>
              <DatePicker.Popover>
                <DatePicker.Dialog>
                  <Calendar.Root>
                    <Calendar.Header>
                      <Calendar.PreviousButton />
                      <Calendar.Heading />
                      <Calendar.NextButton />
                    </Calendar.Header>
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
          <div className="audit__demo-wide">
            <DateRangePicker.Root>
              <DateRangePicker.Label>Trip dates</DateRangePicker.Label>
              <DateRangePicker.Group>
                <DateRangePicker.StartDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.StartDate>
                <span aria-hidden="true" className="audit__date-separator">–</span>
                <DateRangePicker.EndDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.EndDate>
                <DateRangePicker.Trigger />
              </DateRangePicker.Group>
              <DateRangePicker.Popover>
                <DateRangePicker.Dialog>
                  <RangeCalendar.Root>
                    <RangeCalendar.Header>
                      <RangeCalendar.PreviousButton />
                      <RangeCalendar.Heading />
                      <RangeCalendar.NextButton />
                    </RangeCalendar.Header>
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

        <Section id="range-calendar" title="RangeCalendar" classes={['tale-range-calendar__header', 'tale-range-calendar__heading', 'tale-range-calendar__grid', 'tale-range-calendar__grid-header', 'tale-range-calendar__grid-body', 'tale-range-calendar__cell']}>
          <SubHeading>Interactive</SubHeading>
          <RangeCalendar.Root>
            <RangeCalendar.Header>
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </RangeCalendar.Header>
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
          <ColorArea.Root defaultValue="hsl(0, 100%, 50%)" className="audit__color-area">
            <ColorArea.Thumb />
          </ColorArea.Root>
        </Section>

        <Section id="color-slider" title="ColorSlider" classes={['tale-color-slider', 'tale-color-slider__label', 'tale-color-slider__output', 'tale-color-slider__track', 'tale-color-slider__thumb']}>
          <SubHeading>Hue</SubHeading>
          <div className="audit__demo-narrow">
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
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
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
          <SubHeading>Standalone components with shared state</SubHeading>
          <ColorPickerDemo />
        </Section>

        {/* ============================================================= */}
        {/* MARKETING                                                      */}
        {/* ============================================================= */}

        <Section id="app-store-button" title="AppStoreButton" classes={['tale-app-store-button', 'tale-app-store-button--apple', 'tale-app-store-button--google', 'tale-app-store-button--sm', 'tale-app-store-button--md', 'tale-app-store-button--lg']}>
          <SubHeading>Both stores</SubHeading>
          <Row>
            <AppStoreButton store="apple" href="#" />
            <AppStoreButton store="google" href="#" />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <AppStoreButton store="apple" size="sm" href="#" />
            <AppStoreButton store="apple" size="md" href="#" />
            <AppStoreButton store="apple" size="lg" href="#" />
          </Row>
        </Section>

        <Section id="social-button" title="SocialButton" classes={['tale-social-button', 'tale-social-button--google', 'tale-social-button--github', 'tale-social-button--apple', 'tale-social-button--x', 'tale-social-button--facebook', 'tale-social-button--sm', 'tale-social-button--md', 'tale-social-button--lg']}>
          <SubHeading>Providers</SubHeading>
          <Row>
            <SocialButton provider="google">Continue with Google</SocialButton>
            <SocialButton provider="github">Continue with GitHub</SocialButton>
            <SocialButton provider="apple">Continue with Apple</SocialButton>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <SocialButton provider="google" size="sm">Google (sm)</SocialButton>
            <SocialButton provider="google" size="md">Google (md)</SocialButton>
            <SocialButton provider="google" size="lg">Google (lg)</SocialButton>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* INTERACTION                                                    */}
        {/* ============================================================= */}

        <Section id="drop-zone" title="DropZone" classes={['tale-drop-zone']}>
          <SubHeading>Default</SubHeading>
          <DropZone onDrop={() => {}}>
            <div className="audit__dropzone-content">
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

      </main>
    </div>
    </>
  );
}
