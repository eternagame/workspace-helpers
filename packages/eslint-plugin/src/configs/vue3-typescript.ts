export = {
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
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
        require.resolve('./base/vue'),
      ],
    },
  ],
};
