// Note: To debug stylelint config resolution for a specific file, use
//         pnpm exec stylelint --print-config <path-to-file>

/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard',
  rules: {
    // Adopted from upstream — relax rules that conflict with the project's style
    'alpha-value-notation': null,
    'custom-property-pattern': null,
    'media-feature-range-notation': null,
    'no-empty-source': null,
    'selector-class-pattern': null,
    'string-no-newline': null,
    'value-keyword-case': null,
    'import-notation': null,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'config'] }],
    'property-no-vendor-prefix': null,
    'property-no-deprecated': null,
    'declaration-property-value-keyword-no-deprecated': null,
    'color-hex-length': null,
    'declaration-block-no-redundant-longhand-properties': null,

    // Responsibility of prettier
    'rule-empty-line-before': null,

    // Tale UI overrides — empty lines help readability
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'function-no-unknown': true,
    'number-max-precision': 5,

    'no-descending-specificity': null, // Some styles depend on order
  },
};
