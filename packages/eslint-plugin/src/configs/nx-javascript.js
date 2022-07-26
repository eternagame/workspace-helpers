const base = require('./base/nx')(false);

module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      ...base,
    },
  ],
};
