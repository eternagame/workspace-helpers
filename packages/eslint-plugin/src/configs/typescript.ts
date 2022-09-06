// This config will only be loaded if the user wants typescript support. We have this in optional
// dependencies so that if typescript support isn't wanted, it doesn't need to be installed
// eslint-disable-next-line import/no-extraneous-dependencies
import { rules as tsEslintRules } from '@typescript-eslint/eslint-plugin';
import noExtraneousDependencies from './base/extraneous-deps';

export default {
  extends: require.resolve('./javascript'),
  overrides: [
    {
      files: ['*.{ts,tsx,mts,cts}'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'airbnb-base',
        'airbnb-typescript/base',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
      ],
    },
    {
      files: ['{jest,vitest,vite,cypress}.config.{ts,mts,cts}'],
      parserOptions: {
        // Our configurations aren't tied to our tsconfig, so we can't use rules that require
        // typechecking (nor indicate they should be tied to a tsconfig file)
        project: null,
      },
      rules: {
        // Allow our configs to import dev dependencies
        ...noExtraneousDependencies(true, false),
        // Disable all rules that require type checking
        ...Object.fromEntries(
          Object.entries(tsEslintRules)
            .filter(([, rule]) => rule.meta.docs?.requiresTypeChecking)
            .map(([name]) => [`@typescript-eslint/${name}`, 'off']),
        ),
      },
    },
    {
      files: ['index.{ts,mts,cts}'],
      rules: {
        // Index files are useful for exposing public APIs which may initially only have
        // one thing in them, but eventually are intended to have more exports
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
