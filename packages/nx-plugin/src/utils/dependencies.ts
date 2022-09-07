import {
  detectPackageManager, getPackageManagerCommand, joinPathFragments, readJson, Tree,
} from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { inOperator } from './json';

const selfPackage = JSON.parse(
  readFileSync(join(__dirname, '../../package.json')).toString(),
) as unknown;
if (
  !inOperator('version', selfPackage)
) {
  throw new Error("Can't detect version of @eternagame/nx-plugin");
}
const { version } = selfPackage;
if (typeof version !== 'string') {
  throw new Error("Can't detect version of @eternagame/nx-plugin");
}
export const NX_PLUGIN_VERSION = version;

function testForDependencies(packageJson: unknown, dependencySection: string): string[] {
  if (!inOperator(dependencySection, packageJson)) return [];
  const deps = packageJson[dependencySection];
  if (typeof deps !== 'object' || deps === null) return [];
  return Object.keys(deps);
}

function getExistingDeps(tree: Tree, packageJsonPath: string): string[] {
  const packageJson: unknown = readJson(tree, packageJsonPath);
  return [
    ...testForDependencies(packageJson, 'dependencies'),
    ...testForDependencies(packageJson, 'devDependencies'),
    ...testForDependencies(packageJson, 'peerDependencies'),
    ...testForDependencies(packageJson, 'optionalDependencies'),
    ...testForDependencies(packageJson, 'bundledDependencies'),
  ];
}

function installDependenciesBase(tree: Tree, deps: string[], packagePath?: string, flags?: string) {
  const existingDeps = getExistingDeps(tree, joinPathFragments(packagePath ?? '', 'package.json'));
  // If it's already installed, don't run install again, as that would update it - we just
  // want it installed if it isn't already, let the consumer handle updates
  const newDeps = deps.filter((dep) => !existingDeps.includes(dep));
  if (newDeps.length > 0) {
    const pmc = getPackageManagerCommand(detectPackageManager());
    let installCmd = pmc.install;
    if (flags) installCmd += ` ${flags}`;
    if (packagePath) installCmd += ` -w ${packagePath}`;
    installCmd += ` ${newDeps.join(' ')}`;
    execSync(installCmd, {
      cwd: tree.root,
      stdio: [0, 1, 2],
    });
  }
}

export function installDependencies(tree: Tree, deps: string[], packagePath?: string) {
  installDependenciesBase(tree, deps, packagePath);
}

export function installDevDependencies(tree: Tree, deps: string[], packagePath?: string) {
  installDependenciesBase(tree, deps, packagePath, '-D');
}
