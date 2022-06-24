import { readJson, type Tree } from '@nrwl/devkit';

const VERSIONS = {
  '@eternagame/eslint-plugin': '^1.1.0',
  '@eternagame/nx-spawn': '^1.0.1',
  '@eternagame/tsconfig': '^1.1.1',
  '@eternagame/jest': '^1.1.0',
  '@eternagame/vite': '^1.0.2',
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
    !inOperator('nx', currentPackage.devDependencies) ||
    typeof currentPackage.devDependencies.nx !== 'string'
  ) {
    throw new Error(
      "nx is missing from your root package.json, so the nx version can't be resolved"
    );
  }

  return currentPackage.devDependencies.nx;
}
