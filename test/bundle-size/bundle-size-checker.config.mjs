/**
 * @file Configuration file for bundle-size tracking.
 *
 * This file determines which packages and components will have their bundle sizes measured.
 * Note: The bundle-size-checker dependency has been removed. This config is kept for reference.
 */
import path from 'path';
import fs from 'fs/promises';

const rootDir = path.resolve(import.meta.dirname, '../..');

async function getTaleUiExports() {
  const packageJsonPath = path.join(rootDir, 'packages/react/package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  const exports = packageJson.exports;
  const entrypoints = Object.keys(exports).map((exportKey) => {
    const entrypoint = exportKey === '.' ? '@tale-ui/react' : `@tale-ui/react${exportKey.slice(1)}`;
    return entrypoint;
  });

  return entrypoints;
}

async function getUtilsExports() {
  const utilsDir = path.join(rootDir, 'packages/utils/src');
  const files = await fs.readdir(utilsDir);

  const fileStats = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(utilsDir, file);
      const stat = await fs.stat(filePath);
      return { file, stat };
    }),
  );

  const entrypoints = fileStats
    .filter(({ file, stat }) => {
      if (stat.isFile() && !(file.endsWith('.ts') || file.endsWith('.tsx'))) {
        return false;
      }
      if (file.includes('.test.')) {
        return false;
      }
      return true;
    })
    .map(({ file }) => `@tale-ui/utils/${file.replace(/\.(js|ts|tsx)$/, '')}`);

  return entrypoints;
}

export default async function getConfig() {
  return {
    entrypoints: [...(await getTaleUiExports()), ...(await getUtilsExports())],
    upload: !!process.env.CI,
    comment: true,
  };
}
