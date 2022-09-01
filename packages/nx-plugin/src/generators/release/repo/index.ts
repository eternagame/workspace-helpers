import {
  generateFiles, GeneratorCallback, getProjects, Tree, writeJson,
} from '@nrwl/devkit';
import { join } from 'path';
import { installDevDependencies } from '@/utils/dependencies';
import { setGeneratorDefaults } from '@/utils/wrap-generator';
import generateReleasePackage from '../package';

interface Schema {
  publish: boolean;
  canary: boolean;
}

function addFiles(tree: Tree, options: Schema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, 'files'), '', templateOptions);
}

export default async function generate(tree: Tree, options: Schema) {
  addFiles(tree, options);

  // While empty, adding a defaults section for this generator will mean package generation
  // will automatically run the release-package generator
  setGeneratorDefaults(tree, 'release-package', {});

  if (options.canary) {
    writeJson(tree, 'lerna.json', {
      $schema: 'node_modules/lerna/schemas/lerna-schema.json',
      useNx: true,
      useWorkspaces: true,
      version: 'independent',
      canary: true,
      preid: 'dev',
      preDistTag: 'canary',
    });
  }

  const finalizeTasks: GeneratorCallback[] = [];

  for (const packageName of getProjects(tree).keys()) {
    // Don't parallelize to avoid potential race conditions
    // eslint-disable-next-line no-await-in-loop
    finalizeTasks.push(await generateReleasePackage(tree, { packageName }));
  }

  return async () => {
    if (options.canary) {
      installDevDependencies(tree, ['lerna']);
    }
    for (const finalize of finalizeTasks) {
      // Don't parallelize to avoid potential race conditions
      // eslint-disable-next-line no-await-in-loop
      await finalize();
    }
  };
}
