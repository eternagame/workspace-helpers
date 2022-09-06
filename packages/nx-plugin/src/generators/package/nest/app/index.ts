import * as path from 'path';
import {
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  type Tree,
} from '@nrwl/devkit';
import { installDependencies, installDevDependencies } from '@/utils/dependencies';
import generateNodeApp from '../../node/app';

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
  tree.delete(joinPathFragments(options.projectRoot, 'src/lib.ts'));
  tree.rename(
    joinPathFragments(options.projectRoot, 'src/__tests__/lib.spec.ts'),
    joinPathFragments(options.projectRoot, 'src/__tests__/app.spec.ts'),
  );
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

  const finalizeNodeApp = await generateNodeApp(tree, normalizedOptions);

  addFiles(tree, normalizedOptions);

  return async () => {
    await finalizeNodeApp();
    installDependencies(tree, [
      '@nestjs/core',
      '@nestjs/common',
      '@nestjs/config',
      '@nestjs/swagger',
      '@nestjs/platform-express',
      'reflect-metadata',
      'class-validator',
      'class-transformer',
    ], normalizedOptions.projectRoot);
    installDevDependencies(tree, ['@types/express']);
  };
}
