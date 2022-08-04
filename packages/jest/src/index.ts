import type { Config } from '@jest/types';

// We may want to add other things, so don't default export so that we don't need to break the API later
// eslint-disable-next-line import/prefer-default-export
export function getConfig(mode: 'typescript' | 'vue') {
  const config: Config.InitialOptions = {
    collectCoverageFrom: [
      'src/**/*.(js|mjs|cjs|ts|mts|cts|vue)',
      '!**/*.(spec|test).(js|mjs|cjs|ts|mts|cts)',
      '!**/(__tests__|test)/*.(js|mjs|cjs|ts|mts|cts)',
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
