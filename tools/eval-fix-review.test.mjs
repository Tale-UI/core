import test from 'node:test';
import assert from 'node:assert/strict';

import { __test__ } from './eval-fix-review.mjs';

test('resolveSourceTarget rejects targetFile that conflicts with section routing', () => {
  const target = __test__.resolveSourceTarget(
    {
      section: 'component:BarChart',
      targetFile: 'breadcrumbs',
      operation: 'replace_pitfall',
      targetPitfallSlug: 'bar-chart-grid',
      old: '',
    },
    '',
  );

  assert.equal(target, null);
});

test('fixHasStructuredSourcePatch ignores deprecated raw markdown field', () => {
  assert.equal(
    __test__.fixHasStructuredSourcePatch({
      new: '- **Use gamma label text** — keep gamma copy stable.',
    }),
    false,
  );
});
