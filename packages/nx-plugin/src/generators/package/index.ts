import {
  detectPackageManager,
  generateFiles,
  getPackageManagerCommand,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  readJson,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { inOperator } from 'utils/json';
import { join } from 'path';
import { execSync } from 'child_process';
import { updatePackageLicense } from '../license';

interface Schema {
  name: string;
  description: string;
  directory: string;
}

interface NormalizedSchema extends Schema {
  importPath: string;
  projectRoot: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const name = names(options.name).fileName;
  const { libsDir, npmScope } = getWorkspaceLayout(tree);

  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(/\//g, '-');
  const importPath = npmScope ? `@${npmScope}/${projectName}` : projectName;

  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  return {
    ...options,
    importPath,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  );
}

/**
 * Parses the npm `repository` field, turning the string shorthand into the full format
 * so that we can add the directory field
 *
 * See https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository and
 * https://docs.npmjs.com/cli/v8/commands/npm-install#description
 *
 * @param originalRepoInfo
 */
function parseRepoInfo(originalRepoInfo: unknown) {
  if (inOperator('url', originalRepoInfo) && inOperator('type', originalRepoInfo)) return originalRepoInfo;
  if (typeof originalRepoInfo === 'string') {
    let url = originalRepoInfo
      .replace('github:', 'https://github.com/')
      .replace('gist:', 'https://gist.github.com/')
      .replace('bitbucket:', 'https://bitbucket.org/')
      .replace('gitlab:', 'https://gitlab.com/');

    // If no prefix is present, it defaults to github
    if (!url.startsWith('https')) url = `https://github.com/${url}`;

    url += '.git';

    return {
      type: 'git',
      url,
    };
  }

  throw new Error('Unable to parse repository field of root package.json');
}

function addPackageInfoFields(tree: Tree, options: NormalizedSchema) {
  const rootPackage: unknown = readJson(tree, 'package.json');
  updateJson(tree, join(options.projectRoot, 'package.json'), (packagePackage: unknown) => {
    if (typeof packagePackage !== 'object') throw new Error(`Unable to parse ${options.projectRoot}/package.json`);
    return {
      ...packagePackage,
      ...(inOperator('author', rootPackage) ? { author: rootPackage.author } : {}),
      ...(inOperator('homepage', rootPackage) ? { homepage: rootPackage.homepage } : {}),
      ...(inOperator('bugs', rootPackage) ? { bugs: rootPackage.bugs } : {}),
      ...(inOperator('funding', rootPackage) ? { funding: rootPackage.funding } : {}),
      ...(inOperator('repository', rootPackage) ? { repository: { ...parseRepoInfo(rootPackage.repository), directory: options.projectRoot } } : {}),
    };
  });
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  addPackageInfoFields(tree, normalizedOptions);
  updatePackageLicense(tree, normalizedOptions.projectRoot);

  return async () => {
    const pmc = getPackageManagerCommand(detectPackageManager());
    // In order for possible future calls to `npm install -w` to work, we need to make sure
    // this new package is registered in our package-lock.json
    execSync(`${pmc.install} --package-lock-only`, {
      cwd: tree.root,
      stdio: [0, 1, 2],
    });
  };
}
