const noExtraneousDependencies = require('./base/extraneous-deps');

module.exports = {
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
