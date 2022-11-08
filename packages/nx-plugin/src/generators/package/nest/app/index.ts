import * as path from 'path';
import {
  generateFiles,
  joinPathFragments,
  type Tree,
} from '@nrwl/devkit';
import { installDependencies, installDevDependencies } from '@/utils/dependencies';
import generateNodeApp from '../../node/app';
import getPackageNames from '@/utils/names';

interface Schema {
  name: string;
  description: string;
  directory?: string;
}

interface NormalizedSchema extends Schema {
  directory: string;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  return {
    ...options,
    ...getPackageNames(tree, options),
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  tree.delete(joinPathFragments(options.directory, 'src/lib.ts'));
  tree.rename(
    joinPathFragments(options.directory, 'src/__tests__/lib.spec.ts'),
    joinPathFragments(options.directory, 'src/__tests__/app.spec.ts'),
  );
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
    ], normalizedOptions.directory);
    installDevDependencies(tree, ['@types/express']);
  };
}
