import * as React from 'react';
import {
  DisclosureGroup,
  Disclosure,
  DisclosurePanel,
  Button as AriaButton,
} from 'react-aria-components';
import type {
  DisclosureGroupProps,
  DisclosureProps,
  DisclosurePanelProps,
  ButtonProps,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { cx } from '../_cx';

export interface AccordionRootProps extends Omit<DisclosureGroupProps, 'className'> {
  className?: string | undefined;
}

/**
 * A vertically stacked set of collapsible sections.
 *
 * @example
 * ```tsx
 * import { Accordion } from '@tale-ui/react/accordion';
 *
 * <Accordion.Root>
 *   <Accordion.Item id="a">
 *     <Accordion.Header>
 *       <Accordion.Trigger>Question</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Panel>Answer</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ className, ...props }, ref) => (
    <DisclosureGroup ref={ref} className={cx('tale-accordion', className)} {...props} />
  ),
);
Root.displayName = 'Accordion.Root';

export interface AccordionItemProps extends Omit<DisclosureProps, 'className'> {
  className?: string | undefined;
}

export const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <Disclosure ref={ref} className={cx('tale-accordion__item', className)} {...props} />
  ),
);
Item.displayName = 'Accordion.Item';

export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string | undefined;
}

export const Header = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cx('tale-accordion__header', className)} {...props} />
  ),
);
Header.displayName = 'Accordion.Header';

export interface AccordionTriggerProps extends Omit<ButtonProps, 'className'> {
  className?: string | undefined;
}

export const Trigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <AriaButton ref={ref} slot="trigger" className={cx('tale-accordion__trigger', className)} {...props}>
      {children as React.ReactNode}
      <ChevronDown className="tale-accordion__trigger-icon" aria-hidden="true" />
    </AriaButton>
  ),
);
Trigger.displayName = 'Accordion.Trigger';

export interface AccordionPanelProps extends Omit<DisclosurePanelProps, 'className'> {
  className?: string | undefined;
}

export const Panel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ className, ...props }, ref) => (
    <DisclosurePanel ref={ref} className={cx('tale-accordion__panel', className)} {...props} />
  ),
);
Panel.displayName = 'Accordion.Panel';
