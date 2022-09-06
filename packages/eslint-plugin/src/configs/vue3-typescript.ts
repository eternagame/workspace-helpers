export default {
  extends: require.resolve('./typescript'),
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'airbnb-base',
        'airbnb-typescript/base',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
        require.resolve('./base/vue'),
      ],
    },
  ],
};
