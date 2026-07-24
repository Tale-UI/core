# UntitledUI Pro — Component Composition Patterns

UntitledUI Pro uses six distinct composition patterns depending on component complexity.

## Pattern 1: Simple Single-Tag (Pre-composed)

Used for components where internal structure is fixed and consumers rarely need to customize inner elements.

**Examples:** Checkbox, Toggle, Button, Badge

```tsx
// Consumer usage — single tag, all structure internal
<Checkbox label="Remember me" hint="Stay signed in for 30 days" size="sm" />

<Toggle label="Notifications" size="md" />

<Button size="md" color="primary" isLoading>Save changes</Button>
```

**Internal implementation pattern:**

```tsx
export const Checkbox = ({ label, hint, size = "sm", className, ...ariaCheckboxProps }) => {
    return (
        <AriaCheckbox {...ariaCheckboxProps}>
            {({ isSelected, isIndeterminate, isDisabled, isFocusVisible }) => (
                <>
                    <CheckboxBase
                        size={size}
                        isSelected={isSelected}
                        isIndeterminate={isIndeterminate}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                    />
                    {(label || hint) && (
                        <div>
                            {label && <span>{label}</span>}
                            {hint && <span>{hint}</span>}
                        </div>
                    )}
                </>
            )}
        </AriaCheckbox>
    );
};
```

**Key characteristics:**

- Wraps React Aria component directly
- Uses render function to access state (`isSelected`, `isDisabled`, etc.)
- Label/hint rendered conditionally via props
- Visual sub-component (`CheckboxBase`) handles all icon/indicator rendering

## Pattern 2: Base Component (Visual-Only Export)

Presentational components that render the visual appearance without any React Aria behavior wrapper. Exported alongside the full component for advanced use cases.

**Examples:** CheckboxBase, ToggleBase, RadioButtonBase

```tsx
// CheckboxBase — visual only, no Aria behavior
export const CheckboxBase = ({
    size = "sm",
    isSelected,
    isDisabled,
    isIndeterminate,
    isFocusVisible,
}) => {
    return (
        <div className={cx(/* conditional styles */)}>
            <svg>/* checkmark icon */</svg>
            <svg>/* indeterminate dash icon */</svg>
        </div>
    );
};
```

**Use cases:**

- Embedding checkbox visuals in custom layouts (e.g., inside a dropdown item)
- Using outside React Aria's form infrastructure
- Building custom compound components that need the visual but not the behavior

## Pattern 3: Compound Namespace Object

Used for complex components with multiple composable parts. Parts are attached as static properties on the main export.

**Examples:** TextEditor, Table, Dropdown, SlideoutMenu

```tsx
// Export pattern
export const TextEditor = {
    Root: TextEditorRoot,
    Toolbar: TextEditorToolbar,
    Tooltip: TextEditorTooltip,
    Content: TextEditorContent,
    Label: TextEditorLabel,
    HintText: TextEditorHintText,
};

// Consumer usage
<TextEditor.Root limit={500}>
    <TextEditor.Label>Description</TextEditor.Label>
    <TextEditor.Toolbar />
    <TextEditor.Content placeholder="Write something..." />
    <TextEditor.HintText />
</TextEditor.Root>
```

**Table example:**

```tsx
const Table = TableRoot as typeof TableRoot & {
    Body: typeof AriaTableBody;
    Head: typeof TableHead;
    Header: typeof TableHeader;
    Row: typeof TableRow;
    Cell: typeof TableCell;
};
Table.Body = AriaTableBody;
Table.Head = TableHead;
// ... etc

// Consumer usage
<Table selectionMode="multiple" size="sm">
    <Table.Header>
        <Table.Head>Name</Table.Head>
        <Table.Head>Status</Table.Head>
    </Table.Header>
    <Table.Body>
        <Table.Row>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>Active</Table.Cell>
        </Table.Row>
    </Table.Body>
</Table>
```

**Dropdown example:**

```tsx
export const Dropdown = {
    Root: DropdownRoot,           // AriaMenuTrigger wrapper
    Popover: DropdownPopover,     // Positioned overlay
    Menu: DropdownMenu,           // Menu container
    Section: DropdownSection,     // Group with optional header
    Item: DropdownItem,           // Individual menu item
    Separator: DropdownSeparator, // Visual divider
    DotsButton: DotsButton,       // Pre-built trigger (three dots icon)
};
```

## Pattern 4: Context Propagation

Groups that provide shared configuration (size, selection mode) to children via React Context, avoiding prop drilling.

**Examples:** RadioGroup, TagGroup, Select, TextField, Table

```tsx
// Context definition
const RadioGroupContext = createContext<{
    selectionMode: "none" | "single" | "multiple";
    size: "sm" | "md" | "lg";
}>({ selectionMode: "none", size: "sm" });

// Parent provides context
export const RadioGroup = ({ size = "sm", children, ...props }) => {
    return (
        <RadioGroupContext.Provider value={{ size }}>
            <AriaRadioGroup {...props}>
                {children}
            </AriaRadioGroup>
        </RadioGroupContext.Provider>
    );
};

// Child reads context
export const RadioButton = ({ label, hint, ...ariaRadioProps }) => {
    const context = useContext(RadioGroupContext);
    const size = context?.size ?? "sm";

    return (
        <AriaRadio {...ariaRadioProps}>
            {({ isSelected, isDisabled, isFocusVisible }) => (
                <>
                    <RadioButtonBase size={size} isSelected={isSelected} ... />
                    {label && <span>{label}</span>}
                </>
            )}
        </AriaRadio>
    );
};
```

**TextField context (propagates size + className to InputBase):**

```tsx
export const TextField = ({ size = "md", inputClassName, wrapperClassName, ...props }) => {
    return (
        <TextFieldContext.Provider value={{ inputClassName, wrapperClassName, size }}>
            <AriaTextField {...props}>
                {children}
            </AriaTextField>
        </TextFieldContext.Provider>
    );
};
```

## Pattern 5: Render Props for State Access

Used when children need access to component lifecycle state (e.g., a `close` function for modals/drawers).

**Examples:** SlideoutMenu, Modal

```tsx
// SlideoutMenu.Content passes `close` via render props
<SlideoutMenu.Content>
    {({ close }) => (
        <>
            <SlideoutMenu.Header>Edit Profile</SlideoutMenu.Header>
            <form>
                <Input label="Name" />
                <Input label="Email" />
            </form>
            <SlideoutMenu.Footer>
                <Button color="secondary" onPress={close}>Cancel</Button>
                <Button color="primary">Save</Button>
            </SlideoutMenu.Footer>
        </>
    )}
</SlideoutMenu.Content>
```

**Internal implementation:**

```tsx
// Wraps React Aria's Dialog render function
<AriaDialog>
    {({ close }) => (
        typeof children === "function" ? children({ ...state, close }) : children
    )}
</AriaDialog>
```

## Pattern 6: Data-Driven Pre-composed

Used for components where the consumer provides structured data and the component renders the entire UI. Zero JSX composition required.

**Examples:** RadioGroupIconCard, RadioGroupAvatar, RadioGroupPaymentIcon, HeaderNavigation

```tsx
// Consumer provides items array — component renders everything
<RadioGroups.IconCard
    size="md"
    items={[
        {
            value: "basic",
            title: "Basic plan",
            description: "Includes 10 users",
            price: "$10/mo",
            icon: StarIcon,
        },
        {
            value: "business",
            title: "Business plan",
            description: "Includes 20 users",
            price: "$20/mo",
            icon: BuildingIcon,
        },
    ]}
/>
```

**Navigation with items config:**

```tsx
<HeaderNavigationBase
    activeUrl="/dashboard"
    items={[
        { label: "Dashboard", url: "/dashboard", icon: HomeIcon },
        { label: "Projects", url: "/projects", icon: FolderIcon, badge: "3" },
        { label: "Settings", url: "/settings", icon: SettingsIcon },
    ]}
    subItems={[
        { label: "Overview", url: "/dashboard/overview" },
        { label: "Analytics", url: "/dashboard/analytics" },
    ]}
    secondaryType="tabs"
/>
```

**Radio group variants (6 pre-built):**

```tsx
// All exported from a single re-export file
export { RadioGroupIconSimple as IconSimple } from "./radio-group-icon-simple";
export { RadioGroupIconCard as IconCard } from "./radio-group-icon-card";
export { RadioGroupAvatar as Avatar } from "./radio-group-icon-avatar";
export { RadioGroupPaymentIcon as PaymentIcon } from "./radio-group-payment-icon";
export { RadioGroupRadioButton as RadioButton } from "./radio-group-radio-button";
export { RadioGroupCheckbox as Checkbox } from "./radio-group-checkbox";

// Used as:
<RadioGroups.IconCard items={...} />
<RadioGroups.Avatar items={...} />
<RadioGroups.PaymentIcon items={...} />
```

## Export Strategies

### Named Exports (most common)

```tsx
export const Checkbox = (...) => { ... };
export const CheckboxBase = (...) => { ... };
```

### Namespace Object with Static Properties

```tsx
export const TextEditor = {
    Root: TextEditorRoot,
    Content: TextEditorContent,
    // ...
};
```

### Type-Augmented Namespace

```tsx
const _Select = Select as typeof Select & {
    ComboBox: typeof ComboBox;
    Item: typeof SelectItem;
};
_Select.ComboBox = ComboBox;
_Select.Item = SelectItem;
export { _Select as Select };
```

### Re-exported React Aria (thin wrappers)

```tsx
export const DialogTrigger = AriaDialogTrigger;
```

### Grouped Variant Re-exports

```tsx
// radio-groups.tsx (barrel file)
export { RadioGroupIconSimple as IconSimple } from "./radio-group-icon-simple";
export { RadioGroupIconCard as IconCard } from "./radio-group-icon-card";
```

## Props Interface Conventions

### CommonProps Pattern

```tsx
interface CommonProps {
    size?: "sm" | "md" | "lg";
    color?: keyof typeof styles.colors;
    isDisabled?: boolean;
    isLoading?: boolean;
}
```

### Extending React Aria Types

```tsx
export interface SelectProps
    extends Omit<AriaSelectProps<SelectItemType>, "children" | "items">,
        RefAttributes<HTMLDivElement>,
        CommonProps {
    items?: SelectItemType[];
    popoverClassName?: string;
    icon?: FC | ReactNode;
    children: ReactNode | ((item: SelectItemType) => ReactNode);
}
```

### Icon Prop Flexibility

Icons can be passed as either a component function or a React element:

```tsx
icon?: FC<{ className?: string }> | ReactNode;

// Internally resolved:
{isReactComponent(icon) ? <IconComponent className="..." /> : icon}
```

The `isReactComponent()` utility checks if the value is a function/class/forwardRef component.

## React Aria Integration

All interactive components follow a consistent integration pattern:

```tsx
// 1. Import with Aria prefix
import { Checkbox as AriaCheckbox } from "react-aria-components";

// 2. Wrap with render function for state access
<AriaCheckbox {...props}>
    {({ isSelected, isDisabled, isFocusVisible }) => (
        <VisualComponent isSelected={isSelected} ... />
    )}
</AriaCheckbox>

// 3. Merge classNames with state awareness
className={(state) =>
    cx(
        "base-classes",
        state.isSelected && "selected-classes",
        typeof className === "function" ? className(state) : className,
    )
}
```
