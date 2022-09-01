import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generatePackage from '../../base';
import { installDevDependencies } from '@/utils/dependencies';

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
  const importPath = `@${npmScope}/${projectName}`;

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

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  const projectPackageJsonPath = path.join(options.projectRoot, 'package.json');
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    // TODO: Use an env var or some other way of keeping the URLs sync with whatever the app uses?
    scripts['e2e:dev'] = 'nx-spawn e2e:_dev';
    scripts['e2e:_dev'] = 'wait-on http://localhost:4173 && cypress open --e2e';
    scripts['e2e'] = 'nx-spawn _e2e';
    scripts['_e2e'] = 'wait-on http://localhost:4173 && cypress run --e2e';
    scripts['lint'] = 'eslint .';

    return json;
  });
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const finalizePackage = await generatePackage(tree, options);
  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  return async () => {
    await finalizePackage();
    installDevDependencies(
      tree,
      [
        '@eternagame/cypress-utils',
        '@eternagame/tsconfig',
        'cypress',
        'typescript',
        'wait-on',
      ],
    );
  };
}
