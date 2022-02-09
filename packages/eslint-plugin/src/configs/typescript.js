module.exports = {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base-rules/javascript'),
        require.resolve('./base-rules/typescript'),
      ],
    },
  ],
};
