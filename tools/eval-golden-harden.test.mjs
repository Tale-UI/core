import test from 'node:test';
import assert from 'node:assert/strict';

import { goldenHardenTestUtils } from './eval-golden-harden.mjs';

test('resume config comparison allows changing harden model and provider', () => {
  const previous = {
    prompts: ['primary-button'],
    passes: 3,
    maxRounds: 30,
    difficulty: null,
    slug: 'primary-button',
    slugs: null,
    allowCache: false,
    passThroughArgs: [
      '--provider',
      'claude',
      '--model',
      'sonnet',
      '--fix-provider',
      'claude',
      '--fix-model',
      'sonnet',
      '--fresh',
    ],
  };
  const next = {
    ...previous,
    passThroughArgs: [
      '--provider',
      'lm-studio',
      '--model',
      'qwen3.6',
      '--fix-provider',
      'ollama',
      '--fix-model',
      'qwen3.6',
      '--fresh',
    ],
  };

  assert.equal(goldenHardenTestUtils.sameResumeConfig(previous, next), true);
});

test('resume config comparison allows changing equals-form provider runtime args', () => {
  assert.deepEqual(
    goldenHardenTestUtils.stripResumeRuntimeArgs([
      '--provider=claude',
      '--model=sonnet',
      '--local-url=http://localhost:1234/v1',
      '--fix-provider=ollama',
      '--fix-model=qwen3.6',
      '--fix-local-url=http://localhost:11434/v1',
      '--fresh',
    ]),
    ['--fresh'],
  );
});

test('resume config comparison still rejects changed hardening selection', () => {
  const previous = {
    prompts: ['primary-button'],
    passes: 3,
    maxRounds: 30,
    difficulty: null,
    slug: 'primary-button',
    slugs: null,
    allowCache: false,
    passThroughArgs: ['--provider', 'claude', '--model', 'sonnet', '--fresh'],
  };
  const next = {
    ...previous,
    slug: 'secondary-button',
    prompts: ['secondary-button'],
    passThroughArgs: ['--provider', 'lm-studio', '--model', 'qwen3.6', '--fresh'],
  };

  assert.equal(goldenHardenTestUtils.sameResumeConfig(previous, next), false);
});
