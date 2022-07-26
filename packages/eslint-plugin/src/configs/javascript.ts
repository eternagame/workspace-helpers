import noExtraneousDependencies = require('./base/extraneous-deps');

export = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.mjs'],
      extends: [
        'airbnb-base',
        'prettier',
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
  ],
};
