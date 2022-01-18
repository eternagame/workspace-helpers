module.exports = {
  extends: require.resolve('./nx-javascript'),
  overrides: [
    {
      files: ['*.tsx?'],
      ...require('./rules/nx')(true),
    },
  ],
};
