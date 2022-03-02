import {
  addDependenciesToPackageJson,
  generateFiles,
  getProjects,
  installPackagesTask,
  offsetFromRoot,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import path from 'path';
import { getDependencyVersions } from '../../utils/dependencies';

interface Schema {
  license: 'MIT' | 'BSD3' | 'Custom' | 'None';
  copyrightHolder: string;
}

export function updateProjectForLicense(
  tree: Tree,
  projectRoot: string,
  license: string | null
) {
  if (license) {
    addDependenciesToPackageJson(tree, {}, getDependencyVersions(['shx']));
  }

  /* eslint-disable no-param-reassign */
  updateJson(
    tree,
    path.join(projectRoot, 'package.json'),
    (json: Record<string, unknown>) => {
      if (license) json['license'] = license;
      else delete json['license'];

      if (license) {
        if (!json['scripts']) json['scripts'] = {};
        const scripts = json['scripts'] as Record<string, string>;
        // Before publishing, copy the license at the root of the workspace to this directory
        if (!scripts['prepublishOnly']) {
          scripts['prepublishOnly'] = `shx cp ${offsetFromRoot(
            projectRoot
          )}LICENSE .`;
        } else if (
          !scripts['prepublishOnly'].match(/shx cp (\.\.\/)+LICENSE \.( &&)?/)
        ) {
          scripts['prepublishOnly'] = `shx cp ${offsetFromRoot(
            projectRoot
          )}LICENSE . && ${scripts['prepublishOnly']}`;
        }
        // Once publishing finishes, clean up
        if (!scripts['postpublish']) {
          scripts['postpublish'] = 'shx rm LICENSE';
        } else if (!scripts['postpublish'].match(/shx rm LICENSE( &&)?/)) {
          scripts[
            'postpublish'
          ] = `shx rm LICENSE && ${scripts['postpublish']}`;
        }
      } else if (json['scripts']) {
        const scripts = json['scripts'] as Record<string, string>;
        // Ensure no license handling is present, since we have no license. We assume that this command
        // may be at the start of multiple commands chained with &&
        if (scripts['prepublishOnly']) {
          const newPrepublish = scripts['prepublishOnly']
            .replace(/shx cp (\.\.\/)+LICENSE \.( &&)?/, '')
            .trim();
          if (newPrepublish) scripts['prepublishOnly'] = newPrepublish;
          else delete scripts['prepublishOnly'];
        }
        if (scripts['postpublish']) {
          const newPostpublish = scripts['postpublish']
            .replace(/shx rm LICENSE( &&)?/, '')
            .trim();
          if (newPostpublish) scripts['postpublish'] = newPostpublish;
          else delete scripts['postpublish'];
        }
      }

      return json;
    }
  );
  /* eslint-enable no-param-reassign */
}

function getPackageLicense(license: Schema['license']) {
  switch (license) {
    case 'None':
      return null;
    case 'Custom':
      return 'SEE LICENSE IN LICENSE';
    case 'BSD3':
      return 'BSD-3-Clause';
    case 'MIT':
      return 'MIT';
  }
}

export default function generate(tree: Tree, options: Schema) {
  const templateOptions = {
    ...options,
    copyrightYear: new Date().getFullYear(),
    tmpl: '',
  };
  if (options.license !== 'None') {
    generateFiles(tree, path.join(__dirname, 'files'), '', templateOptions);
  }

  const packageLicense = getPackageLicense(options.license);

  /* eslint-disable no-param-reassign */
  updateJson(tree, 'package.json', (json: Record<string, unknown>) => {
    if (packageLicense) json['license'] = packageLicense;
    else delete json['license'];

    return json;
  });
  /* eslint-enable no-param-reassign */

  for (const projectConfig of getProjects(tree).values()) {
    updateProjectForLicense(tree, projectConfig.root, packageLicense);
  }

  return () => {
    installPackagesTask(tree);
  };
}
