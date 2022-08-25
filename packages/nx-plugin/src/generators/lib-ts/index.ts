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
  env: 'iso' | 'web' | 'node';
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
    scripts['build'] = 'vite build';
    scripts['build:watch'] = 'vite build --mode development';
    scripts['test'] = 'jest';
    scripts['test:cov'] = 'jest --coverage';
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

function updateTsconfigs(tree: Tree, options: NormalizedSchema) {
  /* eslint-disable no-param-reassign */
  if (options.env === 'web') {
    updateJson(
      tree,
      path.join(options.projectRoot, 'tsconfig.build.json'),
      (json: Record<string, unknown>) => {
        json['extends'] = '@eternagame/tsconfig/tsconfig.web.json';
        return json;
      },
    );
    updateJson(
      tree,
      path.join(options.projectRoot, 'tsconfig.spec.json'),
      (json: Record<string, unknown>) => {
        json['extends'] = '@eternagame/tsconfig/tsconfig.jest-web.json';
        return json;
      },
    );
  } else if (options.env === 'node') {
    updateJson(
      tree,
      path.join(options.projectRoot, 'tsconfig.build.json'),
      (json: Record<string, unknown>) => {
        json['extends'] = '@eternagame/tsconfig/tsconfig.node.json';
        return json;
      },
    );
    updateJson(
      tree,
      path.join(options.projectRoot, 'tsconfig.spec.json'),
      (json: Record<string, unknown>) => {
        json['extends'] = '@eternagame/tsconfig/tsconfig.jest-node.json';
        return json;
      },
    );
  }
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizePackage = await generatePackage(tree, options);
  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);
  updateTsconfigs(tree, normalizedOptions);

  return async () => {
    await finalizePackage();
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
  };
}
