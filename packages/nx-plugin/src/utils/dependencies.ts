import { readFileSync } from 'fs';
import { join } from 'path';
import { inOperator } from './json';

const selfPackage = JSON.parse(
  readFileSync(join(__dirname, '../../package.json')).toString(),
) as unknown;
if (
  !inOperator('version', selfPackage)
  || typeof selfPackage.version !== 'string'
) {
  throw new Error("Can't detect version of @eternagame/nx-plugin");
}
if (
  !inOperator('peerDependencies', selfPackage)
  || !inOperator('nx', selfPackage.peerDependencies)
  || typeof selfPackage.peerDependencies.nx !== 'string'
) {
  throw new Error("Can't detect version of nx");
}

const VERSIONS = {
  // Pin `nx` by default so that upgrades to `@eternagame/nx-plugin` with an updated peer dependency
  // don't "silently" upgrade `nx` (in the package-lock.json but not in the package.json)
  // in case the user wanted to `nx migrate nx`.
  nx: selfPackage.peerDependencies.nx.replace('^', ''),
  '@nrwl/eslint-plugin-nx': selfPackage.peerDependencies.nx,
  '@eternagame/nx-plugin': selfPackage.version,
  '@eternagame/eslint-plugin': '^1.1.0',
  '@eternagame/nx-spawn': '^1.0.1',
  '@eternagame/tsconfig': '^1.1.1',
  '@eternagame/jest-utils': '^1.1.0',
  '@eternagame/vite-utils': '^1.0.2',
  shx: '0.3.4',
  husky: '^7.0.4',
  'lint-staged': '^12.3.3',
  micromatch: '^4.0.4',
  vite: '^2.8.6',
  'node-dev': '^7.4.3',
  eslint: '^8.8.0',
  'eslint-config-airbnb-base': '^15.0.0',
  'eslint-config-airbnb-typescript': '^16.1.0',
  'eslint-plugin-import': '^2.25.4',
  '@typescript-eslint/eslint-plugin': '^5.11.0',
  typescript: '^4.7.4',
  jest: '^27.5.0',
  '@types/jest': '^27.4.0',
  'ts-jest': '^27.1.3',
  'ts-node': '^10.9.1',
} as const;

export default function getDependencyVersions(
  dependencies: (keyof typeof VERSIONS)[],
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(VERSIONS).filter(([key]) => dependencies.includes(key as keyof typeof VERSIONS)),
  );
}
