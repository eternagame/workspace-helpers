import * as path from 'path';
import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generateTsNode from '../ts-node/ts-node';
import { getDependencyVersions } from '../../utils/dependencies';

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
    templateOptions
  );
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizeTsNode = await generateTsNode(tree, options);

  addFiles(tree, normalizedOptions);

  addDependenciesToPackageJson(
    tree,
    {},
    getDependencyVersions(['nodemon', '@eternagame/nx-spawn'])
  );

  const projectPackageJsonPath = path.join(
    normalizedOptions.projectRoot,
    'package.json'
  );
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    // The initial nx build is to ensure all dependencies are in a good state, as we can't
    // guarantee that the initial build of the build-watch command is completed by the time
    // we start, which could mean that we will error due to unresolved dependencies
    scripts['serve'] =
      'nx build && nx-spawn npm:build-watch --extraRootCommand "nodemon dist/index.es.js"';
    return json;
  });
  /* eslint-enable no-param-reassign */

  await formatFiles(tree);

  return () => {
    finalizeTsNode();
    installPackagesTask(tree);
  };
}
