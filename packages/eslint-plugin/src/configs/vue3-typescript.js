module.exports = {
  extends: require.resolve('./typescript'),
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base-rules/javascript'),
        require.resolve('./base-rules/typescript'),
        require.resolve('./base-rules/vue'),
      ],
    },
  ],
};
