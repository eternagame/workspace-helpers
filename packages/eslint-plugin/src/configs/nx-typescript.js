const base = require('./base/nx')(true);

module.exports = {
  extends: require.resolve('./nx-javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      ...base,
    },
  ],
};
