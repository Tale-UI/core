import * as React from 'react';
import {
  type CreateRendererOptions,
  type RenderOptions,
  createRenderer as sharedCreateRenderer,
  act,
} from '@tale-ui/monorepo-tests/test-utils';

interface DataAttributes {
  [key: `data-${string}`]: string;
}

export type TaleUIRenderResult = Awaited<ReturnType<ReturnType<typeof createRenderer>['render']>>;

export function createRenderer(globalOptions?: CreateRendererOptions) {
  const createRendererResult = sharedCreateRenderer(globalOptions);
  const { render: originalRender } = createRendererResult;

  const render = async (element: React.ReactElement<DataAttributes>, options?: RenderOptions) => {
    const result = await act(async () => originalRender(element, options));

    async function rerender(newElement: React.ReactElement<DataAttributes>) {
      await act(async () => result.rerender(newElement));
    }

    async function setProps(newProps: object) {
      await rerender(React.cloneElement(element, newProps));
    }

    return { ...result, rerender, setProps };
  };

  return {
    ...createRendererResult,
    render,
  };
}
