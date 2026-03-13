import * as React from 'react';
import { Accordion as H } from '@tale-ui/react/accordion';
import { cx } from '../_cx';

const ChevronIcon = () => (
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

export const Root = React.forwardRef<
  React.ComponentRef<typeof H.Root>,
  React.ComponentPropsWithoutRef<typeof H.Root>
>(({ className, ...props }, ref) => (
  <H.Root className={cx('tale-accordion', className)} ref={ref} {...props} />
));
Root.displayName = 'Accordion.Root';

export const Item = React.forwardRef<
  React.ComponentRef<typeof H.Item>,
  React.ComponentPropsWithoutRef<typeof H.Item>
>(({ className, ...props }, ref) => (
  <H.Item className={cx('tale-accordion__item', className)} ref={ref} {...props} />
));
Item.displayName = 'Accordion.Item';

export const Header = React.forwardRef<
  React.ComponentRef<typeof H.Header>,
  React.ComponentPropsWithoutRef<typeof H.Header>
>(({ className, ...props }, ref) => (
  <H.Header className={cx('tale-accordion__header', className)} ref={ref} {...props} />
));
Header.displayName = 'Accordion.Header';

export const Trigger = React.forwardRef<
  React.ComponentRef<typeof H.Trigger>,
  React.ComponentPropsWithoutRef<typeof H.Trigger>
>(({ className, children, ...props }, ref) => (
  <H.Trigger className={cx('tale-accordion__trigger', className)} ref={ref} {...props}>
    {children}
    <ChevronIcon />
  </H.Trigger>
));
Trigger.displayName = 'Accordion.Trigger';

export const Panel = React.forwardRef<
  React.ComponentRef<typeof H.Panel>,
  React.ComponentPropsWithoutRef<typeof H.Panel>
>(({ className, ...props }, ref) => (
  <H.Panel className={cx('tale-accordion__panel', className)} ref={ref} {...props} />
));
Panel.displayName = 'Accordion.Panel';
