import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateWebLib from '../../web/lib';
import { installDependencies, installDevDependencies } from '../../../../utils/dependencies';

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

  const finalizeWebLib = await generateWebLib(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  // Update build tsconfig
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.build.json'),
    (json: { 'include': string[] }) => {
      // eslint-disable-next-line no-param-reassign
      json.include = [...json.include, 'src/**/*.vue'];
      return json;
    },
  );

  // Update package.json
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'package.json'),
    (json: ({ scripts: { build: string } })) => {
      // eslint-disable-next-line no-param-reassign
      json.scripts.build = `vue-tsc --noEmit --pretty -p tsconfig.build.json && ${json.scripts.build}`;
      return json;
    },
  );

  // Add to recommended vs code extensions
  updateJson(
    tree,
    normalizedOptions.projectRoot,
    (json: { recommendations: string[] }) => {
      if (!json.recommendations.includes('Vue.volar')) json.recommendations.push('Vue.volar');
      return json;
    },
  );

  return async () => {
    await finalizeWebLib();
    installDependencies(tree, ['vue'], normalizedOptions.projectRoot);
    installDevDependencies(tree, ['vue-tsc']);
  };
}
