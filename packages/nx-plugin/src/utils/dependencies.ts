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
const selfVersion = selfPackage.version;
if (typeof selfPackage.version !== 'string') {
  throw new Error("Can't detect version of @eternagame/nx-plugin");
}

function getSelfPackagePeer(dependency: string): string {
  if (
    !inOperator('peerDependencies', selfPackage)
    || !inOperator(dependency, selfPackage.peerDependencies)
  ) {
    throw new Error(`Can't detect version of ${dependency}`);
  }

  const version = selfPackage.peerDependencies[dependency];
  if (typeof version !== 'string') {
    throw new Error(`Can't detect version of ${dependency}`);
  }

  // We set >= in our peer dependencies so that users can install newer versions, but when we do
  // install we want to set the required version to ^
  return version.replace('>=', '^');
}

export default function getDependencyVersions(dependencies: string[]): Record<string, string> {
  return Object.fromEntries(dependencies.map((dep) => {
    // Pin `nx` by default so that upgrades to `@eternagame/nx-plugin` with an updated peer
    // dependency don't "silently" upgrade `nx` (in the package-lock.json but not in the
    // package.json) in case the user wanted to `nx migrate nx`.
    if (dep === 'nx') return [dep, getSelfPackagePeer('nx').replace('^', '')];
    if (dep === '@eternagame/nx-plugin') return [dep, selfVersion];
    return [dep, getSelfPackagePeer(dep)];
  }));
}
