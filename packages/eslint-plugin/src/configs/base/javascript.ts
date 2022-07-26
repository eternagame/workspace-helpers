import baseStyle = require('eslint-config-airbnb-base/rules/style');

module.exports = {
  rules: {
    // We use this to be clear about private members
    'no-underscore-dangle': 'off',
    // It requires being a bit careful, but these allow for a bit cleaner arithmetic
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    // We might want to do this with small utility classes
    'max-classes-per-file': 'off',
    // While technically it can be a static method if you don't use `this`, stylistically
    // we prefer using static methods when it actually needs to be used without an instance
    'class-methods-use-this': 'off',
    // We like using for..of statements
    'no-restricted-syntax': baseStyle.rules['no-restricted-syntax'].filter(
      (v) => typeof v === 'string' || v.selector !== 'ForOfStatement'
    ),
    // This gets very noisy when you have a bunch of attributes
    // Note: Overwritten for ts, as there's a separate @typescript-eslint rule
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
};
