import noExtraneousDependencies from './base/extraneous-deps';

export default {
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.{js,jsx,mjs,cjs}'],
      extends: [
        'airbnb-base',
        require.resolve('./base/javascript'),
      ],
    },
    {
      files: ['{jest,vitest,vite,cypress}.config.{js,mjs,cjs}'],
      rules: {
        // Allow our configs to import dev dependencies
        ...noExtraneousDependencies(true, false),
      },
    },
    {
      files: ['index.{js,mjs,cjs}'],
      rules: {
        // Index files are useful for exposing public APIs which may initially only have
        // one thing in them, but eventually are intended to have more exports
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
