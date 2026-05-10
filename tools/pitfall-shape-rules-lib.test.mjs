import test from 'node:test';
import assert from 'node:assert/strict';

import { slugSummaryMatch } from './pitfall-shape-rules-lib.mjs';

test('slugSummaryMatch requires semantic summary tokens for shared pitfalls', () => {
  assert.equal(
    slugSummaryMatch('row-column-gap-uses-token-scale', 'Button variants use neutral actions'),
    false,
  );
  assert.equal(
    slugSummaryMatch(
      'row-column-gap-uses-token-scale',
      'Row/Column gap uses spacing token values, not component size names',
    ),
    true,
  );
});

test('slugSummaryMatch ignores component slug tokens for component docs', () => {
  assert.equal(
    slugSummaryMatch(
      'color-slider-composition-with-color-area',
      'When composing with ColorArea, wrap both in a single parent element',
      { componentSlug: 'color-slider' },
    ),
    true,
  );
});

test('slugSummaryMatch compacts package path tokens from summaries', () => {
  assert.equal(
    slugSummaryMatch(
      'do-not-import-taleuichartsstyles-inside',
      'Never import @tale-ui/charts/styles in generated chart component snippets',
    ),
    true,
  );
});
