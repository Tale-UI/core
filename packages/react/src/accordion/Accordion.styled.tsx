import * as React from 'react';
import * as H from './index.parts';
import { cx } from '../_cx';
import type {
  AccordionValue,
  AccordionRootState,
  AccordionRootProps,
  AccordionRootChangeEventReason,
  AccordionRootChangeEventDetails,
} from './root/AccordionRoot';

function ChevronIcon() {
  return (
    <svg
      className="tale-accordion__trigger-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

const StyledRoot = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-accordion', className)} ref={ref} {...props} />
));
StyledRoot.displayName = 'Accordion.Root';
export const Root = StyledRoot as typeof H.Root;

export namespace Root {
    export type Value<TValue = any> = AccordionValue<TValue>;
    export type State<TValue = any> = AccordionRootState<TValue>;
    export type Props<TValue = any> = AccordionRootProps<TValue>;
  export type ChangeEventReason = AccordionRootChangeEventReason;
  export type ChangeEventDetails = AccordionRootChangeEventDetails;
}

const StyledItem = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-accordion__item', className)} ref={ref} {...props} />
));
StyledItem.displayName = 'Accordion.Item';
export const Item = StyledItem as typeof H.Item;

const StyledHeader = React.forwardRef<
  React.ComponentRef<typeof H.Header>,
  React.ComponentPropsWithoutRef<typeof H.Header>
>(({ className, ...props }, ref) => (
  <H.Header className={cx('tale-accordion__header', className)} ref={ref} {...props} />
));
StyledHeader.displayName = 'Accordion.Header';
export const Header = StyledHeader as typeof H.Header;

const StyledTrigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, children, ...props }, ref) => (
  <H.Trigger className={cx('tale-accordion__trigger', className)} ref={ref} {...props}>
    {children}
    <ChevronIcon />
  </H.Trigger>
));
StyledTrigger.displayName = 'Accordion.Trigger';
export const Trigger = StyledTrigger as typeof H.Trigger;

const StyledPanel = React.forwardRef<
  React.ComponentRef<typeof H.Panel>,
  React.ComponentPropsWithoutRef<typeof H.Panel>
>(({ className, ...props }, ref) => (
  <H.Panel className={cx('tale-accordion__panel', className)} ref={ref} {...props} />
));
StyledPanel.displayName = 'Accordion.Panel';
export const Panel = StyledPanel as typeof H.Panel;
