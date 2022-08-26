import path from 'path';
import {
  generateFiles,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  type Tree,
} from '@nrwl/devkit';
import generateLicense from '../license';
import generateRelease from '../release';
import { installDevDependencies } from '../../utils/dependencies';

const ETERNA_NPM_SCOPE = 'eternagame';
const ETERNA_COPYRIGHT_HOLDER = 'Eterna Commons';
const ETERNA_README_PROLOGUE = `Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)`;

interface Schema {
  name: string;
  description: string;
  npmScope: string;
  release: 'no-release' | 'no-publish' | 'default-private' | 'default-publish';
  license: 'MIT' | 'BSD3' | 'EternaNoncommercial' | 'Custom' | 'None';
  copyrightHolder: string;
  readmePrologue: string;
  eternaDefaults: boolean;
}

function normalizeOptions(options: Schema): Schema {
  const opts = { ...options };

  if (opts.eternaDefaults) {
    opts.copyrightHolder ||= ETERNA_COPYRIGHT_HOLDER;
    opts.readmePrologue ||= ETERNA_README_PROLOGUE;
    opts.npmScope ||= ETERNA_NPM_SCOPE;
  }

  if (opts.npmScope) {
    opts.name = `@${opts.npmScope}/${opts.name}`;
  }

  return opts;
}

function updateNxFiles(tree: Tree, options: Schema) {
  const workspace = readWorkspaceConfiguration(tree);
  const npmScope = options.npmScope || workspace.npmScope;

  const newWorkspace = {
    ...(npmScope ? { npmScope } : {}),
    version: workspace.version,
  };

  updateWorkspaceConfiguration(tree, newWorkspace);
}

function addFiles(tree: Tree, options: Schema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), '', templateOptions);
  // Ensure pre-commit hook is executable
  tree.changePermissions('.husky/pre-commit', 0o755);
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(options);
  addFiles(tree, normalizedOptions);
  updateNxFiles(tree, normalizedOptions);
  const finalizeGenerateLicense = await generateLicense(tree, {
    license: normalizedOptions.license,
    copyrightHolder:
      normalizedOptions.copyrightHolder
      || (normalizedOptions.eternaDefaults ? 'Eterna Commons' : ''),
  });

  let finalizeGenerateRelease = () => {};
  if (options.release !== 'no-release') {
    finalizeGenerateRelease = await generateRelease(tree, { publishing: options.release });
  }

  return () => {
    finalizeGenerateLicense();
    finalizeGenerateRelease();
    installDevDependencies(tree, [
      '@eternagame/nx-plugin',
      '@eternagame/eslint-plugin',
      'nx',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-config-airbnb-typescript',
      'eslint-plugin-import',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'husky',
      'lint-staged',
    ]);
  };
}
