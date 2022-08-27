import {
  getProjects,
  Tree, updateJson,
} from '@nrwl/devkit';
import {
  isRecord, maybeInitObject,
} from 'utils/json';

interface Schema {
  packageName: string;
}

export default async function generate(tree: Tree, options: Schema) {
  const projects = getProjects(tree);
  const project = projects.get(options.packageName);
  if (!project) throw new Error(`Package ${options.packageName} does not exist`);

  // Add to release config
  updateJson(tree, 'release-please-config.json', (json) => {
    if (!isRecord(json)) throw new Error('release-please-config.json format is invalid');
    const packages = maybeInitObject(json, 'packages');
    if (!packages) throw new Error('release-please-config.json format is invalid');
    packages[project.root] = {};
    return json;
  });

  return async () => {};
}
