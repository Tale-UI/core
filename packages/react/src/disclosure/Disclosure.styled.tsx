import * as React from 'react';
import { Disclosure, DisclosurePanel, Button as AriaButton } from 'react-aria-components';
import type {
  DisclosureProps as RACDisclosureProps,
  DisclosurePanelProps as RACDisclosurePanelProps,
  ButtonProps,
} from 'react-aria-components';
import { cx } from '../_cx';

export interface DisclosureRootProps extends Omit<RACDisclosureProps, 'className'> {
  className?: string | undefined;
}

export const Root = React.forwardRef<HTMLDivElement, DisclosureRootProps>(
  ({ className, ...props }, ref) => (
    <Disclosure ref={ref} className={cx('tale-disclosure', className)} {...props} />
  ),
);
Root.displayName = 'Disclosure.Root';

export interface DisclosureTriggerProps extends Omit<ButtonProps, 'className'> {
  className?: string | undefined;
}

export const Trigger = React.forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
  ({ className, ...props }, ref) => (
    <AriaButton ref={ref} slot="trigger" className={cx('tale-disclosure__trigger', className)} {...props} />
  ),
);
Trigger.displayName = 'Disclosure.Trigger';

export interface DisclosurePanelProps extends Omit<RACDisclosurePanelProps, 'className'> {
  className?: string | undefined;
}

export const Panel = React.forwardRef<HTMLDivElement, DisclosurePanelProps>(
  ({ className, ...props }, ref) => (
    <DisclosurePanel ref={ref} className={cx('tale-disclosure__panel', className)} {...props} />
  ),
);
Panel.displayName = 'Disclosure.Panel';
