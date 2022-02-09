module.exports = {
  extends: require.resolve('./typescript'),
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
        'prettier',
        require.resolve('./base-rules/javascript'),
        require.resolve('./base-rules/vue'),
      ],
    },
  ],
};
