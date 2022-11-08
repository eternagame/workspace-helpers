import * as path from 'path';
import {
  generateFiles,
  joinPathFragments,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateWebApp from '../../web/app';
import generateCypressCt from '../../cypress/ct';
import { installDependencies, installDevDependencies } from '@/utils/dependencies';
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

  const finalizeWebApp = await generateWebApp(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  // Update tsconfigs to include Vue
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.directory, 'tsconfig.build.json'),
    (json: { 'include': string[] }) => {
      // eslint-disable-next-line no-param-reassign
      json.include = [...json.include, 'src/**/*.vue'];
      return json;
    },
  );
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.directory, 'tsconfig.spec.json'),
    (json: { 'include': string[] }) => {
      // eslint-disable-next-line no-param-reassign
      json.include = [...json.include, 'src/**/*.vue'];
      return json;
    },
  );

  // Update package.json
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.directory, 'package.json'),
    (json: ({ scripts: { build: string } })) => {
      // eslint-disable-next-line no-param-reassign
      json.scripts.build = `vue-tsc --noEmit --pretty -p tsconfig.build.json && ${json.scripts.build}`;
      return json;
    },
  );

  // Add to recommended vs code extensions
  updateJson(
    tree,
    '.vscode/extensions.json',
    (json: { recommendations: string[] }) => {
      if (!json.recommendations.includes('Vue.volar')) json.recommendations.push('Vue.volar');
      return json;
    },
  );

  // We want to use the vue eslint config, not the typescript config
  const eslintrc = tree.read('.eslintrc.js', 'utf-8');
  if (eslintrc) {
    tree.write('.eslintrc.js', eslintrc.replace('plugin:@eternagame/typescript', 'plugin:@eternagame/vue3-typescript'));
  }

  const finalizeCypress = await generateCypressCt(tree, { packageName: options.name });

  return async () => {
    await finalizeWebApp();
    await finalizeCypress();
    installDependencies(tree, ['vue', 'vue-router'], normalizedOptions.directory);
    installDevDependencies(tree, ['vue-tsc', 'eslint-plugin-vue', 'vue-eslint-parser']);
  };
}
