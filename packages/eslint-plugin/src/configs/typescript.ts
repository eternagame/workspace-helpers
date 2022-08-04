import noExtraneousDependencies from "./base/extraneous-deps";

export default {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.ts', '*.tsx', "*.mts", "*.cts"],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
      ],
    },
    {
      files: ['{jest,vite}.config.{ts,mts,cts}'],
      rules: {
        // Allow our configs to import dev dependencies
        ...noExtraneousDependencies(true, false),
      },
    }
  ],
};
