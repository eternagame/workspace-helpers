import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateIso from '../ts-iso';

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

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeIso = await generateIso(tree, options);

  addFiles(tree, normalizedOptions);

  /* eslint-disable no-param-reassign */
  updateJson(
    tree,
    path.join(normalizedOptions.projectRoot, 'tsconfig.build.json'),
    (json: Record<string, unknown>) => {
      json['extends'] = '@eternagame/tsconfig/tsconfig.web.json';
      return json;
    },
  );
  updateJson(
    tree,
    path.join(normalizedOptions.projectRoot, 'tsconfig.spec.json'),
    (json: Record<string, unknown>) => {
      json['extends'] = '@eternagame/tsconfig/tsconfig.jest-web.json';
      return json;
    },
  );
  /* eslint-enable no-param-reassign */

  await formatFiles(tree);

  return () => {
    finalizeIso();
  };
}
