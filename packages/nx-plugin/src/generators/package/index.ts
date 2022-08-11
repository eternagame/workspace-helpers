import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  type Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { updatePackageLicense } from '../license';

interface Schema {
  name: string;
  description: string;
  directory: string;
}

interface NormalizedSchema extends Schema {
  importPath: string;
  projectRoot: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const name = names(options.name).fileName;
  const { libsDir, npmScope } = getWorkspaceLayout(tree);

  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(/\//g, '-');
  const importPath = npmScope ? `@${npmScope}/${projectName}` : projectName;

  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  return {
    ...options,
    importPath,
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
  addFiles(tree, normalizedOptions);
  updatePackageLicense(tree, normalizedOptions.projectRoot);
}
