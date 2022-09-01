import {
  getProjects,
  type Tree,
} from '@nrwl/devkit';
import { setGeneratorDefaults } from '@/utils/wrap-generator';
import { isFullLicenseOptions, LicenseOptions, updateLicense } from '../util';

export default async function generate(tree: Tree, options: LicenseOptions) {
  // When setting up licensing repository-wide, set the values we use as defaults for
  // license-package so that future calls to generate a package will know what license
  // settings to use
  setGeneratorDefaults(tree, 'license-package', {
    license: options.license,
  });
  if (isFullLicenseOptions(options)) {
    setGeneratorDefaults(tree, 'license-package', {
      copyrightHolder: options.copyrightHolder,
    });
  }

  // Update the license in the repo root
  updateLicense(tree, '', options);

  // Update the license for each existing project
  for (const projectConfig of getProjects(tree).values()) {
    // NOTE: We could theoretically use the license-package generator, but it's only doing
    // this, so we'll keep it simple and just call out directly.
    updateLicense(tree, projectConfig.root, options);
  }

  return async () => {};
}
