import noExtraneousDependencies from './base/extraneous-deps';

export default {
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.mjs'],
      extends: [
        'airbnb-base',
        require.resolve('./base/javascript'),
      ],
    },
    {
      files: ['jest.config.mjs'],
      rules: {
        // Allow our jest config to import dev dependencies
        ...noExtraneousDependencies(true, false),
      },
    },
    {
      files: ['vite.config.mjs'],
      rules: {
        // Allow our jest config to import dev dependencies
        ...noExtraneousDependencies(true, false),
      },
    },
  ],
};
