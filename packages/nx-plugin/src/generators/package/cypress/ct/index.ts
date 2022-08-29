import {
  generateFiles,
  getProjects,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { join } from 'path';

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
    delete scripts['test:cov'];
    if (scripts['test']) {
      scripts['test:unit'] = scripts['test'];
      scripts['test:component'] = 'cypress run --component';
      scripts['test'] = 'npm run test:unit && npm run test:component';
    } else {
      scripts['test:component'] = 'cypress run --component';
    }
    scripts['test:component-ui'] = 'cypress open --component';

    return json;
  });
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  updateJson(
    tree,
    joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.json'),
    (json: { 'references': unknown[] }) => {
      // eslint-disable-next-line no-param-reassign
      json.references.push({ path: './tsconfig.cy.json' });
      return json;
    },
  );

  return async () => {};
}
