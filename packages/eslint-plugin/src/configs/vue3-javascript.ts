export = {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
        'prettier',
        require.resolve('./base/javascript'),
        require.resolve('./base/vue'),
      ],
    },
  ],
};
