import * as path from 'path';
import {
  generateFiles,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateTsLib from '../../ts/lib';
import getPackageNames from '@/utils/names';

interface Schema {
  name: string;
  description: string;
  directory?: string;
}

interface NormalizedSchema extends Schema {
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

function updateTsconfigs(tree: Tree, options: NormalizedSchema) {
  /* eslint-disable no-param-reassign */
  updateJson(
    tree,
    path.join(options.directory, 'tsconfig.build.json'),
    (json: Record<string, unknown>) => {
      json['extends'] = '@eternagame/tsconfig/tsconfig.web.json';
      return json;
    },
  );
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeTsLib = await generateTsLib(tree, normalizedOptions);
  addFiles(tree, normalizedOptions);
  updateTsconfigs(tree, normalizedOptions);

  return async () => {
    await finalizeTsLib();
  };
}
