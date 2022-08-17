import {
  generateFiles,
  getProjects,
  logger,
  readNxJson,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import path from 'path';
import {
  getValue, isArrayMember, isRecord, maybeInitObject,
} from '../../utils/json';

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
    (json: Record<string, unknown>) => ({ ...json, license }),
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
  const nxJson = readNxJson();
  const options = getValue(nxJson, null, 'generators', '@eternagame/nx-plugin:license')
    || getValue(nxJson, null, 'generators', '@eternagame/nx-plugin', 'license');
  if (!isRecord(options)) {
    logger.info('Unable to get license generator defaults from nx.json - no license will be generated');
    return;
  }

  const license = getValue(options, null, 'license');
  if (!license) {
    throw new Error('"license" property missing from @eternagame/nx-plugin:license generator defaults in nx.json');
  } else if (typeof license !== 'string' || !isArrayMember(license, licenseOptions)) {
    throw new Error(`"license" property for @eternagame/nx-plugin:license generator defaults in nx.json should be one of: [${licenseOptions.join(',')}]`);
  }

  let copyrightHolder = '';
  if (license !== 'None' && license !== 'Custom') {
    const defaultCopyrightHolder = getValue(options, null, 'copyrightHolder');

    if (!defaultCopyrightHolder) {
      throw new Error('"copyrightHolder" property missing from @eternagame/nx-plugin:license generator defaults in nx.json');
    } else if (typeof defaultCopyrightHolder !== 'string') {
      throw new Error('"copyrightHolder" property for @eternagame/nx-plugin:license generator defaults in nx.json should be a string');
    }

    copyrightHolder = defaultCopyrightHolder;
  }

  updateLicense(tree, projectRoot, { license, copyrightHolder });
}

export default function generate(tree: Tree, options: Schema) {
  updateJson(tree, 'nx.json', (json: Record<string, unknown>) => {
    const generators = maybeInitObject(json, 'generators');
    if (!generators) throw new Error('nx.json generators property is invalid');
    const pluginDefaults = getValue(generators, null, '@eternagame/nx-plugin');
    const licenseDefaults = isRecord(pluginDefaults)
      ? maybeInitObject(pluginDefaults, 'license')
      : maybeInitObject(generators, '@eternagame/nx-plugin:license');
    if (!licenseDefaults) {
      throw new Error('Generator defaults for @eternagame/nx-plugin:license in nx.json is invalid');
    }
    licenseDefaults['license'] = options.license;
    licenseDefaults['copyrightHolder'] = options.copyrightHolder;

    return json;
  });

  updateLicense(tree, '', options);

  for (const projectConfig of getProjects(tree).values()) {
    updateLicense(tree, projectConfig.root, options);
  }

  return () => {};
}
