import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as ReactDOMClient from 'react-dom/client';
import {
  act as rtlAct,
  cleanup,
  screen as rtlScreen,
  fireEvent as rtlFireEvent,
  waitFor,
  within,
  queries,
  render as testingLibraryRender,
  type RenderOptions as TLRenderOptions,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, afterEach, beforeAll, describe, vi } from 'vitest';

// Re-export standard testing library utilities
export { rtlScreen as screen, waitFor, rtlFireEvent as fireEvent, within, cleanup };

// act wrapper
export function act(callback: () => void | Promise<void>) {
  return rtlAct(callback);
}

// flushMicrotasks
export async function flushMicrotasks() {
  await act(async () => {});
}

// randomStringValue - generates a random string for tests
export function randomStringValue(): string {
  return `s${Math.random().toString(36).slice(2)}`;
}

// reactMajor - React major version number
export const reactMajor = parseInt(React.version, 10);

// RenderOptions type — extends TLRenderOptions with `strict` flag
export type RenderOptions = TLRenderOptions & { strict?: boolean };

// MuiRenderResult replacement - the render result type
export type TaleUIRenderResult = ReturnType<typeof testingLibraryRender> & {
  user: ReturnType<typeof userEvent.setup>;
  forceUpdate: () => void;
  setProps: (props: object) => void;
  setPropsAsync: (props: object) => Promise<void>;
};

// CreateRendererOptions
export interface CreateRendererOptions {
  clock?: 'fake' | 'real';
  clockConfig?: number | Date;
  strict?: boolean;
  strictEffects?: boolean;
  clockOptions?: object;
}

// Renderer type
export interface Renderer {
  clock: ReturnType<typeof createClock>;
  render: (element: React.ReactElement, options?: RenderOptions) => TaleUIRenderResult;
}

function createClock(defaultMode: string, config?: number | Date, options?: object) {
  if (defaultMode === 'fake') {
    beforeEach(() => {
      vi.useFakeTimers({
        now: config,
        shouldClearNativeTimers: true,
        toFake: [
          'setTimeout',
          'setInterval',
          'clearTimeout',
          'clearInterval',
          'requestAnimationFrame',
          'cancelAnimationFrame',
          'performance',
          'Date',
        ],
        ...options,
      });
      if (config) {
        vi.setSystemTime(config);
      }
    });
  } else {
    beforeEach(() => {
      if (config) {
        vi.setSystemTime(config);
      }
    });
  }

  return {
    withFakeTimers: () => {
      if (vi.isFakeTimers()) return;
      beforeEach(() => {
        vi.useFakeTimers({
          now: config,
          shouldClearNativeTimers: true,
          toFake: [
            'setTimeout',
            'setInterval',
            'clearTimeout',
            'clearInterval',
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'performance',
            'Date',
          ],
          ...options,
        });
        if (config) {
          vi.setSystemTime(config);
        }
      });
    },
    runToLast: () => {
      rtlAct(() => {
        vi.runOnlyPendingTimers();
      });
    },
    isReal: () => !vi.isFakeTimers(),
    restore: () => {
      vi.useRealTimers();
    },
    tick: (timeoutMS: number) => {
      rtlAct(() => {
        vi.advanceTimersByTime(timeoutMS);
      });
    },
    tickAsync: async (timeoutMS: number) => {
      await rtlAct(async () => {
        await vi.advanceTimersByTimeAsync(timeoutMS);
      });
    },
    runAll: () => {
      rtlAct(() => {
        vi.runAllTimers();
      });
    },
  };
}

// createRenderer
export function createRenderer(globalOptions: CreateRendererOptions = {}) {
  const {
    clock: clockMode = 'real',
    clockConfig,
    strict: globalStrict = true,
    strictEffects: globalStrictEffects = globalStrict,
    clockOptions,
  } = globalOptions;

  const clock = createClock(clockMode, clockConfig, clockOptions);

  let wasCalledInSuite = false;
  beforeAll(() => {
    wasCalledInSuite = true;
  });

  let prepared = false;
  const ssrContainers: HTMLElement[] = [];

  beforeEach(() => {
    if (!wasCalledInSuite) {
      throw new Error('createRenderer was called in a hook instead of a describe() block.');
    }
    prepared = true;
  });

  afterEach(() => {
    for (const container of ssrContainers) {
      container.remove();
    }
    ssrContainers.length = 0;
  });

  function wrapWithStrict(element: React.ReactElement, strict: boolean): React.ReactElement {
    if (strict) {
      return React.createElement(React.StrictMode, null, element);
    }
    return element;
  }

  return {
    clock,
    render(element: React.ReactElement, options: RenderOptions = {}) {
      if (!prepared) {
        throw new Error(
          'render() was called before setup completed. Move it inside an it() block.',
        );
      }

      const { strict = globalStrict, ...tlOptions } = options;

      const wrappedElement = wrapWithStrict(element, strict);
      const result = testingLibraryRender(wrappedElement, tlOptions);

      return {
        ...result,
        user: userEvent.setup({ document }),
        forceUpdate() {
          result.rerender(
            wrapWithStrict(
              React.cloneElement(element, { 'data-force-update': String(Math.random()) } as any),
              strict,
            ),
          );
        },
        setProps(props: object) {
          result.rerender(
            wrapWithStrict(React.cloneElement(element, props as any), strict),
          );
        },
        async setPropsAsync(props: object) {
          await rtlAct(async () => {
            result.rerender(
              wrapWithStrict(React.cloneElement(element, props as any), strict),
            );
          });
        },
      };
    },
    renderToString(element: React.ReactElement) {
      if (!prepared) {
        throw new Error(
          'renderToString() was called before setup completed. Move it inside an it() block.',
        );
      }

      const container = document.createElement('div');
      document.body.appendChild(container);
      ssrContainers.push(container);

      const html = ReactDOMServer.renderToString(element);
      container.innerHTML = html;

      return {
        container,
        hydrate() {
          let root: ReactDOMClient.Root;
          rtlAct(() => {
            root = ReactDOMClient.hydrateRoot(container, element);
          });

          let currentElement = element;

          return {
            container,
            unmount() {
              rtlAct(() => {
                root.unmount();
              });
            },
            setProps(props: object) {
              currentElement = React.cloneElement(currentElement, props as any);
              rtlAct(() => {
                root.render(currentElement);
              });
            },
          };
        },
      };
    },
  };
}

// createDescribe - creates a named describe wrapper with skip/only support
export function createDescribe<TArgs extends any[]>(
  message: string,
  callback: (...args: TArgs) => void,
) {
  const wrapper = (...args: TArgs) => {
    describe(message, () => {
      callback(...args);
    });
  };
  wrapper.skip = (...args: TArgs) => {
    describe.skip(message, () => {
      callback(...args);
    });
  };
  wrapper.only = (...args: TArgs) => {
    describe.only(message, () => {
      callback(...args);
    });
  };
  return wrapper;
}

// ConformanceOptions type (minimal, matching what's used)
export interface ConformanceOptions {
  render: Function;
  mount: Function;
  skip: string[];
  classes: Record<string, string>;
  refInstanceof?: Function;
  after?: () => void;
  only?: string[];
}
