import base = require('./base/nx');

export = {
  extends: require.resolve('./nx-javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      ...base(true),
    },
  ],
};
