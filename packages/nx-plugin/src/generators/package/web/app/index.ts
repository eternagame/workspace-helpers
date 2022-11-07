import * as path from 'path';
import {
  generateFiles,
  joinPathFragments,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateWebLib from '../lib';
import { installDevDependencies } from '@/utils/dependencies';
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
  tree.delete(joinPathFragments(options.directory, 'index.ts'));
  tree.delete(joinPathFragments(options.directory, 'src/lib.ts'));
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

  const finalizeWebLib = await generateWebLib(tree, options);

  addFiles(tree, normalizedOptions);

  const projectPackageJsonPath = path.join(
    normalizedOptions.directory,
    'package.json',
  );
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['start'] = 'vite preview';
    scripts['dev'] = 'nx-spawn _dev';
    scripts['_dev'] = 'vite';
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete json['main'];
    delete scripts['build:watch'];
    return json;
  });

  updateJson(
    tree,
    joinPathFragments(normalizedOptions.directory, 'tsconfig.build.json'),
    (json: { 'include': string[] }) => {
      // We have an index.html, not an index.ts, so no need to include it
      json.include = json.include.filter((inc) => inc !== 'index.ts');
      return json;
    },
  );
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.directory, 'tsconfig.spec.json'),
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
