export default {
  extends: require.resolve('./typescript'),
  parserOptions: {
    // This has to be done here rather than in the base vue config because it actually
    // needs to be provided to @typescript-eslint/parser for *any* file type it handles.
    // This seemingly has to do with how it "caches" loaded typescript projects.
    // E.g., if we have cypress/support/component.ts and src/App.vue (and, presumably,
    // both can be found within a single tsconfig), the ts file will be loaded first so
    // the typescript project will be created *without* the extra extension, and when it
    // encounters the vue file, it will just reuse that typescript project instead of creating
    // a new one with the extra extension, and so it will complain that it can't find the .vue in
    // any tsconfig.
    extraFileExtensions: ['.vue'],
  },
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
