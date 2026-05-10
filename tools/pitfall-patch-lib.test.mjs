import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PITFALL_FIX_OPERATION_SPECS,
  applyPitfallFixToSectionText,
  formatPitfallOperationSpecsForPrompt,
  getPitfallBlocks,
  validateFixPayload,
} from './pitfall-patch-lib.mjs';

const componentTarget = {
  isComponent: true,
  sectionHeading: 'Pitfalls',
  appendOnly: false,
};

const colorSliderTarget = {
  isComponent: true,
  slug: 'color-slider',
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

const recoverySection = `
<!-- pitfall: use-alpha-label-text -->
- **Use alpha label text** — keep alpha copy stable.
  - anti-pattern: \`<Text weight="medium">Alpha</Text>\`
  - fix: \`<Text variant="label">Alpha</Text>\`

<!-- pitfall: use-beta-helper-text -->
- **Use beta helper text** — keep beta copy stable.
  - anti-pattern: \`<Text weight="medium">Beta</Text>\`
  - fix: \`<Text variant="label">Beta</Text>\`
`.trim();

const duplicateSummarySection = `
<!-- pitfall: use-alpha-label-text -->
- **Use shared label text** — keep alpha copy stable.
  - anti-pattern: \`<Text weight="medium">Alpha</Text>\`
  - fix: \`<Text variant="label">Alpha</Text>\`

<!-- pitfall: use-beta-label-text -->
- **Use shared label text** — keep beta copy stable.
  - anti-pattern: \`<Text weight="medium">Beta</Text>\`
  - fix: \`<Text variant="label">Beta</Text>\`
`.trim();

const colorSliderSection = `
<!-- pitfall: color-slider-composition-with-color-area -->
- **When composing with ColorArea, wrap both in a single parent element** — Use \`<Column>\` or a \`<div>\` as a shared parent to provide layout. Do not rely on adjacent sibling rendering without a container.
  - anti-pattern: \`<Column gap="md"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>\`
  - fix: \`<Column gap="m"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>\`

<!-- cross-pitfall-ref: color-imports-from-rac -->
`.trim();

test('operation specs define required and forbidden target fields for every operation', () => {
  assert.deepEqual(PITFALL_FIX_OPERATION_SPECS.append_pitfall.requiredFields, [
    'section',
    'targetFile',
    'operation',
    'newPitfallSlug',
  ]);
  assert.deepEqual(PITFALL_FIX_OPERATION_SPECS.append_pitfall.forbiddenFields, [
    'targetPitfallSlug',
  ]);
  assert.deepEqual(PITFALL_FIX_OPERATION_SPECS.replace_pitfall.requiredFields, [
    'section',
    'targetFile',
    'operation',
    'targetPitfallSlug',
  ]);
  assert.deepEqual(PITFALL_FIX_OPERATION_SPECS.replace_subbullets.forbiddenFields, [
    'newPitfallSlug',
  ]);
});

test('operation specs can be rendered into fix prompt guidance', () => {
  const promptText = formatPitfallOperationSpecsForPrompt();

  assert.match(promptText, /"append_pitfall": Append one brand-new canonical pitfall block/);
  assert.match(promptText, /Required fields: section, targetFile, operation, newPitfallSlug/);
  assert.match(promptText, /Forbidden\/non-empty fields: targetPitfallSlug/);
  assert.match(
    promptText,
    /"replace_subbullets": Rewrite structured content inside one existing pitfall block selected by slug/,
  );
});

test('append_pitfall requires newPitfallSlug', () => {
  const result = applyPitfallFixToSectionText(
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

test('validateFixPayload rejects legacy raw markdown without structured fields', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: '',
    newPitfallSlug: '',
    new: '- **Use gamma label text** — keep gamma copy stable.\n  - anti-pattern: `<Text weight="medium">Gamma</Text>`\n  - fix: `<Text variant="label">Gamma</Text>`',
  });

  assert.equal(result.pass, false);
  assert.match(result.errors.join('; '), /summary is required/);
  assert.match(result.errors.join('; '), /append_pitfall requires newPitfallSlug/);
});

test('validateFixPayload accepts structured append payloads', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: '',
    newPitfallSlug: 'use-gamma-label-text',
    summary: 'Use gamma label text',
    details: 'keep gamma copy stable.',
    antiPatterns: ['<Text weight="medium">Gamma</Text>'],
    fixes: ['<Text variant="label">Gamma</Text>'],
    completeExample: '',
  });

  assert.equal(result.pass, true);
  assert.deepEqual(result.errors, []);
});

test('validateFixPayload accepts append slugs that reflect summary without exactly matching summaryToSlug', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: '',
    newPitfallSlug: 'gamma-label-text-pattern',
    summary: 'Use gamma label text',
    details: 'keep gamma copy stable.',
    antiPatterns: ['<Text weight="medium">Gamma</Text>'],
    fixes: ['<Text variant="label">Gamma</Text>'],
    completeExample: '',
  });

  assert.equal(result.pass, true);
  assert.deepEqual(result.errors, []);
});

test('validateFixPayload rejects append payloads with a targetPitfallSlug', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: 'existing-text-rule',
    newPitfallSlug: 'use-gamma-label-text',
    summary: 'Use gamma label text',
    details: 'keep gamma copy stable.',
    antiPatterns: ['<Text weight="medium">Gamma</Text>'],
    fixes: ['<Text variant="label">Gamma</Text>'],
    completeExample: '',
  });

  assert.equal(result.pass, false);
  assert.match(result.errors.join('; '), /append_pitfall requires targetPitfallSlug to be empty/);
});

test('validateFixPayload accepts append payloads that can be reinterpreted as replacement by target slug', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:ColorSlider',
    targetFile: 'color-slider',
    targetPitfallSlug: 'color-slider-composition-with-color-area',
    newPitfallSlug: '',
    summary: 'When composing with ColorArea, wrap both in a single parent element',
    details: 'use a shared wrapper and spacing-token gap values.',
    antiPatterns: ['<Column gap="md"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>'],
    fixes: ['<Column gap="m"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>'],
    completeExample: '',
  });

  assert.equal(result.pass, true);
  assert.deepEqual(result.errors, []);
});

test('validateFixPayload rejects replace payloads with a newPitfallSlug', () => {
  const result = validateFixPayload({
    operation: 'replace_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: 'use-beta-helper-text',
    newPitfallSlug: 'use-gamma-label-text',
    summary: 'Use beta helper text',
    details: 'keep beta copy stable.',
    antiPatterns: ['<Text weight="medium">Beta</Text>'],
    fixes: ['<Text variant="label">Beta</Text>'],
    completeExample: '',
  });

  assert.equal(result.pass, false);
  assert.match(result.errors.join('; '), /replace_pitfall requires newPitfallSlug to be empty/);
});

test('validateFixPayload rejects markdown-wrapped structured snippets', () => {
  const result = validateFixPayload({
    operation: 'append_pitfall',
    section: 'component:Text',
    targetFile: 'text',
    targetPitfallSlug: '',
    newPitfallSlug: 'use-gamma-label-text',
    summary: 'Use gamma label text',
    details: 'keep gamma copy stable.',
    antiPatterns: ['`<Text weight="medium">Gamma</Text>`'],
    fixes: ['<Text variant="label">Gamma</Text>'],
    completeExample: '',
  });

  assert.equal(result.pass, false);
  assert.match(
    result.errors.join('; '),
    /antiPatterns entries must not include markdown backticks/,
  );
});

test('replace operations require targetPitfallSlug', () => {
  const result = applyPitfallFixToSectionText(
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
  const result = applyPitfallFixToSectionText(
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
  assert.match(
    result.updatedSection,
    /<!-- pitfall: use-alpha-label-text -->[\s\S]*<Text variant="label">Label<\/Text>/,
  );
  assert.match(
    result.updatedSection,
    /<!-- pitfall: use-beta-helper-text -->[\s\S]*<Text variant="label">Beta label<\/Text>/,
  );
});

test('replace_pitfall rejects content whose summary no longer matches the target slug', () => {
  const result = applyPitfallFixToSectionText(
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

test('replace_pitfall recovers a wrong target slug when old text uniquely identifies a block', () => {
  const result = applyPitfallFixToSectionText(
    recoverySection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'invented-beta-slug',
      old: '- anti-pattern: `<Text weight="medium">Beta</Text>`',
      summary: 'Use beta helper text',
      details: 'render beta labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Beta</Text>'],
      fixes: ['<Text variant="label">Recovered beta</Text>'],
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  assert.equal(result.expectedSlug, 'use-beta-helper-text');
  assert.match(
    result.updatedSection,
    /<!-- pitfall: use-beta-helper-text -->[\s\S]*<Text variant="label">Recovered beta<\/Text>/,
  );
});

test('replace_pitfall recovers a wrong target slug when summary uniquely identifies a block', () => {
  const result = applyPitfallFixToSectionText(
    recoverySection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'invented-beta-slug',
      old: '',
      summary: 'Use beta helper text',
      details: 'render beta labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Beta</Text>'],
      fixes: ['<Text variant="label">Recovered beta</Text>'],
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  assert.equal(result.expectedSlug, 'use-beta-helper-text');
});

test('replace_pitfall rejects wrong slugs when old text matches multiple blocks', () => {
  const result = applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'invented-label-slug',
      old: '- anti-pattern: `<Text weight="medium">Label</Text>`',
      summary: 'Use missing label text',
      details: 'render labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Label</Text>'],
      fixes: ['<Text variant="label">Label</Text>'],
    },
    componentTarget,
  );

  assert.match(
    result.error,
    /old text matched multiple pitfall slugs: use-alpha-label-text, use-beta-helper-text/,
  );
});

test('replace_pitfall rejects wrong slugs when summary matches multiple blocks', () => {
  const result = applyPitfallFixToSectionText(
    duplicateSummarySection,
    {
      operation: 'replace_pitfall',
      targetPitfallSlug: 'invented-shared-slug',
      old: '',
      summary: 'Use shared label text',
      details: 'render labels with the label variant.',
      antiPatterns: ['<Text weight="medium">Label</Text>'],
      fixes: ['<Text variant="label">Label</Text>'],
    },
    componentTarget,
  );

  assert.match(
    result.error,
    /summary matched multiple pitfall slugs: use-alpha-label-text, use-beta-label-text/,
  );
});

test('replace_subbullets rewrites one named block without merging in a second pitfall', () => {
  const result = applyPitfallFixToSectionText(
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
  const blocks = getPitfallBlocks(result.updatedSection);
  assert.equal(blocks.length, 2);
  assert.match(blocks[1].text, /complete example:/);
  assert.equal((blocks[1].text.match(/<!-- pitfall:/g) ?? []).length, 1);
});

test('replace_subbullets applies by exact target slug when old text hint does not match', () => {
  const result = applyPitfallFixToSectionText(
    colorSliderSection,
    {
      operation: 'replace_subbullets',
      targetPitfallSlug: 'color-slider-composition-with-color-area',
      old: 'When composing with ColorArea, wrap both in a single parent element — Use `<Column>`',
      summary: 'When composing with ColorArea, wrap both in a single parent element',
      details:
        'Use `<Column>` or a `<div>` as a shared parent to provide layout. When using `<Column>`, use spacing-token gap values.',
      antiPatterns: [
        '<Column gap="md"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>',
        '<Column gap="lg"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>',
      ],
      fixes: [
        '<Column gap="m"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>',
        '<Column gap="l"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>',
      ],
    },
    colorSliderTarget,
    '/repo/docs/components/color-slider.md',
  );

  assert.equal(result.error, undefined);
  assert.deepEqual(result.warnings, ['old text hint did not match; applied by targetPitfallSlug']);
  assert.match(result.updatedSection, /<Column gap="lg">/);
  assert.match(result.updatedSection, /cross-pitfall-ref: color-imports-from-rac/);
});

test('append_pitfall with existing target slug and empty new slug is applied as replace_subbullets', () => {
  const result = applyPitfallFixToSectionText(
    colorSliderSection,
    {
      operation: 'append_pitfall',
      targetPitfallSlug: 'color-slider-composition-with-color-area',
      newPitfallSlug: '',
      old: '',
      summary: 'When composing with ColorArea, wrap both in a single parent element',
      details: 'Use a shared parent and spacing-token gap values.',
      antiPatterns: ['<Column gap="md"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>'],
      fixes: ['<Column gap="m"><ColorArea.Root ... /><ColorSlider.Root ... /></Column>'],
    },
    { ...colorSliderTarget, appendOnly: true },
    '/repo/docs/components/color-slider.md',
  );

  assert.equal(result.error, undefined);
  assert.equal(result.expectedSlug, 'color-slider-composition-with-color-area');
  assert.deepEqual(result.warnings, [
    'append_pitfall with existing targetPitfallSlug was applied as replace_subbullets',
  ]);
});

test('append_pitfall adds a fresh canonical block with the requested slug', () => {
  const result = applyPitfallFixToSectionText(
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
  const blocks = getPitfallBlocks(result.updatedSection);
  assert.equal(blocks.length, 3);
  assert.match(result.updatedSection, /<!-- pitfall: use-gamma-label-text -->/);
});

test('append_pitfall accepts a kebab slug that reflects summary without exact derivation', () => {
  const result = applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'append_pitfall',
      newPitfallSlug: 'gamma-label-text-pattern',
      summary: 'Use gamma label text',
      details: 'keep gamma copy stable.',
      antiPatterns: ['<Text weight="medium">Gamma</Text>'],
      fixes: ['<Text variant="label">Gamma</Text>'],
    },
    componentTarget,
  );

  assert.equal(result.error, undefined);
  assert.match(result.updatedSection, /<!-- pitfall: gamma-label-text-pattern -->/);
});

test('append_pitfall rejects duplicate summaries and points to replace_subbullets', () => {
  const result = applyPitfallFixToSectionText(
    baseSection,
    {
      operation: 'append_pitfall',
      newPitfallSlug: 'beta-helper-text-pattern',
      summary: 'Use beta helper text',
      details: 'keep beta copy stable.',
      antiPatterns: ['<Text weight="medium">Beta</Text>'],
      fixes: ['<Text variant="label">Beta</Text>'],
    },
    componentTarget,
  );

  assert.match(result.error, /duplicates existing slug\(s\): use-beta-helper-text/);
  assert.match(
    result.error,
    /Use replace_subbullets with targetPitfallSlug 'use-beta-helper-text'/,
  );
});
