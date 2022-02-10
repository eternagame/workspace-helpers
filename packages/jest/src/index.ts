import { Config } from '@jest/types';

// We may want to add other things, so don't default export so that we don't need to break the API later
// eslint-disable-next-line import/prefer-default-export
export function getConfig(mode: 'typescript' | 'vue') {
  const config: Config.InitialOptions = {
    collectCoverageFrom: [
      'src/**/*.(ts|js|vue)',
      '!**/*.spec.ts',
      '!**/*.test.ts',
      '!**/__tests__/*.ts',
      '!**/test/**/*.ts',
    ],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.spec.json',
      },
    },
  };

  if (mode === 'typescript') config.preset = 'ts-jest';
  if (mode === 'vue')
    config.preset = '@vue/cli-plugin-unit-jest/presets/typescript-and-babel';

  return config;
}
