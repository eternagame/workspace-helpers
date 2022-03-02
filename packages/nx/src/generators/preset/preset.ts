import path from 'path';
import { chmodSync } from 'fs';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  updateJson,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  readJson,
  joinPathFragments,
  type Tree,
} from '@nrwl/devkit';
import generateLicense from '../license/license';
import { getDependencyVersions, getNxVersion } from '../../utils/dependencies';

interface Schema {
  description: string;
  license: 'MIT' | 'BSD3' | 'Custom' | 'None';
  copyrightHolder: string;
  readmeProlog: string;
}

interface NormalizedSchema extends Schema {
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
    !inOperator('name', currentPackage) ||
    typeof currentPackage.name !== 'string'
  ) {
    throw new Error('Unable to determine workspace name');
  }

  return {
    ...options,
    workspaceName: currentPackage.name,
  };
}

function addDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/eslint-plugin-nx': getNxVersion(tree),
      ...getDependencyVersions([
        '@eternagame/eslint-plugin',
        'eslint',
        'eslint-config-airbnb-base',
        'eslint-config-airbnb-typescript',
        'eslint-config-prettier',
        'eslint-plugin-import',
        '@typescript-eslint/eslint-plugin',
        'husky',
        'lint-staged',
        'micromatch',
      ]),
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
    .replace(/^\/node_modules$/m, 'node_modules')
    .replace(/^\/dist$/m, 'dist')
    .replace(/^\/coverage$/m, 'coverage');
  tree.write('.gitignore', newContent);

  if (tree.exists('tsconfig.base.json')) {
    tree.delete('tsconfig.base.json');
  }
}

function updateNxFiles(tree: Tree) {
  const workspace = readWorkspaceConfiguration(tree);

  const newWorkspace = {
    extends: '@eternagame/nx/preset.json',
    ...(workspace.npmScope ? { npmScope: workspace.npmScope } : {}),
    version: workspace.version,
  };

  updateWorkspaceConfiguration(tree, newWorkspace);

  tree.delete('workspace.json');
}

function updatePrettierFiles(tree: Tree) {
  const oldIgnoreFile = tree.read('.prettierignore');
  if (!oldIgnoreFile) throw new Error('Prettier ignore file not found');
  const newContent = oldIgnoreFile
    .toString()
    .replace(/^\/dist$/m, 'dist')
    .replace(/^\/coverage$/m, 'coverage');
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
  addDependencies(tree);
  updateCoreFiles(tree);
  updateNxFiles(tree);
  updatePrettierFiles(tree);
  addFiles(tree, normalizedOptions);
  const finalizeGenerateLicense = generateLicense(tree, {
    license: options.license,
    copyrightHolder: options.copyrightHolder,
  });
  await formatFiles(tree);
  return () => {
    // Ensure pre-commit hook is executable
    chmodSync(joinPathFragments(tree.root, '.husky/pre-commit'), 0o755);
    finalizeGenerateLicense();
    installPackagesTask(tree);
  };
}
