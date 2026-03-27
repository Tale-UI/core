# Component Index

Quick-reference table for all 82 `@tale-ui/react` components. For detailed usage, see the per-component docs in [docs/components/](components/index.md).

## Form Controls (21)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Button | Action button with variant and size props | `@tale-ui/react/button` | -- |
| Input | Text input with label, description, and validation | `@tale-ui/react/input` | Root, Input, Label, Description, ErrorMessage |
| Checkbox | Checkbox with visual indicator | `@tale-ui/react/checkbox` | Root, Indicator |
| CheckboxGroup | Groups multiple checkboxes with validation | `@tale-ui/react/checkbox-group` | -- |
| Radio | Radio button with group support | `@tale-ui/react/radio` | Group, Root, Indicator, Dot |
| RadioGroup | Convenience re-export of `Radio.Group` | `@tale-ui/react/radio-group` | -- |
| Switch | Toggle switch with sliding thumb | `@tale-ui/react/switch` | Root, Thumb |
| ToggleButton | Pressable toggle with selected/unselected state | `@tale-ui/react/toggle-button` | -- |
| ToggleButtonGroup | Group of toggle buttons | `@tale-ui/react/toggle-group` | -- |
| Select | Dropdown select with popover listbox | `@tale-ui/react/select` | Root, Label, Trigger, Value, Icon, Popover, ListBox, Item, Section, Header, ItemText, ItemIndicator, Separator |
| Combobox | Filterable select with multi-select support | `@tale-ui/react/combobox` | Root, Label, InputGroup, Input, Trigger, Popover, ListBox, Item, Section, Header, Empty, Chips, Chip, ChipRemove, ItemIndicator, Separator |
| Autocomplete | Inline search with filterable listbox | `@tale-ui/react/autocomplete` | Root, SearchField, Input, ListBox, Item, Section, Header, Empty, Separator |
| NumberField | Numeric input with increment/decrement | `@tale-ui/react/number-field` | Root, Label, Group, Input, Increment, Decrement, Description, ErrorMessage |
| Slider | Range input with single or dual thumbs | `@tale-ui/react/slider` | Root, Header, Label, Output, Control, Track, Indicator, Thumb |
| SearchField | Search input with clear button | `@tale-ui/react/search-field` | Root, Input, Label, Description, ErrorMessage, ClearButton |
| TextField | Single-line text input with validation | `@tale-ui/react/text-field` | Root, Input, Label, Description, ErrorMessage |
| TextArea | Multi-line text input with validation | `@tale-ui/react/text-area` | Root, TextArea, Label, Description, ErrorMessage |
| PaymentInput | Credit card number input with auto-formatting and card type detection | `@tale-ui/react/payment-input` | Root, Label, Group, Input, CardIcon, Description, ErrorMessage |
| PinInput | OTP/verification code input | `@tale-ui/react/pin-input` | Root, Group, Slot, Separator |
| SelectNative | Styled native `<select>` element | `@tale-ui/react/select-native` | -- |

## Date & Time (6)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Calendar | Interactive date calendar | `@tale-ui/react/calendar` | Root, Header, PreviousButton, NextButton, Heading, Grid, GridHeader, GridHeaderCell, GridBody, Cell |
| RangeCalendar | Date range selection calendar | `@tale-ui/react/range-calendar` | Root, Header, Grid, GridHeader, GridHeaderCell, GridBody, Cell, Heading, PreviousButton, NextButton |
| DateField | Segmented date input | `@tale-ui/react/date-field` | Root, DateInput, Segment, Label, Description, ErrorMessage |
| DatePicker | Date field with calendar popover | `@tale-ui/react/date-picker` | Root, Group, DateInput, Segment, Trigger, Popover, Dialog, Label, Description, ErrorMessage |
| DateRangePicker | Start/end date picker | `@tale-ui/react/date-range-picker` | Root, Group, StartDate, EndDate, Segment, Trigger, Popover, Dialog, Label, Description, ErrorMessage |
| TimeField | Segmented time input | `@tale-ui/react/time-field` | Root, DateInput, Segment, Label, Description, ErrorMessage |

## Color (7)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| ColorArea | 2D color picker surface | `@tale-ui/react/color-area` | Root, Thumb |
| ColorSlider | Single-channel color slider | `@tale-ui/react/color-slider` | Root, Track, Thumb, Label, Output |
| ColorWheel | Circular hue selector | `@tale-ui/react/color-wheel` | Root, Track, Thumb |
| ColorSwatch | Color preview element | `@tale-ui/react/color-swatch` | -- |
| ColorSwatchPicker | Selectable swatch grid | `@tale-ui/react/color-swatch-picker` | Root, Item |
| ColorField | Text input for color values | `@tale-ui/react/color-field` | Root, Input, Label, Description, ErrorMessage |
| ColorPicker | Headless color state provider | `@tale-ui/react/color-picker` | -- |

## Overlay (6)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Dialog | Modal dialog with backdrop | `@tale-ui/react/dialog` | Root, Trigger, Backdrop, Popup, Title, Description, Close, Actions |
| AlertDialog | Confirmation dialog | `@tale-ui/react/alert-dialog` | Root, Trigger, Backdrop, Popup, Content, Title, Description, Close, Actions |
| Popover | Anchored popup | `@tale-ui/react/popover` | Root, Trigger, Popup, Arrow, Title, Description, Close |
| PreviewCard | Hover preview card | `@tale-ui/react/preview-card` | Root, Trigger, Popup, Content, Arrow |
| Drawer | Slide-in panel | `@tale-ui/react/drawer` | Root, Trigger, Backdrop, Popup, Title, Description, Close, Handle, SwipeArea |
| Tooltip | Hover tooltip | `@tale-ui/react/tooltip` | Root, Trigger, Popup, Arrow, Title, Description |

## Navigation (7)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Menu | Dropdown menu with items and groups | `@tale-ui/react/menu` | Root, Trigger, Popover, MenuList, Item, Group, Header, Separator, Arrow, CheckboxItem, RadioItem, LinkItem, SubmenuTrigger |
| ContextMenu | Right-click context menu | `@tale-ui/react/context-menu` | Root, Trigger, Popup, MenuList, Item, Group, ContextMenuSeparator |
| NavigationMenu | Top-level navigation bar | `@tale-ui/react/navigation-menu` | Root, List, Item, Link, Trigger, Popup, Content, Icon |
| Menubar | Horizontal menu bar | `@tale-ui/react/menubar` | Root, Item |
| Breadcrumbs | Breadcrumb navigation | `@tale-ui/react/breadcrumbs` | Root, Item, Link |
| Link | Styled anchor link | `@tale-ui/react/link` | -- |
| Pagination | Page navigation controls | `@tale-ui/react/pagination` | Root, PreviousTrigger, NextTrigger, Item, Ellipsis |

## Layout (7)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Accordion | Collapsible content sections | `@tale-ui/react/accordion` | Root, Item, Header, Trigger, Panel |
| Disclosure | Single collapsible section | `@tale-ui/react/disclosure` | Root, Trigger, Panel |
| Tabs | Tabbed content with indicator | `@tale-ui/react/tabs` | Root, List, Tab, Panel, Indicator |
| ScrollArea | Custom scrollbar container | `@tale-ui/react/scroll-area` | Root, Viewport, Content, Scrollbar, Thumb, Corner |
| Separator | Horizontal or vertical divider | `@tale-ui/react/separator` | -- |
| Toolbar | Grouped action bar | `@tale-ui/react/toolbar` | Root, Group, Button, Link, Input, Separator |
| Carousel | Slide carousel with navigation | `@tale-ui/react/carousel` | Root, Content, Item, PreviousTrigger, NextTrigger, Indicators, Indicator |

## Feedback (4)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Banner | Inline notification banner | `@tale-ui/react/banner` | Root, BannerIcon, Title, Description, Actions, Close |
| ProgressBar | Determinate/indeterminate progress | `@tale-ui/react/progress-bar` | Root, Header, Label, Value, Track, Indicator |
| Meter | Scalar measurement display | `@tale-ui/react/meter` | Root, Header, Label, Value, Track, Indicator |
| Spinner | Indeterminate loading indicator | `@tale-ui/react/spinner` | -- |

## Display (11)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Avatar | User avatar with image, fallback, group, count, indicator, and label group | `@tale-ui/react/avatar` | Root, Image, Fallback, Group, Count, Indicator, LabelGroup, LabelGroupTitle, LabelGroupSubtitle |
| Badge | Small status label with semantic variants | `@tale-ui/react/badge` | -- |
| DotIcon | Small colored circle status indicator | `@tale-ui/react/dot-icon` | -- |
| EmptyState | Placeholder for empty content areas | `@tale-ui/react/empty-state` | Root, EmptyStateIcon, Title, Description, Actions |
| FeaturedIcon | Themed background wrapper for icons | `@tale-ui/react/featured-icon` | -- |
| GridList | Selectable grid of items | `@tale-ui/react/grid-list` | Root, Item |
| RatingBadge | Pill badge with star icon and numeric rating | `@tale-ui/react/rating-badge` | -- |
| RatingStars | Read-only star rating display | `@tale-ui/react/rating-stars` | -- |
| Table | Data table with sorting | `@tale-ui/react/table` | Root, Header, Column, Body, Row, Cell |
| TagGroup | Tag list with optional removal | `@tale-ui/react/tag-group` | Root, Label, List, Tag, Description, ErrorMessage |
| Tree | Hierarchical tree view | `@tale-ui/react/tree` | Root, Item, ItemContent |

## Form Structure (3)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| Field | Form field wrapper with label and validation | `@tale-ui/react/field` | Root, Label, Control, Description, Error, Item |
| Fieldset | Grouped fields with legend | `@tale-ui/react/fieldset` | Root, Legend |
| Form | Form element with validation | `@tale-ui/react/form` | -- |

## Interaction (2)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| DropZone | Drag-and-drop target | `@tale-ui/react/drop-zone` | -- |
| FileTrigger | Native file picker trigger | `@tale-ui/react/file-trigger` | -- |

## Utility (7)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| ColorModeToggle | Light/dark mode toggle with persistence | `@tale-ui/react/color-mode-toggle` | -- |
| Container | Colour palette override wrapper | `@tale-ui/react/container` | -- |
| CSPProvider | Content Security Policy nonce provider | `@tale-ui/react/csp-provider` | -- |
| I18nProvider | Locale and text direction provider | `@tale-ui/react/i18n-provider` | -- |
| Icon | Lucide-react icon wrapper with BEM sizing | `@tale-ui/react/icon` | -- |
| IconButton | Square button for icon-only use | `@tale-ui/react/icon-button` | -- |
| mergeProps | Smart React props merging utility | `@tale-ui/react/merge-props` | -- |

## Marketing (3)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| AppStoreButton | App store download button (Apple/Google) | `@tale-ui/react/app-store-button` | -- |
| SocialButton | Social login button with provider icon | `@tale-ui/react/social-button` | -- |
| SocialButtonGroup | Equal-width vertical group for social login buttons | `@tale-ui/react/social-button` | -- |

## Charts (6)

| Component | Description | Import | Parts |
|-----------|-------------|--------|-------|
| AreaChart | Token-themed area chart | `@tale-ui/charts/area-chart` | Root, Area, XAxis, YAxis, Grid, Tooltip, Legend |
| BarChart | Token-themed bar chart | `@tale-ui/charts/bar-chart` | Root, Bar, XAxis, YAxis, Grid, Tooltip, Legend |
| LineChart | Token-themed line chart | `@tale-ui/charts/line-chart` | Root, Line, XAxis, YAxis, Grid, Tooltip, Legend |
| PieChart | Token-themed pie chart | `@tale-ui/charts/pie-chart` | Root, Pie, Cell, Tooltip, Legend |
| RadarChart | Token-themed radar chart | `@tale-ui/charts/radar-chart` | Root, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend |
| RadialBarChart | Token-themed radial bar chart | `@tale-ui/charts/radial-bar-chart` | Root, RadialBar, Tooltip, Legend |
