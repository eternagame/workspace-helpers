import base from 'eslint-config-airbnb-typescript/lib/shared';

const [indentLevel, indentAmount, indentConfig] = base.rules['@typescript-eslint/indent'];

export default {
  parserOptions: {
    project: ['tsconfig.*?.json', 'tsconfig.json'],
  },
  rules: {
    // default-case doesn't understand the idea of exhaustivity (because it doesn't understand
    // types), but switch-exhaustiveness-check does
    'default-case': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    // This is generally covered by typescript - and it will run into issues with switch
    // exhaustivity too
    'consistent-return': 'off',
    // This gets very noisy when you have a bunch of attributes
    // Note: Specified for JS in rules/javascript.ts
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    // It's nice to put the primary class up front in a file
    '@typescript-eslint/no-use-before-define': ['error', { classes: false }],
    // Don't warn about eg a nest module that doesn't have a class body
    '@typescript-eslint/no-extraneous-class': ['warn', { allowWithDecorator: true }],
    // Typescript can handle this + configuration is a pain
    // https://github.com/iamturns/eslint-config-airbnb-typescript/tree/v17.0.0#why-is-importno-unresolved-disabled
    'import/no-unresolved': 'off',
    // Similar deal as the above - the import plugin won't resolve our aliases properly, plus
    // tsc already places limitations on allowed extensions
    'import/extensions': 'off',
    // See https://github.com/typescript-eslint/typescript-eslint/issues/1824
    '@typescript-eslint/indent': [
      indentLevel,
      indentAmount,
      {
        ...indentConfig,
        ignoredNodes: [
          ...indentConfig.ignoredNodes,
          'FunctionExpression[params]:has(Identifier[decorators])',
        ],
      },
    ],
  },
};
