import { cleanup, act } from '@testing-library/react';
import * as chai from 'chai';
import chaiDom from 'chai-dom';
import failOnConsole from 'vitest-fail-on-console';
// eslint-disable-next-line import/no-relative-packages
import '../packages/react/test/addChaiAssertions';
import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { reset } from '@tale-ui/utils/error';

// Global flag: when > 0, console.error calls are expected (inside toErrorDev)
let expectedErrorDepth = 0;

// toErrorDev / not.toErrorDev — chai assertion for expected console.error calls
chai.use((_chai, utils) => {
  _chai.Assertion.addMethod('toErrorDev', function toErrorDev(
    expectedMessages?: string | string[],
  ) {
    const callback = utils.flag(this, 'object') as () => void;
    const negate = utils.flag(this, 'negate');

    // Intercept console.error during the callback
    const originalError = console.error;
    const captured: string[] = [];

    console.error = (...args: any[]) => {
      captured.push(args.map(String).join(' '));
    };

    expectedErrorDepth += 1;
    try {
      callback();
    } finally {
      expectedErrorDepth -= 1;
      console.error = originalError;
    }

    if (negate) {
      new _chai.Assertion(captured).to.have.length(
        0,
        `Expected no console.error calls but got ${captured.length}: ${captured.join('\n')}`,
      );
    } else if (expectedMessages !== undefined) {
      const messages = Array.isArray(expectedMessages) ? expectedMessages : [expectedMessages];
      new _chai.Assertion(captured.length).to.be.at.least(
        messages.length,
        `Expected at least ${messages.length} console.error call(s) but got ${captured.length}`,
      );
      messages.forEach((msg, i) => {
        new _chai.Assertion(captured[i]).to.include(
          msg,
          `console.error call ${i} did not include expected message`,
        );
      });
    } else {
      new _chai.Assertion(captured.length).to.be.greaterThan(
        0,
        'Expected at least one console.error call',
      );
    }
  });
});

// Setup chai plugins
if (typeof window !== 'undefined') {
  chai.use(chaiDom);
  globalThis.jest = null as any;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  if (window.navigator.userAgent.includes('jsdom')) {
    globalThis.window.Touch ??= class Touch {
      instance: any;
      constructor(instance: any) {
        this.instance = instance;
      }
      get identifier() {
        return this.instance.identifier;
      }
      get pageX() {
        return this.instance.pageX;
      }
      get pageY() {
        return this.instance.pageY;
      }
      get clientX() {
        return this.instance.clientX;
      }
      get clientY() {
        return this.instance.clientY;
      }
    } as any;
  }
}

// Fail on unexpected console errors/warnings
failOnConsole({
  silenceMessage: (message: string) => {
    // Silence errors that are expected inside toErrorDev assertions
    if (expectedErrorDepth > 0) {
      return true;
    }
    if (
      process.env.NODE_ENV === 'production' &&
      message.includes('act(...) is not supported in production builds of React')
    ) {
      return true;
    }
    if (message.includes('Warning: useLayoutEffect does nothing on the server')) {
      return true;
    }
    if (
      message.includes(
        'Detected multiple renderers concurrently rendering the same context provider.',
      )
    ) {
      return true;
    }
    return false;
  },
});

// Cleanup after each test
afterEach(async () => {
  if (vi.isFakeTimers()) {
    await act(async () => {
      vi.runOnlyPendingTimers();
    });
  }
  vi.useRealTimers();
  cleanup();
});

afterEach(() => {
  vi.resetAllMocks();
  reset();
});

declare global {
  // eslint-disable-next-line vars-on-top
  var TALE_UI_ANIMATIONS_DISABLED: boolean;
}

globalThis.TALE_UI_ANIMATIONS_DISABLED = true;

if (typeof window !== 'undefined' && window?.navigator?.userAgent?.includes('jsdom')) {
  globalThis.requestAnimationFrame = (cb) => {
    setTimeout(() => cb(0), 0);
    return 0;
  };
}
