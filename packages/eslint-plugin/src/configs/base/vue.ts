export default {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: {
      // plugin:vue/vue3-recommended will set the main parser, but we need to tell eslint what to
      // use for the internal js/ts parts of the SFC
      js: 'espree',
      jsx: 'espree',
      ts: require.resolve('@typescript-eslint/parser'),
      tsx: require.resolve('@typescript-eslint/parser'),
    },
  },
  rules: {},
};
