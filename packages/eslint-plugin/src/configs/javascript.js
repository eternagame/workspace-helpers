module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: [
        'airbnb-base',
        'prettier',
        require.resolve('./base-rules/javascript'),
      ],
    },
  ],
};
