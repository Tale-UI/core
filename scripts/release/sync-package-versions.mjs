import fs from 'node:fs/promises';
import path from 'node:path';

const version = process.argv[2]?.trim();

if (!version) {
  throw new Error(
    'Missing version argument. Usage: node scripts/release/sync-package-versions.mjs <version>',
  );
}

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/.test(version)) {
  throw new Error(`Invalid semver version: "${version}"`);
}

const packageJsonPaths = [
  'packages/react/package.json',
  'packages/styles/package.json',
  'packages/utils/package.json',
];

for (const relativePath of packageJsonPaths) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const content = await fs.readFile(absolutePath, 'utf8');
  const packageJson = JSON.parse(content);
  packageJson.version = version;
  await fs.writeFile(absolutePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
}

console.log(`Synchronized package versions to ${version}`);
