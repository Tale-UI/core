import * as React from 'react';
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

/* ─── Root (Select) ───────────────────────────────────────────────────────── */

export type RootProps<T extends object = {}> = Omit<AriaSelectProps<T>, 'className'> & { className?: string };

/**
 * A dropdown select input for choosing from a list of options.
 *
 * @example
 * ```tsx
 * import { Select } from '@tale-ui/react/select';
 *
 * <Select.Root>
 *   <Select.Label>Fruit</Select.Label>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Select..." />
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
  ({ className, ...props }: RootProps, ref) => (
    <AriaSelect
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-select', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Select.Root';

/* ─── Trigger (Button) ────────────────────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-select__trigger', className)} {...props} />
  ),
);
Trigger.displayName = 'Select.Trigger';

/* ─── Value ───────────────────────────────────────────────────────────────── */

export type ValueProps<T extends object = object> = Omit<AriaSelectValueProps<T>, 'className'> & { className?: string };

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

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__icon', className)} aria-hidden="true" {...props} />
  ),
);
Icon.displayName = 'Select.Icon';

/* ─── Popover ─────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-select__popover', className)} {...props} />
  ),
);
Popover.displayName = 'Select.Popover';

/* ─── ListBox ─────────────────────────────────────────────────────────────── */

export type ListBoxProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & { className?: string };

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

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-select__item', className)} {...props} />
  ),
);
Item.displayName = 'Select.Item';

/* ─── Section (ListBoxSection) ────────────────────────────────────────────── */

export type SectionProps<T = object> = AriaListBoxSectionProps<T>;

export const Section: <T extends object>(
  props: SectionProps<T> & React.RefAttributes<HTMLElement>,
) => React.ReactElement | null = AriaListBoxSection as any;

/* ─── Header ─────────────────────────────────────────────────────────────── */

export type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'className'> & { className?: string };

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

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-select__label', className)} {...props} />
  ),
);
Label.displayName = 'Select.Label';

/* ─── Separator ───────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-select__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Select.Separator';

/* ─── ItemText ───────────────────────────────────────────────────────────── */

export type ItemTextProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

export const ItemText = React.forwardRef<HTMLSpanElement, ItemTextProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__item-text', className)} {...props} />
  ),
);
ItemText.displayName = 'Select.ItemText';

/* ─── ItemIndicator ──────────────────────────────────────────────────────── */

export type ItemIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

export const ItemIndicator = React.forwardRef<HTMLSpanElement, ItemIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-select__item-indicator', className)} {...props} />
  ),
);
ItemIndicator.displayName = 'Select.ItemIndicator';
