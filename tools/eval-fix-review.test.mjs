import test from 'node:test';
import assert from 'node:assert/strict';

import { __test__ } from './eval-fix-review.mjs';

const componentTarget = {
  isComponent: true,
  sectionHeading: 'Pitfalls',
  appendOnly: false,
};

const baseSection = `
<!-- pitfall: use-alpha-label-text -->
- **Use alpha label text** — keep alpha copy stable.
  - anti-pattern: \`<Text weight="medium">Label</Text>\`
  - fix: \`<Text variant="label">Label</Text>\`

<!-- pitfall: use-beta-helper-text -->
- **Use beta helper text** — keep beta copy stable.
  - anti-pattern: \`<Text weight="medium">Label</Text>\`
  - fix: \`<Text variant="label">Label</Text>\`
`.trim();

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

test('append_pitfall requires newPitfallSlug', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'append_pitfall',
      summary: 'Use gamma label text',
      details: 'keep gamma copy stable.',
      antiPatterns: ['<Text weight="medium">Gamma</Text>'],
      fixes: ['<Text variant="label">Gamma</Text>'],
    },
    componentTarget,
  );

  assert.match(result.error, /append_pitfall requires newPitfallSlug/);
});

test('replace operations require targetPitfallSlug', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'replace_pitfall',
      summary: 'Use beta helper text',
      details: 'keep beta copy stable.',
      antiPatterns: ['<Text weight="medium">Label</Text>'],
      fixes: ['<Text variant="label">Label</Text>'],
    },
    componentTarget,
  );

  assert.match(result.error, /replace_pitfall requires targetPitfallSlug/);
});

test('replace_pitfall updates the slug-targeted block even when old text is duplicated elsewhere', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'use-beta-helper-text',
      old: '- anti-pattern: `<Text weight="medium">Label</Text>`',
      summary: 'Use beta helper text',
      details: 'render beta labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Label</Text>'],
      fixes: ['<Text variant="label">Beta label</Text>'],
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  assert.match(result.updatedSection, /<!-- pitfall: use-alpha-label-text -->[\s\S]*<Text variant="label">Label<\/Text>/);
  assert.match(result.updatedSection, /<!-- pitfall: use-beta-helper-text -->[\s\S]*<Text variant="label">Beta label<\/Text>/);
});

test('replace_pitfall rejects content whose summary no longer matches the target slug', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'use-beta-helper-text',
      summary: 'Do not import chart styles',
      details: 'chart styles are bundled automatically.',
      antiPatterns: [`import '@tale-ui/charts/styles';`],
      fixes: [`import { BarChart } from '@tale-ui/charts/bar-chart';`],
    },
    componentTarget,
  );

  assert.match(result.error, /summary does not match slug 'use-beta-helper-text'/);
});

test('replace_subbullets rewrites one named block without merging in a second pitfall', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'replace_subbullets',
      targetPitfallSlug: 'use-beta-helper-text',
      old: '- anti-pattern: `<Text weight="medium">Label</Text>`',
      summary: 'Use beta helper text',
      details: 'render beta labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Label</Text>'],
      fixes: ['<Text variant="label">Beta label</Text>'],
      completeExample: [
        `import { Text } from '@tale-ui/react/text';`,
        ``,
        `export function BetaLabel() {`,
        `  return <Text variant="label">Beta label</Text>;`,
        `}`,
      ].join('\n'),
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  const blocks = __test__.getPitfallBlocks(result.updatedSection);
  assert.equal(blocks.length, 2);
  assert.match(blocks[1].text, /complete example:/);
  assert.equal((blocks[1].text.match(/<!-- pitfall:/g) ?? []).length, 1);
});

test('append_pitfall adds a fresh canonical block with the requested slug', () => {
  const result = __test__.applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'append_pitfall',
      newPitfallSlug: 'use-gamma-label-text',
      summary: 'Use gamma label text',
      details: 'keep gamma copy stable.',
      antiPatterns: ['<Text weight="medium">Gamma</Text>'],
      fixes: ['<Text variant="label">Gamma</Text>'],
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  const blocks = __test__.getPitfallBlocks(result.updatedSection);
  assert.equal(blocks.length, 3);
  assert.match(result.updatedSection, /<!-- pitfall: use-gamma-label-text -->/);
});
