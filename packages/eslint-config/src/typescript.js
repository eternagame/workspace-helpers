module.exports = {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.tsx?'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./rules/javascript'),
        require.resolve('./rules/typescript'),
      ],
    },
  ],
};
