import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateTsLib from '../../ts/lib';

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

function updateTsconfigs(tree: Tree, options: NormalizedSchema) {
  /* eslint-disable no-param-reassign */
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
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeTsLib = await generateTsLib(tree, options);
  addFiles(tree, normalizedOptions);
  updateTsconfigs(tree, normalizedOptions);

  return async () => {
    await finalizeTsLib();
  };
}
