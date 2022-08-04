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
      rules: {
        // We override this one
        '@typescript-eslint/switch-exhaustiveness-check': 'off',
        // airbnb-typescript override these
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/return-await': 'off',
      },
    },
  ],
};
