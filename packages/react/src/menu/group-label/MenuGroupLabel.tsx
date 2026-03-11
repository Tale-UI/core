'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import type { TaleUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTaleUiId } from '../../utils/useTaleUiId';
import { useMenuGroupRootContext } from '../group/MenuGroupContext';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 *
 * Documentation: [Tale UI Menu](https://base-ui.com/react/components/menu)
 */
export const MenuGroupLabel = React.forwardRef(function MenuGroupLabelComponent(
  componentProps: MenuGroupLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, id: idProp, ...elementProps } = componentProps;

  const id = useTaleUiId(idProp);

  const { setLabelId } = useMenuGroupRootContext();

  useIsoLayoutEffect(() => {
    setLabelId(id);
    return () => {
      setLabelId(undefined);
    };
  }, [setLabelId, id]);

  return useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: {
      id,
      role: 'presentation',
      ...elementProps,
    },
  });
});

export interface MenuGroupLabelProps extends TaleUIComponentProps<'div', MenuGroupLabel.State> {}

export interface MenuGroupLabelState {}

export namespace MenuGroupLabel {
  export type Props = MenuGroupLabelProps;
  export type State = MenuGroupLabelState;
}
