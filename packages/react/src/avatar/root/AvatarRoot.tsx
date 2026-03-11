'use client';
import * as React from 'react';
import { TaleUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { AvatarRootContext } from './AvatarRootContext';
import { avatarStateAttributesMapping } from './stateAttributesMapping';

/**
 * Displays a user's profile picture, initials, or fallback icon.
 * Renders a `<span>` element.
 *
 * Documentation: [Tale UI Avatar](https://base-ui.com/react/components/avatar)
 */
export const AvatarRoot = React.forwardRef(function AvatarRoot(
  componentProps: AvatarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, ...elementProps } = componentProps;

  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  const state: AvatarRoot.State = {
    imageLoadingStatus,
  };

  const contextValue = React.useMemo(
    () => ({
      imageLoadingStatus,
      setImageLoadingStatus,
    }),
    [imageLoadingStatus, setImageLoadingStatus],
  );

  const element = useRenderElement('span', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping: avatarStateAttributesMapping,
  });

  return <AvatarRootContext.Provider value={contextValue}>{element}</AvatarRootContext.Provider>;
});

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarRootState {
  imageLoadingStatus: ImageLoadingStatus;
}

export interface AvatarRootProps extends TaleUIComponentProps<'span', AvatarRoot.State> {}

export namespace AvatarRoot {
  export type State = AvatarRootState;
  export type Props = AvatarRootProps;
}
