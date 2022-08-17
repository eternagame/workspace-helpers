import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import { installDevDependencies } from 'utils/dependencies';
import generateTsLib from '../lib-ts';

interface Schema {
  name: string;
  description: string;
  directory: string;
}

interface NormalizedSchema extends Schema {
  projectRoot: string;
  env: 'node';
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
    env: 'node',
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

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeTsLib = await generateTsLib(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  const projectPackageJsonPath = path.join(
    normalizedOptions.projectRoot,
    'package.json',
  );
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['start'] = 'node dist/index.js';
    scripts['dev'] = 'nx-spawn _dev';
    scripts['_dev'] = 'node-dev dist/index.js';
    return json;
  });
  /* eslint-enable no-param-reassign */

  return () => {
    finalizeTsLib();
    installDevDependencies(tree, ['node-dev', '@eternagame/nx-spawn']);
  };
}
