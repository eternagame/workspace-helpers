import path from 'path';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  type Tree,
} from '@nrwl/devkit';
import generateLicense from '../license';
import getDependencyVersions from '../../utils/dependencies';

const ETERNA_NPM_SCOPE = 'eternagame';
const ETERNA_COPYRIGHT_HOLDER = 'Eterna Commons';
const ETERNA_README_PROLOG = `Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)`;

interface Schema {
  name: string;
  description: string;
  npmScope: string;
  license: 'MIT' | 'BSD3' | 'EternaNoncommercial' | 'Custom' | 'None';
  copyrightHolder: string;
  readmeProlog: string;
  eternaDefaults: boolean;
}

function normalizeOptions(options: Schema): Schema {
  const opts = { ...options };

  if (opts.eternaDefaults) {
    opts.copyrightHolder ||= ETERNA_COPYRIGHT_HOLDER;
    opts.readmeProlog ||= ETERNA_README_PROLOG;
    opts.npmScope ||= ETERNA_NPM_SCOPE;
  }

  if (opts.npmScope) {
    opts.name = `@${opts.npmScope}/${opts.name}`;
  }

  return opts;
}

function addDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      ...getDependencyVersions([
        'nx',
        '@eternagame/nx',
        '@eternagame/eslint-plugin',
        'eslint',
        'eslint-config-airbnb-base',
        'eslint-config-airbnb-typescript',
        'eslint-plugin-import',
        '@typescript-eslint/eslint-plugin',
        'husky',
        'lint-staged',
        'micromatch',
      ]),
    },
  );
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
  addDependencies(tree);
  updateNxFiles(tree, normalizedOptions);
  const finalizeGenerateLicense = generateLicense(tree, {
    license: normalizedOptions.license,
    copyrightHolder:
      normalizedOptions.copyrightHolder
      || (normalizedOptions.eternaDefaults ? 'Eterna Commons' : ''),
  });
  await formatFiles(tree);
  return () => {
    finalizeGenerateLicense();
    installPackagesTask(tree);
  };
}
