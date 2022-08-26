import path from 'path';
import {
  generateFiles,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  type Tree,
} from '@nrwl/devkit';
import { setGeneratorDefaults } from 'utils/wrap-generator';
import generateLicense from '../license/repo';
import generateRelease from '../release/repo';
import { installDevDependencies } from '../../utils/dependencies';

const ETERNA_NPM_SCOPE = 'eternagame';
const ETERNA_COPYRIGHT_HOLDER = 'Eterna Commons';
const ETERNA_README_PROLOGUE = `Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)`;

interface Schema {
  name: string;
  description: string;
  npmScope: string;
  defaultPublish: 'private' | 'restricted' | 'public';
  release: 'disable' | 'no-publish' | 'publish' | 'publish-with-canary';
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

  setGeneratorDefaults(tree, 'package', {
    publish: normalizedOptions.defaultPublish,
  });

  let finalizeGenerateRelease = async () => {};
  if (normalizedOptions.release !== 'disable') {
    finalizeGenerateRelease = await generateRelease(tree, {
      publish: normalizedOptions.release === 'publish' || normalizedOptions.release === 'publish-with-canary',
      canary: normalizedOptions.release === 'publish-with-canary',
    });
  }

  return async () => {
    await finalizeGenerateLicense();
    await finalizeGenerateRelease();
    installDevDependencies(tree, [
      '@eternagame/nx-plugin',
      '@eternagame/eslint-plugin',
      'nx',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-config-airbnb-typescript',
      'eslint-plugin-import',
      '@typescript-eslint/eslint-plugin',
      'husky',
      'lint-staged',
    ]);
  };
}
