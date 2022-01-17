module.exports = {
    overrides: [
      {
        files: ['*.jsx?'],
        ...require('./rules/nx')(false),
      },
    ],
};
