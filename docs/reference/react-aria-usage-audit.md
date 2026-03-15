# React Aria Usage By Exported Module

Generated from exports listed in `packages/react/src/index.ts`.

## Legend

- **RAC component(s)** — The React Aria Components used internally.
- **Name mismatches** — Where the Tale UI part name differs from the RAC component name.

## Components using React Aria Components

| Module | RAC component(s) used | Name mismatches (Tale UI → RAC) |
| --- | --- | --- |
| accordion | DisclosureGroup, Disclosure, DisclosurePanel, Button | — |
| alert-dialog | DialogTrigger, Modal, ModalOverlay, Dialog, Heading, Button | Popup (kept intentionally) |
| autocomplete | Autocomplete, SearchField, Input, ListBox, ListBoxItem, ListBoxSection, Header, Separator | — |
| breadcrumbs | Breadcrumbs, Breadcrumb, Link | — |
| button | Button | — |
| calendar | Calendar, CalendarGrid, CalendarGridHeader, CalendarHeaderCell, CalendarGridBody, CalendarCell, Heading, Button | — |
| checkbox | Checkbox | — |
| checkbox-group | CheckboxGroup | — |
| color-area | ColorArea, ColorThumb | — |
| color-field | ColorField, Input, Label, Text, FieldError | — |
| color-picker | ColorPicker | — |
| color-slider | ColorSlider, SliderTrack, ColorThumb, Label, SliderOutput | — |
| color-swatch | ColorSwatch | — |
| color-swatch-picker | ColorSwatchPicker, ColorSwatchPickerItem | — |
| color-wheel | ColorWheel, ColorWheelTrack, ColorThumb | — |
| combobox | ComboBox, Input, Button, ListBox, ListBoxItem, ListBoxSection, Popover, Label, Header, Separator | — |
| context-menu | MenuTrigger, Menu, MenuItem, MenuSection, Popover, Separator | — |
| date-field | DateField, DateInput, DateSegment, Label, Text, FieldError | — |
| date-picker | DatePicker, DateInput, DateSegment, Button, Popover, Dialog, Label, Text, FieldError | — |
| date-range-picker | DateRangePicker, DateInput, DateSegment, Button, Popover, Dialog, Label, Text, FieldError | — |
| dialog | DialogTrigger, Modal, ModalOverlay, Dialog, Heading, Button | Popup (kept intentionally) |
| disclosure | Disclosure, DisclosurePanel, Button | — |
| drop-zone | DropZone | — |
| field | Label, Text, FieldError | — |
| file-trigger | FileTrigger | — |
| form | Form | — |
| grid-list | GridList, GridListItem | — |
| i18n-provider | I18nProvider, useLocale | — |
| input | TextField, Input, Label, Text | — |
| link | Link | — |
| menu | MenuTrigger, Menu, MenuItem, MenuSection, Popover, Header, Separator | — |
| meter | Meter | — |
| number-field | NumberField, Group, Input, Button, Label, Text, FieldError | — |
| popover | DialogTrigger, Popover, Dialog, Heading, Button, OverlayArrow | Popup (kept intentionally) |
| preview-card | DialogTrigger, Popover, Dialog, Button | — |
| progress-bar | ProgressBar | — |
| radio | Radio, RadioGroup | — |
| radio-group | _(re-exports Radio.Group)_ | — |
| range-calendar | RangeCalendar, CalendarGrid, CalendarGridHeader, CalendarHeaderCell, CalendarGridBody, CalendarCell, Heading, Button | — |
| search-field | SearchField, Input, Label, Text, FieldError, Button | — |
| select | Select, SelectValue, Button, ListBox, ListBoxItem, ListBoxSection, Popover, Label, Header, Separator | — |
| separator | Separator | — |
| slider | Slider, SliderTrack, SliderThumb, SliderOutput, Label | — |
| switch | Switch | — |
| table | Table, TableHeader, Column, TableBody, Row, Cell | — |
| tabs | Tabs, TabList, Tab, TabPanel | — |
| tag-group | TagGroup, TagList, Tag, Label, Text, FieldError | — |
| text-area | TextField, TextArea, Label, Text, FieldError | — |
| text-field | TextField, Input, Label, Text, FieldError | — |
| time-field | TimeField, DateInput, DateSegment, Label, Text, FieldError | — |
| toggle-button | ToggleButton | — |
| toggle-group | ToggleButtonGroup | — |
| toolbar | Toolbar | — |
| tooltip | TooltipTrigger, Tooltip, OverlayArrow, Button | Popup (kept intentionally) |
| tree | Tree, TreeItem, TreeItemContent | — |

## Components not using RAC

Utility, layout, or provider components with no interactive RAC equivalent:

| Module | Implementation | Reason |
| --- | --- | --- |
| avatar | Plain HTML (`<span>`, `<img>`) | No RAC equivalent — non-interactive |
| container | Plain HTML (`<div>`) + CSS variables | Color theming utility — no RAC equivalent |
| csp-provider | React Context provider | CSP nonce provider — no RAC equivalent |
| drawer | Plain HTML elements | No RAC drawer primitive. Could use Modal/ModalOverlay for focus trapping and `aria-modal` semantics; slide-in panel layout is custom. |
| fieldset | HTML `<fieldset>` / `<legend>` | Semantic HTML — no RAC equivalent needed |
| menubar | Plain HTML (`<div role="menubar">`) | No RAC `Menubar` component. RAC's `Toolbar` handles arrow-key navigation but not `role="menubar"` semantics. |
| merge-props | Utility function | Not a component |
| navigation-menu | Plain HTML (`<nav>`, `<ul>`, `<li>`) | Custom navigation layout — no RAC equivalent |
| scroll-area | Plain HTML divs | Custom scroll primitives — no RAC equivalent |
