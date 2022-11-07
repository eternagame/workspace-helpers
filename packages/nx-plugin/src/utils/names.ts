import {
  getWorkspaceLayout, joinPathFragments, names, Tree,
} from '@nrwl/devkit';

export default function getPackageNames(
  tree: Tree,
  options: { name: string; directory?: string; },
) {
  // NOTE: It should be assumed that the name and directory passed to this function may have already
  // been run through this function (and may be run through again) as all of our composed generators
  // call this function. Eg, if ts-lib is called with `name: frontend/web`, it will call the package
  // generator with `name: frontend-web, directory: packages/frontend/web`

  const { libsDir, npmScope } = getWorkspaceLayout(tree);

  const packageName = names(options.name).fileName.replace(/\//g, '-');
  const importPath = npmScope ? `@${npmScope}/${packageName}` : packageName;

  const packageDirectory = options.directory
    ? `${names(options.directory).fileName}`
    : names(options.name).fileName;
  const projectRoot = packageDirectory.startsWith(libsDir)
    ? packageDirectory
    : joinPathFragments(libsDir, packageDirectory);

  return {
    name: packageName,
    importPath,
    directory: projectRoot,
  };
}
