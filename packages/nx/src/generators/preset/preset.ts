import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  Tree,
  updateJson,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Schema {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NormalizedSchema extends Schema {}

function normalizeOptions(options: Schema): NormalizedSchema {
  return {
    ...options,
  };
}

function addDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/eslint-plugin-nx': '*',
      eslint: '*',
      'eslint-config-airbnb-base': '*',
      'eslint-config-airbnb-typescript': '*',
      'eslint-config-prettier': '*',
      'eslint-plugin-import': '*',
      husky: '7',
      'lint-staged': '12',
      micromatch: '4',
      jest: '*',
      '@types/jest': '*',
      'ts-jest': '*',
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
  // This is complicated enough to be too much of a pain to properly typecheck, and I'm confident enough that nx will make it exist
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-non-null-assertion
  const ops = workspace.tasksRunnerOptions!['default']!.options
    .cacheableOperations as string[];
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
  const normalizedOptions = normalizeOptions(options);
  addDependencies(tree);
  updateCoreFiles(tree);
  updateNxFiles(tree);
  updatePrettierFiles(tree);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
