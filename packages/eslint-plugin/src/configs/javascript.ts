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
      files: ['{jest,vite,cypress}.config.{js,mjs,cjs}'],
      rules: {
        // Allow our configs to import dev dependencies
        ...noExtraneousDependencies(true, false),
      },
    },
  ],
};
