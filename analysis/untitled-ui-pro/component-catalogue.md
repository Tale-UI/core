# UntitledUI Pro — Full Component Catalogue

## Base Components (20 directories)

### avatar/

| File | Exports | Pattern |
|---|---|---|
| `avatar.tsx` | `Avatar` | Single-tag with fallback chain (image → initials → icon) |
| `avatar-count.tsx` | `AvatarCount` | Overflow indicator (+3) |
| `avatar-group.tsx` | `AvatarGroup` | Stacked avatar container |
| `base-components/index.tsx` | Re-exports `AvatarAddButton`, `AvatarCompanyIcon`, `AvatarOnlineIndicator`, `VerifiedTick` | Sub-components |

**Features:** xs-2xl sizes, online/offline status, verified badge, contrast border, focus ring, group stacking.

### badges/

| File | Exports | Pattern |
|---|---|---|
| `badges.tsx` | `Badge` | Single-tag |

**Features:** sm/md/lg sizes, 12 color variants (gray, brand, error, warning, success, slate, sky, blue, indigo, purple, pink, orange), icon support, outline/modern/pill styles.

### button-group/

| File | Exports | Pattern |
|---|---|---|
| `button-group.tsx` | `ButtonGroup` | Container wrapper |

**Features:** Groups buttons with shared border styling, handles first/last/middle rounding.

### buttons/

| File | Exports | Pattern |
|---|---|---|
| `button.tsx` | `Button` | Polymorphic (button or link via `href`) |
| `app-store-button.tsx` | `AppStoreButton` | Pre-composed App Store/Play Store button |
| `button-close.tsx` | `ButtonClose` | Pre-composed close (X) button |
| `button-utility.tsx` | `ButtonUtility` | Icon-only utility button |
| `social-button.tsx` | `SocialButton` | Pre-composed social login button |

**Features:** xs-xl sizes, 9 color variants (primary, secondary, tertiary, link-color, link-gray, primary-destructive, secondary-destructive, tertiary-destructive, link-destructive), loading spinner, leading/trailing icons, polymorphic (button + anchor).

### checkbox/

| File | Exports | Pattern |
|---|---|---|
| `checkbox.tsx` | `Checkbox`, `CheckboxBase` | Single-tag + Base |

**Features:** sm/md sizes, label + hint, indeterminate state, SVG checkmark icon.

### dropdown/

| File | Exports | Pattern |
|---|---|---|
| `dropdown.tsx` | `Dropdown` namespace object | Compound namespace |
| `dropdown-button-simple.tsx` | Pre-composed trigger variants | Single-tag |
| `dropdown-button-advanced.tsx` | Pre-composed trigger variants | Single-tag |
| `dropdown-icon-simple.tsx` | Icon-based trigger | Single-tag |
| (14+ variant files) | Various pre-composed dropdowns | Single-tag |

**Sub-parts:** Root, Popover, Menu, Section, SectionHeader, Item, Separator, DotsButton.

**Features:** Checkmark/checkbox/radio/toggle selection indicators, icon + avatar support, addon text, disabled items, keyboard navigation.

### file-upload-trigger/

| File | Exports | Pattern |
|---|---|---|
| `file-upload-trigger.tsx` | `FileUploadTrigger` | Single-tag |

**Features:** Wraps React Aria's FileTrigger, styled as button.

### form/

| File | Exports | Pattern |
|---|---|---|
| `form.tsx` | `Form` | Thin wrapper around React Aria Form |
| `hook-form.tsx` | `HookForm`, `FormField`, `useFormFieldContext`, `useFormContext` | React Hook Form integration |

**Features:** React Aria form wrapper (form.tsx) + React Hook Form integration with field context (hook-form.tsx).

### input/

| File | Exports | Pattern |
|---|---|---|
| `input.tsx` | `InputBase`, `TextField`, `Input` | Compound (3 levels) |
| `label.tsx` | `Label` | Shared label component |
| `hint-text.tsx` | `HintText` | Shared hint/error text |
| `input-date.tsx` | `InputDate` | Date-specific input |
| `input-number.tsx` | `InputNumber` | Number with increment/decrement |
| `input-file.tsx` | `InputFile` | File input with button trigger |
| `input-group.tsx` | `InputGroup`, `InputPrefix` | Input with addons (prefix, leading/trailing) |
| `input-payment.tsx` | `PaymentInput` | Credit card input |
| `input-tags.tsx` | `InputTags` | Tag-based input |
| `input-tags-outer.tsx` | `InputTagsOuter` | Tag input with outer tag display |
| `pin-input.tsx` | `PinInput` | OTP/PIN input (input-otp) |

**Features:** sm/md/lg sizes, leading/trailing icons, password toggle, keyboard shortcut display, tooltip, full error state, 11 input files.

### progress-indicators/

| File | Exports | Pattern |
|---|---|---|
| `progress-bar.tsx` | `ProgressBar` | Single-tag |
| `progress-circle.tsx` | `ProgressCircle` | SVG-based circular |

**Features:** Linear and circular variants, percentage display, color variants.

### radio-buttons/

| File | Exports | Pattern |
|---|---|---|
| `radio-buttons.tsx` | `RadioGroup`, `RadioButton`, `RadioButtonBase` | Context + Base |

**Features:** sm/md sizes, label + hint, context-based size propagation.

### radio-groups/ (Pro-enhanced)

| File | Exports | Pattern |
|---|---|---|
| `radio-groups.tsx` | Barrel re-exports all variants | Namespace |
| `radio-group-icon-simple.tsx` | `RadioGroupIconSimple` | Data-driven |
| `radio-group-icon-card.tsx` | `RadioGroupIconCard` | Data-driven |
| `radio-group-icon-avatar.tsx` | `RadioGroupAvatar` | Data-driven |
| `radio-group-payment-icon.tsx` | `RadioGroupPaymentIcon` | Data-driven |
| `radio-group-radio-button.tsx` | `RadioGroupRadioButton` | Data-driven |
| `radio-group-checkbox.tsx` | `RadioGroupCheckbox` | Data-driven |

**Features:** 6 pre-built radio group layouts, all accept `items` array, zero consumer JSX composition.

### select/

| File | Exports | Pattern |
|---|---|---|
| `select.tsx` | `Select` (with `.ComboBox`, `.Item`) | Compound namespace |
| `select-item.tsx` | `SelectItem` | Sub-component |
| `select-shared.tsx` | `SelectContext`, types | Shared context |
| `combobox.tsx` | `ComboBox` | Searchable variant |
| `multi-select.tsx` | `MultiSelect` | Multi-selection |
| `tag-select.tsx` | `TagSelect` | Tag-based selection |
| `select-native.tsx` | `SelectNative` | Native `<select>` |
| `popover.tsx` | Popover container | Internal |

**Features:** sm/md/lg sizes, avatar in items, icon support, supporting text, label + hint, searchable, multi-select, tag-based, native fallback.

### slider/

| File | Exports | Pattern |
|---|---|---|
| `slider.tsx` | `Slider` | Single-tag |

**Features:** Range slider with label, size variants.

### tags/

| File | Exports | Pattern |
|---|---|---|
| `tags.tsx` | `TagGroup`, `Tag`, `TagList` | Context + compound |
| `base-components/tag-checkbox.tsx` | `TagCheckbox` | Sub-component |
| `base-components/tag-close-x.tsx` | `TagCloseX` | Sub-component |

**Features:** sm/md/lg sizes, selection modes (none/single/multiple), avatar support, close button, context-based config.

### text-editor/ (Pro-only)

| File | Exports | Pattern |
|---|---|---|
| `text-editor.tsx` | `TextEditor` namespace | Compound namespace |
| `text-editor-extensions.tsx` | TipTap extensions | Internal |
| `text-editor-toolbar.tsx` | Toolbar component | Internal |
| `text-editor-toolbar-buttons.tsx` | Individual toolbar buttons | Internal |
| `text-editor-link-popover.tsx` | Link insertion UI | Internal |
| `text-editor-color-picker.tsx` | Color picker UI | Internal |

**Sub-parts:** Root, Toolbar, Tooltip, Content, Label, HintText.

**Features:** Rich text editing (TipTap), character count, bold/italic/underline, text alignment, image insertion, link insertion (Cmd+K), color picker, font family/size, custom resize handles.

### textarea/

| File | Exports | Pattern |
|---|---|---|
| `textarea.tsx` | `TextAreaBase`, `TextArea` | Single-tag + Base |

**Features:** sm/md/lg sizes, label + hint, resize handle styling.

### toggle/

| File | Exports | Pattern |
|---|---|---|
| `toggle.tsx` | `Toggle`, `ToggleBase` | Single-tag + Base |

**Features:** sm/md sizes, slim variant, label + hint, animated switch.

### tooltip/

| File | Exports | Pattern |
|---|---|---|
| `tooltip.tsx` | `Tooltip`, `TooltipTrigger` | Single-tag |

**Features:** Wraps React Aria Tooltip, positioned overlay with arrow.

## Application Components (12 directories)

### app-navigation/

| File | Exports | Pattern |
|---|---|---|
| `header-navigation.tsx` | `HeaderNavigationBase` | Data-driven |
| `sidebar-navigation.tsx` | Multiple sidebar variants | Data-driven |
| `config.ts` | Navigation types and config | Types |
| `base-components/*.tsx` | NavButton, NavList, NavItem, MobileNavigationHeader, NavAccountCard | Internal sub-components |

**Features:** 7 navigation variants (header + 5 sidebar), mobile drawer, active state detection, badge support, recursive nav items, secondary nav (tabs/buttons).

### carousel/

| File | Exports | Pattern |
|---|---|---|
| `carousel-base.tsx` | `Carousel` namespace (Root, Content, Item, PrevTrigger, NextTrigger, IndicatorGroup, Indicator) | Compound namespace |

**Features:** Embla-based carousel with navigation, indicators.

### charts/

| File | Exports | Pattern |
|---|---|---|
| `charts-base.tsx` | Chart base components | Recharts-based |

**Features:** Built on Recharts, chart base utilities.

### date-picker/

| File | Exports | Pattern |
|---|---|---|
| `date-picker.tsx` | `DatePicker` | Compound |
| `date-range-picker.tsx` | `DateRangePicker` | Compound |
| `calendar.tsx` | `Calendar` | Internal |
| `range-calendar.tsx` | `RangeCalendar`, `RangePresetButton` | Internal |
| `cell.tsx` | Calendar cell | Internal |

**Features:** Calendar popup, date range selection, range presets (last week/month/year).

### empty-state/

| File | Exports | Pattern |
|---|---|---|
| `empty-state.tsx` | `EmptyState` | Single-tag |

**Features:** Placeholder for empty lists/tables with icon, title, description, action button.

### file-upload/

| File | Exports | Pattern |
|---|---|---|
| `file-upload.tsx` | `FileUpload` | Single-tag |

**Features:** Dropzone with drag-and-drop, file type filtering, progress tracking.

### loading-indicator/

| File | Exports | Pattern |
|---|---|---|
| `loading-indicator.tsx` | `LoadingIndicator` | Single-tag |

**Features:** 3 animated spinner types (line-simple, line-spinner, dot-circle), sm/md sizes, optional label.

### modals/

| File | Exports | Pattern |
|---|---|---|
| `modal.tsx` | `DialogTrigger`, `ModalOverlay`, `Modal`, `Dialog` | Thin React Aria wrappers |

**Features:** Backdrop blur, enter/exit animations, mobile bottom sheet, desktop centered.

### pagination/

| File | Exports | Pattern |
|---|---|---|
| `pagination.tsx` | `Pagination` namespace | Compound namespace |

**Sub-parts:** Root, PrevTrigger, NextTrigger, Item, Ellipsis, Context.

**Features:** Page numbers, prev/next, ellipsis for gaps.

### slideout-menus/

| File | Exports | Pattern |
|---|---|---|
| `slideout-menu.tsx` | `SlideoutMenu` namespace | Compound + render props |

**Sub-parts:** Trigger, Content, Header, Footer.

**Features:** Right-side drawer, slide animation, render props for close function, sticky header/footer.

### table/

| File | Exports | Pattern |
|---|---|---|
| `table.tsx` | `Table` and `TableCard` namespaces | Compound namespace |

**Sub-parts:** Header, Head, Body, Row, Cell + TableCard.Root, TableCard.Header.

**Features:** sm/md sizes, selection (single/multiple), sorting, header checkbox, row actions dropdown, tooltip on columns, context-based size.

### tabs/

| File | Exports | Pattern |
|---|---|---|
| `tabs.tsx` | `Tabs` namespace | Compound namespace |

**Sub-parts:** Root, List, Tab, Panel.

**Features:** 6 style variants (button-brand, button-gray, button-border, button-minimal, underline, line), responsive.

## Foundations (5 directories + 6 loose files)

| Component | Files | Description |
|---|---|---|
| `featured-icon/` | 1 file | Themed icon container with background |
| `integration-icons/` | 17 files | Tech service logos (Stripe, Slack, etc.) |
| `logo/` | 2 files | Full and minimal logo |
| `payment-icons/` | 57 files | Payment method icons (Visa, Mastercard, etc.) |
| `social-icons/` | 23 files | Social media icons |
| `dot-icon.tsx` | 1 file | Simple colored dot indicator |
| `folder-icon.tsx` | 1 file | Folder icon component |
| `play-button-icon.tsx` | 1 file | Play button for video |
| `rating-badge.tsx` | 1 file | Rating badge display |
| `rating-stars.tsx` | 1 file | Star rating display |
| `star-icon.tsx` | 1 file | Star icon component |

## Marketing (1 directory)

### header-navigation/

| File | Exports | Pattern |
|---|---|---|
| `header.tsx` | `Header` | Data-driven |

**Features:** Desktop mega-menu, mobile drawer, floating mode, full-width popover, responsive layout.

## Shared Assets (6 directories + 3 loose files)

| Component | Files | Description |
|---|---|---|
| `background-patterns/` | 5 files | SVG patterns (circle, grid, grid-check, square, index) |
| `banners/` | 20 files | Alert/promo banner templates |
| `credit-card/` | 2 files | Credit card display component + icons |
| `illustrations/` | 5 files | SVG illustrations (box, cloud, credit-card, documents, index) |
| `image-cropper/` | 3 files | Image crop tool (cropper, utils, CSS) |
| `not-found/` | 1 file | 404 page illustrations |
| `qr-code.tsx` | 1 file | QR code generator |
| `iphone-mockup.tsx` | 1 file | Device frame component |
| `section-divider.tsx` | 1 file | Visual section separator |

## Total File Count

| Category | Dirs | Loose Files | Total Files |
|---|---|---|---|
| Base | 20 | 0 | ~80 |
| Application | 12 | 0 | ~45 |
| Foundations | 5 | 6 | ~103 |
| Marketing | 1 | 0 | ~3 |
| Shared Assets | 6 | 3 | ~40 |
| **Total** | **44** | **9** | **~264 files** |
