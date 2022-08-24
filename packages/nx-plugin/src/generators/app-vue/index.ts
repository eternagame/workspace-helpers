import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateWebApp from '../app-web';
import { installDevDependencies } from '../../utils/dependencies';

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

  const finalizeWebApp = await generateWebApp(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.build.json'),
    (json: { 'include': string[] }) => {
      // eslint-disable-next-line no-param-reassign
      json.include = [...json.include, 'src/**/*.vue'];
      return json;
    },
  );

  return () => {
    finalizeWebApp();
    installDevDependencies(tree, ['@eternagame/nx-spawn']);
  };
}
