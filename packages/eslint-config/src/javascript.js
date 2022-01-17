module.exports = {
    parserOptions: {
      ecmaVersion: 2020,
    },
    overrides: [
      {
        files: ['*.jsx?'],
        extends: [
          'airbnb-base',
          'prettier',
          require.resolve('./rules/javascript'),
        ],
      },
    ],
};
  