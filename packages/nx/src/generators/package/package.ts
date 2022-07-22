import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  readJson,
  type Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { updateProjectForLicense } from '../license/license';

interface Schema {
  name: string;
  description: string;
  directory: string;
}

interface NormalizedSchema extends Schema {
  importPath: string;
  projectRoot: string;
  packageLicense: string | null;
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

  const json = readJson<Record<string, undefined>>(tree, 'package.json');
  const packageLicense = (json['license'] ?? null) as string | null;

  return {
    ...options,
    importPath,
    projectRoot,
    packageLicense,
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
    templateOptions
  );
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updateProjectForLicense(
    tree,
    normalizedOptions.projectRoot,
    normalizedOptions.packageLicense
  );
  await formatFiles(tree);
}
