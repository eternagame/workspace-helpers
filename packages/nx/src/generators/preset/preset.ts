import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  Tree,
  updateJson,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  readJson,
} from '@nrwl/devkit';
import * as path from 'path';

interface Schema {
  copyrightHolder: string;
  description: string;
  skipDiscordLink: boolean;
}

interface NormalizedSchema extends Schema {
  copyrightYear: number;
  nxVersion: string;
  workspaceName: string;
}

function inOperator<K extends string, T>(
  k: K,
  o: T
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
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

  if (
    !inOperator('name', currentPackage) ||
    typeof currentPackage.name !== 'string'
  ) {
    throw new Error(
      '@nrwl/workspace is not present in package.json, so nx version is unable to be resolved'
    );
  }

  return {
    ...options,
    copyrightYear: new Date().getFullYear(),
    nxVersion: currentPackage.devDependencies['@nrwl/workspace'],
    workspaceName: currentPackage.name,
  };
}

function addDependencies(tree: Tree, options: NormalizedSchema) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/eslint-plugin-nx': options.nxVersion,
      eslint: '^8.8.0',
      'eslint-config-airbnb-base': '^15.0.0',
      'eslint-config-airbnb-typescript': '^16.1.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-import': '^2.25.4',
      husky: '^7.0.4',
      'lint-staged': '^12.3.3',
      micromatch: '^4.0.4',
      jest: '^27.5.0',
      '@types/jest': '^27.4.0',
      'ts-jest': '^27.1.3',
    }
  );
}

function updateCoreFiles(tree: Tree) {
  /* eslint-disable no-param-reassign */
  updateJson(tree, 'package.json', (json: Record<string, unknown>) => {
    json['workspaces'] = ['packages/*'];
    json['scripts'] = {
      '_lint-workspace':
        'npx eslint --ignore-path .gitignore --ignore-pattern packages/',
      'lint-workspace': 'npm run _lint-workspace .',
      prepare: 'husky install',
    };
    return json;
  });

  if (tree.exists('.vscode/extensions.json')) {
    updateJson(
      tree,
      '.vscode/extensions.json',
      (json: Record<string, unknown>) => {
        json['recommendations'] ||= [];
        if (Array.isArray(json['recommendations'])) {
          const recommended = [
            'dbaeumer.vscode-eslint',
            'firsttris.vscode-jest-runner',
          ];

          for (const ext of recommended) {
            if (!json['recommendations'].includes(ext)) {
              json['recommendations'].push(ext);
            }
          }
        } else {
          throw new Error('VSC extensions is not an array');
        }
        return json;
      }
    );
  }
  /* eslint-enable no-param-reassign */
  const oldIgnoreFile = tree.read('.gitignore');
  if (!oldIgnoreFile) throw new Error('Git ignore file not found');
  const newContent = oldIgnoreFile
    .toString()
    .replace(/^\/node_modules$/m, 'node_modules');
  tree.write('.gitignore', newContent);
}

function updateNxFiles(tree: Tree) {
  const workspace = readWorkspaceConfiguration(tree);

  // Type validation
  const opts = workspace.tasksRunnerOptions;
  if (!opts) throw new Error('Task runner options missing in nx.json');
  if (!opts['default'])
    throw new Error('Default task runner options missing in nx.json');
  const defaultOpts = opts['default'].options as unknown;
  if (!inOperator('cacheableOperations', defaultOpts))
    throw new Error('Cacheable operations missing in nx.json');
  const ops = defaultOpts.cacheableOperations;
  if (!Array.isArray(ops))
    throw new Error('Cacheable operations in nx.json is not an array');

  if (!ops.includes('build-incremental')) ops.push('build-incremental');
  updateWorkspaceConfiguration(tree, workspace);

  tree.delete('workspace.json');
}

function updatePrettierFiles(tree: Tree) {
  const oldIgnoreFile = tree.read('.prettierignore');
  if (!oldIgnoreFile) throw new Error('Prettier ignore file not found');
  const newContent = oldIgnoreFile
    .toString()
    .replace(/^\/dist$/m, '**/dist')
    .replace(/^\/coverage$/m, '**/coverage');
  tree.write('.prettierignore', newContent);
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), '', templateOptions);
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addDependencies(tree, normalizedOptions);
  updateCoreFiles(tree);
  updateNxFiles(tree);
  updatePrettierFiles(tree);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
