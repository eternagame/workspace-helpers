import {
  generateFiles,
  getProjects,
  logger,
  readNxJson,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import path from 'path';
import { inOperator, isArrayMember } from '../../utils/json';

const licenseOptions = [
  'MIT',
  'BSD3',
  'EternaNoncommercial',
  'Custom',
  'None',
] as const;

interface Schema {
  license: typeof licenseOptions[number];
  copyrightHolder: string;
}

/**
 * Convert license option to format appropriate for package.json
 *
 * @param license License from generator options
 * @returns SPDX license specifier (or direction to see license file)
 */
function getPackageLicense(license: Schema['license']) {
  switch (license) {
    case 'None':
      return 'UNLICENSED';
    case 'Custom':
      return 'SEE LICENSE IN LICENSE';
    case 'EternaNoncommercial':
      return 'SEE LICENSE IN LICENSE';
    case 'BSD3':
      return 'BSD-3-Clause';
    case 'MIT':
      return 'MIT';
  }
}

function updateLicense(tree: Tree, root: string, options: Schema) {
  const license = getPackageLicense(options.license);
  updateJson(
    tree,
    path.join(root, 'package.json'),
    (json: Record<string, unknown>) => ({ ...json, license })
  );

  if (options.license !== 'None' && options.license !== 'Custom') {
    const templateOptions = {
      ...options,
      copyrightYear: new Date().getFullYear(),
      tmpl: '',
    };
    generateFiles(tree, path.join(__dirname, 'files'), root, templateOptions);
  }
}

export function updatePackageLicense(tree: Tree, projectRoot: string) {
  const options =
    readNxJson().generators?.['@eternagame/nx:license'] ||
    (readNxJson().generators?.['@eternagame/nx'] as Record<string, unknown>)?.[
      'license'
    ];
  if (!options)
    logger.warn(
      'Unable to get license generator options from nx.json - no license will be generated'
    );

  if (!inOperator('license', options)) {
    throw new Error(
      '"license" property not found in nx.json generator options'
    );
  }
  const { license } = options;
  if (typeof license !== 'string' || !isArrayMember(license, licenseOptions)) {
    throw new Error(
      `"license" property in nx.json generator options should be one of: [${licenseOptions.join(
        ','
      )}]`
    );
  }

  let copyrightHolder = '';
  if (license !== 'None' && license !== 'Custom') {
    if (!inOperator('copyrightHolder', options)) {
      throw new Error(
        '"copyrightHolder" property not found in nx.json generator options'
      );
    }

    if (typeof options.copyrightHolder !== 'string') {
      throw new Error(
        '"copyrightHolder" property in nx.json generator options should be a string'
      );
    }

    copyrightHolder = options.copyrightHolder;
  }

  updateLicense(tree, projectRoot, { license, copyrightHolder });
}

export default function generate(tree: Tree, options: Schema) {
  updateLicense(tree, '', options);

  for (const projectConfig of getProjects(tree).values()) {
    updateLicense(tree, projectConfig.root, options);
  }

  return () => {};
}
