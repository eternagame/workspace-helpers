import { generateFiles, Tree, updateJson } from '@nrwl/devkit';
import { join } from 'path';
import { getValue, isArrayMember } from 'utils/json';
import { getGeneratorDefaults } from 'utils/wrap-generator';

/** Supported licenses */
export const licenses = [
  'MIT',
  'BSD3',
  'EternaNoncommercial',
  'Custom',
  'None',
] as const;

/** Supported licenses */
export type License = typeof licenses[number];

/** Information required to generate a license when an actual license is specified */
export type FullLicenseOptions = {
  license: Exclude<License, 'None' | 'Custom'>;
  copyrightHolder: string;
};

/** Information required to generate license information */
export type LicenseOptions = {
  license: 'None' | 'Custom';
} | FullLicenseOptions;

export function isFullLicenseOptions(options: LicenseOptions): options is FullLicenseOptions {
  return options.license !== 'None' && options.license !== 'Custom';
}

/**
 * Convert license option to format appropriate for package.json
 *
 * @param license License from generator options
 * @returns SPDX license specifier (or direction to see license file)
 */
function getPackageJsonLicense(license: License) {
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

/**
 * Update the license property of the package.json and generate a license file in the specified
 * directory
 *
 * @param tree Nx FS tree
 * @param root Directory to update package.json and license file in
 * @param licenseOptions Parameters for license generation
 */
export function updateLicense(tree: Tree, root: string, licenseOptions: LicenseOptions) {
  const license = getPackageJsonLicense(licenseOptions.license);
  updateJson(
    tree,
    join(root, 'package.json'),
    // Remember that if we're setting license to 'None', the license field should still be set
    // to UNLICENSED
    (json: Record<string, unknown>) => ({ ...json, license }),
  );

  if (licenseOptions.license !== 'None' && licenseOptions.license !== 'Custom') {
    const templateOptions = {
      ...licenseOptions,
      copyrightYear: new Date().getFullYear(),
      tmpl: '',
    };
    generateFiles(tree, join(__dirname, 'files'), root, templateOptions);
  }
}

/**
 * Get default values for license-package and validate them
 *
 * @param tree Nx FS tree
 * @returns Validated options if license options if defaults are available or null if no defaults
 *  are specified
 */
export function getLicenseDefaults(tree: Tree): LicenseOptions | null {
  const licenseDefaults = getGeneratorDefaults(tree, 'license-package');
  if (!licenseDefaults) return null;

  const license = getValue(licenseDefaults, null, 'license');
  const copyrightHolder = getValue(licenseDefaults, null, 'copyrightHolder');
  if (!license) {
    throw new Error('License property is required in generator defaults for license-package in nx.json');
  }
  if (typeof license !== 'string' || !isArrayMember(license, licenses)) {
    throw new Error(`License property in generator defaults for license-package in nx.json must be one of: [${licenses.join(',')}]`);
  }
  if (typeof copyrightHolder !== 'string') {
    throw new Error('Copyright holder property in defaults for license-package in nx.json must be a string');
  }
  if (license !== 'None' && license !== 'Custom' && (!copyrightHolder)) {
    throw new Error('Copyright holder property in defaults for license-package in nx.json must be specified');
  }

  return { license, copyrightHolder };
}
