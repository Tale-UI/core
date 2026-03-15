import * as React from 'react';
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Tag as AriaTag,
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
  type LabelProps as AriaLabelProps,
  type TextProps as AriaTextProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (TagGroup) ────────────────────────────────────────────────────── */

export interface RootProps extends Omit<AriaTagGroupProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <AriaTagGroup
      ref={ref}
      className={cx('tale-tag-group', className)}
      {...props}
    />
  ),
);
Root.displayName = 'TagGroup.Root';

/* ─── List (TagList) ─────────────────────────────────────────────────────── */

export type ListProps<T extends object = {}> = Omit<AriaTagListProps<T>, 'className'> & {
  className?: string | undefined;
};

export const List: <T extends object = {}>(
  props: ListProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null = React.forwardRef(
  ({ className, ...props }: ListProps, ref) => (
    <AriaTagList
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx('tale-tag-group__list', className)}
      {...props}
    />
  ),
) as any;
(List as any).displayName = 'TagGroup.List';

/* ─── Tag ────────────────────────────────────────────────────────────────── */

export interface TagProps extends Omit<AriaTagProps, 'className'> {
  className?: string | undefined;
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, ...props }, ref) => (
    <AriaTag
      ref={ref}
      className={cx('tale-tag-group__tag', className)}
      {...props}
    />
  ),
);
Tag.displayName = 'TagGroup.Tag';

/* ─── Label ──────────────────────────────────────────────────────────────── */

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string | undefined;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel
      ref={ref}
      className={cx('tale-tag-group__label', className)}
      {...props}
    />
  ),
);
Label.displayName = 'TagGroup.Label';

/* ─── Description ────────────────────────────────────────────────────────── */

export interface DescriptionProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <AriaText
      ref={ref}
      slot="description"
      className={cx('tale-tag-group__description', className)}
      {...props}
    />
  ),
);
Description.displayName = 'TagGroup.Description';

/* ─── ErrorMessage ───────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends Omit<AriaTextProps, 'className' | 'slot'> {
  className?: string | undefined;
}

export const ErrorMessage = React.forwardRef<HTMLElement, ErrorMessageProps>(
  ({ className, ...props }, ref) => (
    <AriaFieldError
      ref={ref}
      className={cx('tale-tag-group__error', className)}
      {...props}
    />
  ),
);
ErrorMessage.displayName = 'TagGroup.ErrorMessage';
