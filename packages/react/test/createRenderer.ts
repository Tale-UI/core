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

type SharedRenderer = ReturnType<typeof sharedCreateRenderer>;
type SharedRenderResult = ReturnType<SharedRenderer['render']>;

interface TaleUIRenderer extends Omit<SharedRenderer, 'render'> {
  render: (
    element: React.ReactElement<DataAttributes>,
    options?: RenderOptions,
  ) => Promise<SharedRenderResult & {
    rerender: (newElement: React.ReactElement<DataAttributes>) => Promise<void>;
    setProps: (newProps: object) => Promise<void>;
  }>;
}

export type TaleUIRenderResult = Awaited<ReturnType<TaleUIRenderer['render']>>;

export function createRenderer(globalOptions?: CreateRendererOptions): TaleUIRenderer {
  const createRendererResult = sharedCreateRenderer(globalOptions);
  const { render: originalRender } = createRendererResult;

  const render: TaleUIRenderer['render'] = async (element, options) => {
    let result!: SharedRenderResult;
    await act(async () => {
      result = originalRender(element, options);
    });

    async function rerender(newElement: React.ReactElement<DataAttributes>) {
      await act(async () => { result.rerender(newElement); });
    }

    async function setProps(newProps: object) {
      await rerender(React.cloneElement(element, newProps));
    }

    return Object.assign(result, { rerender, setProps });
  };

  return {
    ...createRendererResult,
    render,
  } as TaleUIRenderer;
}
