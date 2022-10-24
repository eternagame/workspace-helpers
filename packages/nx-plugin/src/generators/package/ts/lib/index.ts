import * as path from 'path';
import {
  generateFiles,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generatePackage from '../../base';
import { installDevDependencies } from '@/utils/dependencies';
import getPackageNames from '@/utils/names';

interface Schema {
  name: string;
  description: string;
  directory?: string;
}

interface NormalizedSchema extends Schema {
  importPath: string;
  directory: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  return {
    ...options,
    ...getPackageNames(tree, options),
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
    options.directory,
    templateOptions,
  );
}

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  const projectPackageJsonPath = path.join(options.directory, 'package.json');
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['build'] = 'vite build';
    scripts['build:watch'] = 'vite build --mode development';
    scripts['test'] = 'vitest run';
    scripts['test:watch'] = 'vitest';
    scripts['test:cov'] = 'vitest run --coverage';
    scripts['lint'] = 'eslint .';

    json['type'] = 'module';
    json['main'] = './dist/index.js';
    json['exports'] = {
      import: './dist/index.js',
      require: './dist/index.cjs',
    };

    return json;
  });
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizePackage = await generatePackage(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  // Add vitest extension configuration
  updateJson(
    tree,
    '.vscode/settings.json',
    (json: Record<string, unknown>) => ({
      ...json,
      'vitest.commandLine': 'npm exec vitest -ws -- --passWithNoTests',
    }),
  );

  return async () => {
    await finalizePackage();
    installDevDependencies(
      tree,
      [
        'vite',
        '@eternagame/tsconfig',
        '@eternagame/vite-utils',
        'vitest',
        'typescript',
      ],
    );
  };
}
