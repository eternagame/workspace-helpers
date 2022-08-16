import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generatePackage from '../package';
import { installDevDependencies } from '../../utils/dependencies';

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
  const importPath = `@${npmScope}/${projectName}`;

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

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  const projectPackageJsonPath = path.join(options.projectRoot, 'package.json');
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['prepublishOnly'] = scripts['prepublishOnly']
      ? `${scripts['prepublishOnly']} && nx build`
      : 'nx build';
    scripts['build'] = 'vite build';
    scripts['build:watch'] = 'vite build --mode development';
    scripts['test'] = 'jest';
    scripts['test:cov'] = 'jest --coverage';
    scripts['lint'] = 'eslint .';

    json['type'] = 'module';
    json['main'] = './dist/index.js';
    json['files'] = ['dist'];

    return json;
  });
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  await generatePackage(tree, options);
  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  return () => {
    installDevDependencies(
      tree,
      [
        'vite',
        '@eternagame/tsconfig',
        '@eternagame/jest-utils',
        '@eternagame/vite-utils',
        'jest',
        '@types/jest',
        'ts-jest',
        'typescript',
      ],
    );

    installDevDependencies(
      tree,
      [
        'vite',
      ],
      normalizedOptions.projectRoot,
    );
  };
}
