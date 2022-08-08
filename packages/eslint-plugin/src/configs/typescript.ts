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
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        require.resolve('./base/javascript'),
        require.resolve('./base/typescript'),
      ],
    },
    {
      files: ['{jest,vite}.config.{ts,mts,cts}'],
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
            .map(([name]) => [`@typescript-eslint/${name}`, 'off'])
        ),
      },
    },
  ],
};
