/**
 * A2UI Catalog Metadata — Single Source of Truth
 *
 * Shared by generate-a2ui-catalog.js and generate-a2ui-catalog-docs.js.
 * Contains type descriptions, allowed prop values, and sub-part definitions.
 */

/** Human-readable description per catalog type. */
const TYPE_DESCRIPTIONS = {
  Text: 'Typography wrapper with variant, size, and colour props',
  Row: 'Horizontal flex-row layout with gap, align, and justify',
  Column: 'Vertical flex-column layout with gap, align, and justify',
  Card: 'Surface container with header, body, and footer sections',
  Image: 'Styled image wrapper with radius and fit props',
  List: 'Simple non-interactive list with optional dividers',
  ListItem: 'Individual item within a List',
  Badge: 'Small status label with colour variants',
  Icon: 'Lucide icon wrapper resolved by name string',
  Separator: 'Visual divider between content sections',
  Link: 'Navigation link',
  Button: 'Action button with variant, size, and loading state',
  TextInput: 'Single-line text field with label, description, and validation',
  Checkbox: 'Checkbox input with indicator and label',
  Radio: 'Radio group container for RadioOption children',
  RadioOption: 'Individual radio option with indicator and label',
  Select: 'Dropdown select with trigger, popover, and list box',
  SelectItem: 'Individual option within a Select',
  Switch: 'Toggle switch with thumb and label',
  Table: 'Data table with sorting and selection',
  Tabs: 'Tabbed interface with panels',
  Progress: 'Linear progress bar (determinate or indeterminate)',
  Spinner: 'Loading indicator (circle, line, or dots)',
  Form: 'Form container with submit action handling',
  CardHeader: 'Header section within a Card',
  CardBody: 'Body section within a Card',
  CardFooter: 'Footer section within a Card',
  Avatar: 'User profile image with fallback initials',
  AvatarImage: 'Image within an Avatar',
  AvatarFallback: 'Fallback text/initials within an Avatar',
  Banner: 'Inline notification with icon, title, and description',
  Disclosure: 'Single collapsible section',
  DisclosureTrigger: 'Clickable trigger to expand/collapse a Disclosure',
  DisclosurePanel: 'Collapsible content panel within a Disclosure',
  TextAreaInput: 'Multi-line text field with label and description',
  NumberInput: 'Numeric input with increment/decrement buttons',
  SliderInput: 'Range slider with label and output display',
  SearchInput: 'Search field with clear button',
  Accordion: 'Group of collapsible disclosure sections',
  AccordionItem: 'Individual collapsible item within an Accordion',
  AccordionHeader: 'Header wrapper within an AccordionItem',
  AccordionTrigger: 'Clickable trigger within an AccordionHeader',
  AccordionPanel: 'Collapsible content panel within an AccordionItem',
  Menu: 'Dropdown menu with trigger',
  MenuTrigger: 'Button that opens a Menu',
  MenuPopover: 'Popover containing the menu list',
  MenuItem: 'Actionable item within a Menu',
  MenuSeparator: 'Visual divider between menu items',
};

/**
 * Allowed values per prop name. This is the single source of truth for
 * what values the system prompt and integration guide document.
 */
const PROP_VALUES = {
  spacing: '`4xs`, `3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`',
  alignment: '`start`, `center`, `end`, `stretch`, `baseline`',
  justify: '`start`, `center`, `end`, `between`',
  wrap: 'boolean',
  size: '`sm`, `md`, `lg`',
  disabled: 'boolean',
  required: 'boolean',
  label: 'string',
  children: 'array of component IDs',
  content: 'string',
  usageHint: '`display-l`, `display-m`, `display-s`, `heading-l`, `heading-m`, `heading-s`, `heading`, `title`, `label`, `body`, `body-s`, `caption`, `mono`',
  color: '`default`, `muted`, `accent`',
  variant: '`outlined`, `elevated`, `filled`',
  padding: '`sm`, `md`, `lg`',
  src: 'URL string or `{ "path": "..." }` binding',
  alt: 'string (required)',
  radius: '`none`, `sm`, `md`, `lg`, `full`',
  fit: '`cover`, `contain`, `fill`, `none`',
  width: 'number or string',
  height: 'number or string',
  tone: '`neutral`, `brand`, `error`, `warning`, `success`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`',
  type: '`pill`, `rounded`, `modern`',
  name: 'lucide icon name (e.g. `search`, `user`, `settings`, `heart`, `check`, `x`, `plus`, `edit`, `trash`, `mail`, `bell`, `home`, `menu`)',
  orientation: '`horizontal`, `vertical`',
  href: 'URL string',
  target: '`_blank`, `_self`',
  action: '`{ "name": "...", "context": { ... } }`',
  binding: '`{ "path": "fieldName" }`',
  defaultValue: 'string or number',
  defaultSelected: 'boolean',
  readOnly: 'boolean',
  description: 'string (helper text)',
  errorMessage: 'string',
  placeholder: 'string',
  value: 'number or `{ "path": "..." }` binding',
  minValue: 'number',
  maxValue: 'number',
  step: 'number',
  id: 'string',
  defaultTab: 'string (tab ID)',
  indeterminate: 'boolean',
  icon: 'boolean (show/hide icon)',
  title: 'string',
  defaultExpanded: 'boolean',
  allowsMultipleExpanded: 'boolean',
  defaultExpandedKeys: 'array of string IDs',
  initials: 'string (e.g. "JD")',
  selectionMode: 'string',
};

/**
 * Per-type overrides for props that share names but have different
 * allowed values depending on the component.
 * Key format: "TypeName.propName"
 */
const PROP_VALUE_OVERRIDES = {
  'Button.variant': '`primary`, `neutral`, `ghost`, `danger`',
  'Banner.variant': '`info`, `success`, `warning`, `error`',
  'Banner.size': '`sm`, `md`',
  'Spinner.variant': '`circle`, `line`, `dots`',
  'Spinner.size': '`sm`, `md`, `lg`',
  'List.variant': '`plain`, `divided`',
  'List.density': '`compact`, `default`, `spacious`',
  'Avatar.size': '`sm`, `md`, `lg`',
  'Checkbox.size': '`sm`, `md`',
  'Switch.size': '`sm`, `md`',
};

/** Types that are sub-parts of compound components (not top-level types). */
const SUB_PARTS = new Set([
  'CardHeader', 'CardBody', 'CardFooter', 'ListItem', 'RadioOption', 'SelectItem',
  'AvatarImage', 'AvatarFallback',
  'DisclosureTrigger', 'DisclosurePanel',
  'AccordionItem', 'AccordionHeader', 'AccordionTrigger', 'AccordionPanel',
  'MenuTrigger', 'MenuPopover', 'MenuItem', 'MenuSeparator',
]);

module.exports = { TYPE_DESCRIPTIONS, PROP_VALUES, PROP_VALUE_OVERRIDES, SUB_PARTS };
