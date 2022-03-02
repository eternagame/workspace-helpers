import { readFileSync } from 'fs';
import { join } from 'path';
import { readJson, type Tree } from '@nrwl/devkit';

function getLocalVersion(localPackage: string) {
  const projectJson = JSON.parse(
    readFileSync(join(__dirname, '../../../', localPackage, 'package.json'), {
      encoding: 'utf-8',
    })
  ) as Record<string, unknown>;
  if (!projectJson['version'] || typeof projectJson['version'] !== 'string')
    throw new Error(`Unable to get version for ${localPackage}`);
  return projectJson['version'];
}

const VERSIONS = {
  '@eternagame/eslint-plugin': getLocalVersion('eslint-plugin'),
  '@eternagame/nx-spawn': getLocalVersion('nx-spawn'),
  '@eternagame/tsconfig': getLocalVersion('tsconfig'),
  '@eternagame/jest': getLocalVersion('jest'),
  shx: '0.3.4',
  husky: '^7.0.4',
  'lint-staged': '^12.3.3',
  micromatch: '^4.0.4',
  vite: '^2.8.6',
  nodemon: '^2.0.15',
  eslint: '^8.8.0',
  'eslint-config-airbnb-base': '^15.0.0',
  'eslint-config-airbnb-typescript': '^16.1.0',
  'eslint-config-prettier': '^8.3.0',
  'eslint-plugin-import': '^2.25.4',
  '@typescript-eslint/eslint-plugin': '^5.11.0',
  jest: '^27.5.0',
  '@types/jest': '^27.4.0',
  'ts-jest': '^27.1.3',
} as const;

export function getDependencyVersions(
  dependencies: (keyof typeof VERSIONS)[]
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(VERSIONS).filter(([key]) =>
      dependencies.includes(key as keyof typeof VERSIONS)
    )
  );
}

function inOperator<K extends string, T>(
  k: K,
  o: T
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

export function getNxVersion(tree: Tree) {
  const currentPackage = readJson(tree, 'package.json') as unknown;
  if (
    !inOperator('devDependencies', currentPackage) ||
    !inOperator('@nrwl/workspace', currentPackage.devDependencies) ||
    typeof currentPackage.devDependencies['@nrwl/workspace'] !== 'string'
  ) {
    throw new Error(
      '@nrwl/workspace is not present in package.json, so nx version is unable to be resolved'
    );
  }

  return currentPackage.devDependencies['@nrwl/workspace'];
}
