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

test('patch target index includes real Row/Column gap pitfall IDs', () => {
  const index = __test__.buildPatchTargetIndex();

  assert.match(index, /id: row-column-gap-uses-token-scale/);
  assert.match(index, /id: columnrow-gap-uses-spacingtoken-values/);
  assert.match(index, /targetFile: docs\/pitfalls\.md/);
});

test('generated fix prompt includes patch target index guidance with real IDs', () => {
  const prompt = __test__.buildFixPrompt(
    {
      prompt: 'Create a dangerous button row',
      code: 'export function Demo() { return null; }',
      l1: { pass: false, errors: ['Line 6: Type \'"sm"\' is not assignable to type Gap'] },
      l2: { pass: true, missing: [] },
      l3: { pass: true, forbidden: [] },
    },
    [],
    ['Button', 'Row'],
  );

  assert.match(prompt, /Patch target index/);
  assert.match(prompt, /targetPitfallSlug" must be copied from the Patch target index "id" field/);
  assert.match(prompt, /"old" is optional/);
  assert.match(
    prompt,
    /Never switch to "append_pitfall" when updating a listed Patch target index ID/,
  );
  assert.match(prompt, /id: row-column-gap-uses-token-scale/);
  assert.match(prompt, /id: columnrow-gap-uses-spacingtoken-values/);
});

test('provider quota messages are detected before scoring as generated code failures', () => {
  assert.equal(__test__.isProviderQuotaMessage("You're out of extra usage · resets 8pm"), true);
  assert.equal(__test__.isProviderQuotaMessage('Line 7: Type "md" is not assignable'), false);
});

test('source patch retry cap stops retry storms', () => {
  assert.equal(__test__.shouldStopSourcePatchRetries(2, 3), false);
  assert.equal(__test__.shouldStopSourcePatchRetries(3, 3), true);
});
