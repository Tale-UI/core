import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon as TaleIcon } from '../icon';
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Popover as AriaPopover,
  Label as AriaLabel,
  Header as AriaHeader,
  Separator as AriaSeparator,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
  type ButtonProps as AriaButtonProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type PopoverProps as AriaPopoverProps,
  type LabelProps as AriaLabelProps,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Context ────────────────────────────────────────────────────────────── */

type Size = 'sm' | 'md' | 'lg';
interface SelectContextValue { size: Size; }
const SelectContext = React.createContext<SelectContextValue>({ size: 'md' });

/* ─── Root (Select) ───────────────────────────────────────────────────────── */

export type RootProps<T extends object = {}> = Omit<AriaSelectProps<T>, 'className'> & {
  className?: string;
  /** Size of the trigger button, propagated via context. @default 'md' */
  size?: Size | undefined;
};

/**
 * A dropdown select input for choosing from a list of options.
 *
 * @example
 * ```tsx
 * import { Select } from '@tale-ui/react/select';
 *
 * <Select.Root placeholder="Select...">
 *   <Select.Label>Fruit</Select.Label>
 *   <Select.Trigger>
 *     <Select.Value />
 *     <Select.Icon />
 *   </Select.Trigger>
 *   <Select.Popover>
 *     <Select.ListBox>
 *       <Select.Item id="apple">Apple</Select.Item>
 *       <Select.Item id="banana">Banana</Select.Item>
 *     </Select.ListBox>
 *   </Select.Popover>
 * </Select.Root>
 * ```
 */
export const Root: <T extends object = {}>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, size, ...props }: RootProps, ref) => (
    <SelectContext.Provider value={{ size: size ?? 'md' }}>
      <AriaSelect
        ref={ref as React.Ref<HTMLDivElement>}
        className={cx('tale-select', className)}
        {...props}
      />
    </SelectContext.Provider>
  ),
) as any;
(Root as any).displayName = 'Select.Root';

/* ─── Trigger (Button) ────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

/**
 * Button that opens the select dropdown
 *
 * @example
 * ```tsx
 * <Select.Trigger>
 *   <Select.Value />
 *   <Select.Icon />
 * </Select.Trigger>
 * ```
 */
export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(SelectContext);
    const sizeClass = size !== 'md' ? `tale-select__trigger--${size}` : '';
    return (
      <AriaButton ref={ref} className={cx(`tale-select__trigger${sizeClass ? ` ${sizeClass}` : ''}`, className)} {...props} />
    );
  },
);
Trigger.displayName = 'Select.Trigger';

/* ─── Value ───────────────────────────────────────────────────────────────── */

export type ValueProps<T extends object = object> = Omit<AriaSelectValueProps<T>, 'className'> & { className?: string };

/**
 * Displays the currently selected value or placeholder text
 *
 * @example
 * ```tsx
 * <Select.Value />
 * ```
 */
export const Value: <T extends object = object>(
  props: ValueProps<T> & React.RefAttributes<HTMLSpanElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ValueProps, ref) => (
    <AriaSelectValue
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cx('tale-select__value', className)}
      {...props}
    />
  ),
) as any;
(Value as any).displayName = 'Select.Value';

/* ─── Icon ────────────────────────────────────────────────────────────────── */

export type IconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

/**
 * Chevron indicator inside the trigger; pass children to override the default icon
 *
 * @example
 * ```tsx
 * <Select.Icon />
 * ```
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__icon', className)} aria-hidden="true" {...props}>
      {children ?? <TaleIcon icon={ChevronDown} size="sm" />}
    </span>
  ),
);
Icon.displayName = 'Select.Icon';

/* ─── Popover ─────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

/**
 * Floating container that holds the listbox when the select is open
 *
 * @example
 * ```tsx
 * <Select.Popover>
 *   <Select.ListBox>…</Select.ListBox>
 * </Select.Popover>
 * ```
 */
export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-select__popover', className)} {...props} />
  ),
);
Popover.displayName = 'Select.Popover';

/* ─── ListBox ─────────────────────────────────────────────────────────────── */

export type ListBoxProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & { className?: string };

/**
 * Scrollable list of selectable options
 *
 * @example
 * ```tsx
 * <Select.ListBox>
 *   <Select.Item id="apple">Apple</Select.Item>
 * </Select.ListBox>
 * ```
 */
export const ListBox: <T extends object = object>(
  props: ListBoxProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ListBoxProps, ref) => (
    <AriaListBox
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-select__listbox', className)}
      {...props}
    />
  ),
) as any;
(ListBox as any).displayName = 'Select.ListBox';

/* ─── Item (ListBoxItem) ──────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & { className?: string };

/**
 * A single selectable option inside the listbox
 *
 * @example
 * ```tsx
 * <Select.Item id="banana">Banana</Select.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-select__item', className)} {...props} />
  ),
);
Item.displayName = 'Select.Item';

/* ─── Section (ListBoxSection) ────────────────────────────────────────────── */

export type SectionProps<T = object> = AriaListBoxSectionProps<T>;

/**
 * Groups related items under an optional header
 *
 * @example
 * ```tsx
 * <Select.Section>
 *   <Select.Header>Citrus</Select.Header>
 *   <Select.Item id="orange">Orange</Select.Item>
 * </Select.Section>
 * ```
 */
export const Section: <T extends object>(
  props: SectionProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = AriaListBoxSection as any;

/* ─── Header ─────────────────────────────────────────────────────────────── */

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & { className?: string };

/**
 * Heading label for a section of items
 *
 * @example
 * ```tsx
 * <Select.Header>Citrus</Select.Header>
 * ```
 */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <AriaHeader
      ref={ref as React.Ref<HTMLElement>}
      className={cx('tale-select__header', className)}
      {...props}
    />
  ),
);
Header.displayName = 'Select.Header';

/* ─── Label ───────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

/**
 * Accessible label for the select field
 *
 * @example
 * ```tsx
 * <Select.Label>Fruit</Select.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-select__label', className)} {...props} />
  ),
);
Label.displayName = 'Select.Label';

/* ─── Separator ───────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

/**
 * Visual divider between items or sections
 *
 * @example
 * ```tsx
 * <Select.Separator />
 * ```
 */
export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-select__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Select.Separator';

/* ─── ItemText ───────────────────────────────────────────────────────────── */

export type ItemTextProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

/**
 * Text label within an item, used when the item contains additional elements
 *
 * @example
 * ```tsx
 * <Select.Item id="us">
 *   <Select.ItemText>United States</Select.ItemText>
 *   <Select.ItemIndicator>✓</Select.ItemIndicator>
 * </Select.Item>
 * ```
 */
export const ItemText = React.forwardRef<HTMLSpanElement, ItemTextProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__item-text', className)} {...props} />
  ),
);
ItemText.displayName = 'Select.ItemText';

/* ─── ItemIndicator ──────────────────────────────────────────────────────── */

export type ItemIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

/**
 * Checkmark or custom indicator shown on the selected item
 *
 * @example
 * ```tsx
 * <Select.ItemIndicator>✓</Select.ItemIndicator>
 * ```
 */
export const ItemIndicator = React.forwardRef<HTMLSpanElement, ItemIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__item-indicator', className)} {...props} />
  ),
);
ItemIndicator.displayName = 'Select.ItemIndicator';
