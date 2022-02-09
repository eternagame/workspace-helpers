const base = require('./base-rules/nx')(true);

module.exports = {
  extends: require.resolve('./nx-javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      ...base,
    },
  ],
};
