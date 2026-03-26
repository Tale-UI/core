import * as React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Icon } from '../icon';
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Popover as AriaPopover,
  Label as AriaLabel,
  Header as AriaHeader,
  Separator as AriaSeparator,
  type ComboBoxProps as AriaComboBoxProps,
  type InputProps as AriaInputProps,
  type ButtonProps as AriaButtonProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  type PopoverProps as AriaPopoverProps,
  type LabelProps as AriaLabelProps,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (ComboBox) ─────────────────────────────────────────────────────── */

export type RootProps<T extends object = object> = Omit<AriaComboBoxProps<T>, 'className'> & {
  className?: string;
};

/**
 * A text input with a filterable dropdown list.
 *
 * @example
 * ```tsx
 * import { Combobox } from '@tale-ui/react/combobox';
 *
 * <Combobox.Root>
 *   <Combobox.Label>Country</Combobox.Label>
 *   <Combobox.InputGroup>
 *     <Combobox.Input placeholder="Search..." />
 *     <Combobox.Trigger />
 *   </Combobox.InputGroup>
 *   <Combobox.Popover>
 *     <Combobox.ListBox>
 *       <Combobox.Item id="us" textValue="United States">United States</Combobox.Item>
 *       <Combobox.Item id="uk" textValue="United Kingdom">United Kingdom</Combobox.Item>
 *     </Combobox.ListBox>
 *   </Combobox.Popover>
 * </Combobox.Root>
 * ```
 */
export const Root: <T extends object = object>(
  props: RootProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: RootProps, ref) => (
    <AriaComboBox
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-combobox', className)}
      {...props}
    />
  ),
) as any;
(Root as any).displayName = 'Combobox.Root';

/* ─── Label ───────────────────────────────────────────────────────────────── */

export type LabelProps = Omit<AriaLabelProps, 'className'> & { className?: string };

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={cx('tale-combobox__label', className)} {...props} />
  ),
);
Label.displayName = 'Combobox.Label';

/* ─── Input ───────────────────────────────────────────────────────────────── */

export type InputProps = Omit<AriaInputProps, 'className'> & { className?: string };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <AriaInput ref={ref} className={cx('tale-combobox__input', className)} {...props} />
  ),
);
Input.displayName = 'Combobox.Input';

/* ─── Trigger (open-listbox button) ──────────────────────────────────────── */

export type TriggerProps = Omit<AriaButtonProps, 'className'> & { className?: string };

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, ...props }, ref) => (
    <AriaButton ref={ref} className={cx('tale-combobox__trigger', className)} {...props}>
      {children ?? <Icon icon={ChevronDown} size="sm" />}
    </AriaButton>
  ),
);
Trigger.displayName = 'Combobox.Trigger';

/* ─── Popover ─────────────────────────────────────────────────────────────── */

export type PopoverProps = Omit<AriaPopoverProps, 'className'> & { className?: string };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-combobox__popover', className)} {...props} />
  ),
);
Popover.displayName = 'Combobox.Popover';

/* ─── ListBox ─────────────────────────────────────────────────────────────── */

export type ListBoxProps<T extends object = object> = Omit<AriaListBoxProps<T>, 'className'> & {
  className?: string;
};

export const ListBox: <T extends object = object>(
  props: ListBoxProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ListBoxProps, ref) => (
    <AriaListBox
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-combobox__listbox', className)}
      {...props}
    />
  ),
) as any;
(ListBox as any).displayName = 'Combobox.ListBox';

/* ─── Item (ListBoxItem) ──────────────────────────────────────────────────── */

export type ItemProps<T = object> = Omit<AriaListBoxItemProps<T>, 'className'> & { className?: string };

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-combobox__item', className)} {...props} />
  ),
);
Item.displayName = 'Combobox.Item';

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
      className={cx('tale-combobox__header', className)}
      {...props}
    />
  ),
);
Header.displayName = 'Combobox.Header';

/* ─── Empty state ─────────────────────────────────────────────────────────── */

export type EmptyProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-combobox__empty', className)} {...props} />
  ),
);
Empty.displayName = 'Combobox.Empty';

/* ─── InputGroup ──────────────────────────────────────────────────────────── */

export type InputGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-combobox__input-group', className)} {...props} />
  ),
);
InputGroup.displayName = 'Combobox.InputGroup';

/* ─── Chips container ─────────────────────────────────────────────────────── */

export type ChipsProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> & { className?: string };

export const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-combobox__chips', className)} {...props} />
  ),
);
Chips.displayName = 'Combobox.Chips';

/* ─── Chip ────────────────────────────────────────────────────────────────── */

export type ChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-combobox__chip', className)} {...props} />
  ),
);
Chip.displayName = 'Combobox.Chip';

/* ─── ChipRemove ──────────────────────────────────────────────────────────── */

export type ChipRemoveProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  className?: string;
};

export const ChipRemove = React.forwardRef<HTMLButtonElement, ChipRemoveProps>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} type="button" className={cx('tale-combobox__chip-remove', className)} {...props}>
      {children ?? <Icon icon={X} size="sm" />}
    </button>
  ),
);
ChipRemove.displayName = 'Combobox.ChipRemove';

/* ─── Separator ───────────────────────────────────────────────────────────── */

export type SeparatorProps = Omit<AriaSeparatorProps, 'className'> & { className?: string };

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <AriaSeparator ref={ref} className={cx('tale-combobox__separator', className)} {...props} />
  ),
);
Separator.displayName = 'Combobox.Separator';

/* ─── ItemIndicator ──────────────────────────────────────────────────────── */

export type ItemIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & { className?: string };

export const ItemIndicator = React.forwardRef<HTMLSpanElement, ItemIndicatorProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cx('tale-combobox__item-indicator', className)} {...props} />
  ),
);
ItemIndicator.displayName = 'Combobox.ItemIndicator';
