import * as path from 'path';
import {
  generateFiles,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import generatePackage from '../../base';
import { installDevDependencies } from '@/utils/dependencies';
import getPackageNames from '@/utils/names';

interface Schema {
  name: string;
  description: string;
  directory?: string;
}

interface NormalizedSchema extends Schema {
  importPath: string;
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

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  const projectPackageJsonPath = path.join(options.directory, 'package.json');
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

  const finalizePackage = await generatePackage(tree, normalizedOptions);

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
