#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const packageRoot = path.resolve(import.meta.dirname, '..');
const generated = await fs.readFile(path.join(packageRoot, 'src/generated.ts'), 'utf8');

assert.match(generated, /space4xs: 5\.2/);
assert.match(generated, /radiusM: 10/);
assert.match(generated, /textM: 16/);
assert.match(generated, /brand60: '#025768'/);
assert.match(generated, /light:/);
assert.match(generated, /dark:/);

process.stdout.write('✓ Generated web and native tokens contain the expected canonical values.\n');
