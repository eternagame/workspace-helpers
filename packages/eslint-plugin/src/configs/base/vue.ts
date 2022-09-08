export default {
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    parser: {
      // We set the main parser above, but we need to tell eslint what to use for the
      // internal js/ts parts of the SFC
      js: 'espree',
      jsx: 'espree',
      ts: require.resolve('@typescript-eslint/parser'),
      tsx: require.resolve('@typescript-eslint/parser'),
    },
  },
  rules: {},
};
