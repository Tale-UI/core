/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */

import test from 'node:test';
import assert from 'node:assert/strict';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  createPitfallSourceTargetResolver,
  normalizeTargetFileSlug,
} from './pitfall-source-target-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const { resolveSourceTarget } = createPitfallSourceTargetResolver(ROOT);

test('normalizeTargetFileSlug accepts shared docs and component slugs', () => {
  assert.deepEqual(normalizeTargetFileSlug('docs/pitfalls.md'), { kind: 'shared' });
  assert.deepEqual(normalizeTargetFileSlug('docs/components/image-cropper.md'), {
    kind: 'component',
    slug: 'image-cropper',
  });
  assert.deepEqual(normalizeTargetFileSlug('image-cropper'), {
    kind: 'component',
    slug: 'image-cropper',
  });
});

test('resolveSourceTarget rejects targetFile that conflicts with section routing', () => {
  const target = resolveSourceTarget(
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

test('resolveSourceTarget resolves shared cross-component sections', () => {
  const target = resolveSourceTarget(
    {
      section: 'cross:layout',
      targetFile: 'docs/pitfalls.md',
      operation: 'append_pitfall',
      newPitfallSlug: 'use-layout-gap-token',
      old: '',
    },
    '',
  );

  assert.equal(target?.isComponent, false);
  assert.equal(target?.sectionHeading, 'Layout Patterns');
  assert.equal(target?.appendOnly, true);
  assert.match(target?.filePath ?? '', /docs\/pitfalls\.md$/);
});
