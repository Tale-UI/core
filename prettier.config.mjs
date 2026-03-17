/** @type {import('prettier').Config} */
export default {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [{ files: ['**/*.json'], options: { trailingComma: 'none' } }],
};
