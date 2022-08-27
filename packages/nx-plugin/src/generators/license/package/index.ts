import {
  getProjects,
  type Tree,
} from '@nrwl/devkit';
import { LicenseOptions, updateLicense } from '../util';

type Schema = LicenseOptions & {
  packageName: string;
};

export default async function generate(tree: Tree, options: Schema) {
  // NOTE: For simplicity, license/core does not use this generator and calls updateLicense
  // directly. In the future if this generator does anything beyond shell out to updateLicense,
  // we should update license/core to use this instead

  const projects = getProjects(tree);
  const project = projects.get(options.packageName);
  if (!project) throw new Error(`Package ${options.packageName} does not exist`);

  updateLicense(tree, project.root, options);

  return async () => {};
}
