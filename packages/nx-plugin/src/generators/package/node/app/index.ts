import * as path from 'path';
import {
  generateFiles,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import { installDevDependencies } from '@/utils/dependencies';
import generateNodeLib from '../lib';
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

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeNodeLib = await generateNodeLib(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  const projectPackageJsonPath = path.join(
    normalizedOptions.directory,
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

  return async () => {
    await finalizeNodeLib();
    installDevDependencies(tree, ['node-dev', '@eternagame/nx-spawn']);
  };
}
