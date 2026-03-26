/**
 * Augment Chai's Assertion interface with custom matchers used in utils tests.
 */
export {};

declare global {
  namespace Chai {
    interface Assertion {
      /** Assert that the callback triggers console.error (defined in setupVitest.ts). */
      toErrorDev(expectedMessages?: string | string[]): void;
    }
  }
}
