import base = require('./base/nx');

export = {
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      ...base(false),
    },
  ],
};
