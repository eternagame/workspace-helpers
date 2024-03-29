import {
  generateFiles,
  getProjects,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { join } from 'path';
import { installDevDependencies } from '@/utils/dependencies';
import updateGitHubActions from '../utils/actions';

interface Schema {
  packageName: string;
}

interface NormalizedSchema {
  projectRoot: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const projects = getProjects(tree);
  const project = projects.get(options.packageName);
  if (!project) throw new Error(`Package ${options.packageName} does not exist`);

  return {
    ...options,
    projectRoot: project.root,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  tree.delete(joinPathFragments(options.projectRoot, 'src/__tests__'));
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(
    tree,
    join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  );
}

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  const projectPackageJsonPath = join(options.projectRoot, 'package.json');
  /* eslint-disable no-param-reassign */
  updateJson(tree, projectPackageJsonPath, (json: Record<string, unknown>) => {
    if (!json['scripts']) json['scripts'] = {};
    const scripts = json['scripts'] as Record<string, string>;
    scripts['test'] = 'cypress run --component';
    scripts['test:ui'] = 'nx-spawn test:_ui';
    scripts['test:_ui'] = 'cypress open --component';
    // TODO: Figure out cypress ct test coverage. Related: https://github.com/cypress-io/cypress/issues/16798
    delete scripts['test:cov'];
    // Cypress doesn't have a non-ui watch mode - see https://github.com/cypress-io/cypress/issues/3665
    delete scripts['test:watch'];

    return json;
  });
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  /* eslint-disable no-param-reassign */
  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.spec.json'),
    (json: { compilerOptions: { types: string[] }, include: string[] }) => {
      json.compilerOptions.types = ['cypress'];
      json.include = [...json.include, 'cypress/**/*'];
      return json;
    },
  );
  /* eslint-enable no-param-reassign */

  updateGitHubActions(tree);

  return async () => {
    installDevDependencies(
      tree,
      [
        '@eternagame/cypress-utils',
        'cypress',
      ],
    );
  };
}
