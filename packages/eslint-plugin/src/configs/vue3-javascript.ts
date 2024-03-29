export default {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
        require.resolve('./base/javascript'),
        require.resolve('./base/vue'),
      ],
    },
  ],
};
