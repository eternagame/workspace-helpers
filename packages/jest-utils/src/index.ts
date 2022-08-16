import type { Config } from '@jest/types';
import { existsSync, readFileSync } from 'fs';

/**
 * Given an object of an unknown type, check if it's an object that contains a particular key
 */
export function inOperator<K extends string, T>(
  k: K,
  o: T,
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

function getModulePaths(tsconfig: string): string[] {
  // The user is putting their tsconfig somewhere we don't understand. Instead of
  // preventing them from doing it, let them take care of modulePaths themselves
  if (!tsconfig || !existsSync(tsconfig)) return [];

  const config: unknown = JSON.parse(readFileSync(tsconfig, 'utf-8'));
  // If they don't have a baseUrl set, don't set modulePaths
  if (!inOperator('compilerOptions', config)) return [];
  const { compilerOptions } = config;
  if (!inOperator('baseUrl', compilerOptions)) return [];
  const { baseUrl } = compilerOptions;
  if (typeof baseUrl !== 'string') return [];
  return [baseUrl];
}

// We may want to add other things, so don't default export so that we don't need to
// break the API later
// eslint-disable-next-line import/prefer-default-export
export function getConfig(mode: 'typescript' | 'vue', options?: { tsconfig?: string }) {
  const tsconfig = options?.tsconfig ?? 'tsconfig.spec.json';

  const config: Config.InitialOptions = {
    testMatch: [
      '**/(__tests__|test|tests|spec)/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    collectCoverageFrom: [
      'src/**/*.(js|mjs|cjs|ts|mts|cts|vue)',
      '!**/*.(spec|test).(js|mjs|cjs|ts|mts|cts)',
      '!**/(__tests__|test|tests|spec)/**/*.(js|mjs|cjs|ts|mts|cts)',
    ],
    modulePaths: getModulePaths(tsconfig),
    globals: {
      'ts-jest': {
        tsconfig,
      },
    },
  };

  if (mode === 'typescript') config.preset = 'ts-jest';
  if (mode === 'vue') config.preset = '@vue/cli-plugin-unit-jest/presets/typescript-and-babel';

  return config;
}
