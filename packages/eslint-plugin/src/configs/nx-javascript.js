const base = require('./base-rules/nx')(false);

module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      ...base,
    },
  ],
};
