export default function getBabelConfig(api) {
  const isESM = api.env('esm');

  const presets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        browserslistEnv: isESM ? 'stable' : undefined,
        modules: isESM ? false : 'commonjs',
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      { useESModules: isESM },
    ],
  ];

  return {
    assumptions: {
      noDocumentAll: true,
    },
    presets,
    plugins,
    overrides: [
      {
        exclude: /\.test\.(js|ts|tsx)$/,
        plugins: ['@babel/plugin-transform-react-constant-elements'],
      },
    ],
    env: {
      test: {
        sourceMaps: 'both',
      },
    },
    ignore: [/@babel[/\\]runtime/],
  };
}
