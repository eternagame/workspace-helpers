import {
  generateFiles, getProjects, joinPathFragments, logger, readJson, Tree, updateJson, writeJson,
} from '@nrwl/devkit';
import { join } from 'path';
import { installDevDependencies } from 'utils/dependencies';
import {
  getValue, isArrayMember, isRecord, maybeInitObject,
} from 'utils/json';

const publishingOptions = [
  'no-publish',
  'default-private',
  'default-publish',
] as const;

interface Schema {
  publishing: typeof publishingOptions[number];
}

function addFiles(tree: Tree, options: Schema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, 'files'), '', templateOptions);
}

function setupRelease(tree: Tree, root: string, options: Schema) {
  updateJson(tree, 'release-please-config.json', (json) => {
    if (!isRecord(json)) throw new Error('release-please-config.json format is invalid');
    const packages = maybeInitObject(json, 'packages');
    if (!packages) throw new Error('release-please-config.json format is invalid');
    packages[root] = {};
    return json;
  });

  /* eslint-disable no-param-reassign */
  if (options.publishing === 'default-publish') {
    updateJson(tree, joinPathFragments(root, 'package.json'), (json) => {
      if (!isRecord(json)) throw new Error('package.json format is invalid');
      const scripts = maybeInitObject(json, 'scripts');
      if (!scripts) throw new Error('package.json format is invalid');
      scripts['prepublishOnly'] = 'nx build';
      json['files'] = ['dist'];
      json['publishConfig'] = {
        access: 'public',
      };
      return json;
    });
  } else {
    updateJson(tree, joinPathFragments(root, 'package.json'), (json) => {
      if (!isRecord(json)) throw new Error('package.json format is invalid');
      return {
        private: true,
        ...json,
      };
    });
  }
  /* eslint-enable no-param-reassign */
}

export function setupReleaseForPackage(tree: Tree, projectRoot: string) {
  const nxJson: unknown = readJson(tree, 'nx.json');
  const options = getValue(nxJson, null, 'generators', '@eternagame/nx-plugin:release')
    || getValue(nxJson, null, 'generators', '@eternagame/nx-plugin', 'release');
  if (!isRecord(options)) {
    logger.info('Unable to get release generator defaults from nx.json - assuming no release setup is desired');
    return;
  }

  const publishing = getValue(options, null, 'publishing');
  if (!publishing) {
    throw new Error('"publishing" property missing from @eternagame/nx-plugin:release generator defaults in nx.json');
  } else if (typeof publishing !== 'string' || !isArrayMember(publishing, publishingOptions)) {
    throw new Error(`"publishing" property for @eternagame/nx-plugin:release generator defaults in nx.json should be one of: [${publishingOptions.join(',')}]`);
  }

  setupRelease(tree, projectRoot, { publishing });
}

export default async function generate(tree: Tree, options: Schema) {
  addFiles(tree, options);
  updateJson(tree, 'nx.json', (json: Record<string, unknown>) => {
    const generators = maybeInitObject(json, 'generators');
    if (!generators) throw new Error('nx.json generators property is invalid');
    const pluginDefaults = getValue(generators, null, '@eternagame/nx-plugin');
    const releaseDefaults = isRecord(pluginDefaults)
      ? maybeInitObject(pluginDefaults, 'release')
      : maybeInitObject(generators, '@eternagame/nx-plugin:release');
    if (!releaseDefaults) {
      throw new Error('Generator defaults for @eternagame/nx-plugin:release in nx.json is invalid');
    }
    releaseDefaults['publishing'] = options.publishing;

    return json;
  });

  if (options.publishing !== 'no-publish') {
    writeJson(tree, 'lerna.json', {
      $schema: 'node_modules/lerna/schemas/lerna-schema.json',
      useNx: true,
      useWorkspaces: true,
      version: 'independent',
      canary: true,
      preid: 'dev',
      preDistTag: 'canary',
    });
  }

  for (const projectConfig of getProjects(tree).values()) {
    setupRelease(tree, projectConfig.root, options);
  }

  return () => {
    if (options.publishing !== 'no-publish') {
      installDevDependencies(tree, ['lerna']);
    }
  };
}
