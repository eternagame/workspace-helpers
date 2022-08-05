import { rules } from '@typescript-eslint/eslint-plugin';

export default {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
      ],
    },
    {
      // The vite configuration doesn't use our tsconfig, it uses vite's default settings,
      // so we can't use rules that require a valid parserOptions.project
      files: ['vite.config.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
      ],
      parserOptions: {
        project: null,
      },
      // Disable all rules that require type checking
      rules: Object.fromEntries(
        Object.entries(rules)
          .filter(([, rule]) => rule.meta.docs?.requiresTypeChecking)
          .map(([name]) => [`@typescript-eslint/${name}`, 'off'])
      ),
    },
  ],
};
