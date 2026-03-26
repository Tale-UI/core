/**
 * Augment Chai's Assertion interface with jest-dom matchers and custom matchers.
 *
 * Tests import `expect` from 'chai', but @testing-library/jest-dom/vitest only
 * augments Vitest's Assertion type. This file bridges the gap so TypeScript
 * recognises the matchers on Chai assertions.
 *
 * Add new matchers here as tests start using them.
 */

// Needed so TypeScript treats this as a module (global augmentation requires it)
export {};

declare global {
  namespace Chai {
    interface Assertion {
      // ── @testing-library/jest-dom matchers ──────────────────────────────────
      toBeVisible(): void;
      toBeInTheDocument(): void;
      toBeEmptyDOMElement(): void;
      toBeEnabled(): void;
      toBeDisabled(): void;
      toBeRequired(): void;
      toBeValid(): void;
      toBeInvalid(): void;
      toHaveFocus(): void;
      toBeChecked(): void;
      toBePartiallyChecked(): void;

      // ── Custom matchers (implemented in test/setupVitest.ts) ───────────────
      /** Assert that the callback triggers console.error. */
      toErrorDev(expectedMessages?: string | string[]): void;
      /** Assert that an element is hidden from the accessibility tree. */
      toBeInaccessible(): void;
    }
  }
}
