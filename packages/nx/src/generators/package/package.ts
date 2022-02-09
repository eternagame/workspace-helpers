import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Schema {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NormalizedSchema extends Schema {}

function normalizeOptions(options: Schema): NormalizedSchema {
  return {
    ...options,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), '', templateOptions);
  return () => {
    installPackagesTask(tree);
  };
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
