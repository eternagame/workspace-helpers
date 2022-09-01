import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateWebLib from '../lib';
import { installDevDependencies } from '@/utils/dependencies';

interface Schema {
  name: string;
  description: string;
  directory: string;
}

interface NormalizedSchema extends Schema {
  projectRoot: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const name = names(options.name).fileName;
  const { libsDir } = getWorkspaceLayout(tree);

  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  return {
    ...options,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  tree.delete(joinPathFragments(options.projectRoot, 'index.ts'));
  tree.delete(joinPathFragments(options.projectRoot, 'src/lib.ts'));
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

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeWebLib = await generateWebLib(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  const projectPackageJsonPath = path.join(
    normalizedOptions.projectRoot,
    'package.json',
  );
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['start'] = 'vite preview';
    scripts['dev'] = 'nx-spawn _dev';
    scripts['_dev'] = 'vite';
    delete json['main'];
    delete scripts['build:watch'];
    return json;
  });

  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.build.json'),
    (json: { 'include': string[] }) => {
      // We have an index.html, not an index.ts, so no need to include it
      json.include = json.include.filter((inc) => inc !== 'index.ts');
      return json;
    },
  );
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.spec.json'),
    (json: { 'include': string[] }) => {
      // We have an index.html, not an index.ts, so no need to include it
      json.include = json.include.filter((inc) => inc !== 'index.ts');
      return json;
    },
  );
  /* eslint-enable no-param-reassign */

  return async () => {
    await finalizeWebLib();
    installDevDependencies(tree, ['@eternagame/nx-spawn']);
  };
}
