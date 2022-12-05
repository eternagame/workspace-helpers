import {
  detectPackageManager,
  generateFiles,
  GeneratorCallback,
  getPackageManagerCommand,
  joinPathFragments,
  readJson,
  updateJson,
  type Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { join } from 'path';
import { execSync } from 'child_process';
import {
  inOperator, isArrayMember, isRecord, maybeInitObject,
} from '@/utils/json';
import { getGeneratorDefaults } from '@/utils/wrap-generator';
import { getLicenseDefaults } from '../../license/util';
import generateReleasePackage from '../../release/package';
import generateLicensePackage from '../../license/package';
import getPackageNames from '@/utils/names';

const publishOptions = ['private', 'restricted', 'public'] as const;
type PublishOption = typeof publishOptions[number];

interface Schema {
  name: string;
  description: string;
  publish?: PublishOption;
  directory?: string;
  license?: string;
  copyrightHolder?: string;
}

interface NormalizedSchema extends Schema {
  publish:PublishOption;
  importPath: string;
  directory: string;
}

function getPublish(tree: Tree, override?: NormalizedSchema['publish']): NormalizedSchema['publish'] {
  if (override) return override;
  const defaults = getGeneratorDefaults(tree, 'package');
  if (!defaults || !defaults['publish']) {
    throw new Error('Publish property is required in generator defaults for package in nx.json');
  }
  const { publish } = defaults;
  if (!isArrayMember(publish, publishOptions)) {
    throw new Error(`License property in generator defaults for license-package in nx.json must be one of: [${publishOptions.join(',')}]`);
  }

  return publish;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const packageNames = getPackageNames(tree, options);

  const publish = getPublish(tree, options.publish);

  return {
    ...options,
    ...packageNames,
    publish,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.directory,
    templateOptions,
  );
}

/**
 * Parses the npm `repository` field, turning the string shorthand into the full format
 * so that we can add the directory field
 *
 * See https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository and
 * https://docs.npmjs.com/cli/v8/commands/npm-install#description
 *
 * @param originalRepoInfo
 */
function parseRepoInfo(originalRepoInfo: unknown) {
  if (inOperator('url', originalRepoInfo) && inOperator('type', originalRepoInfo)) return originalRepoInfo;
  if (typeof originalRepoInfo === 'string') {
    let url = originalRepoInfo
      .replace('github:', 'https://github.com/')
      .replace('gist:', 'https://gist.github.com/')
      .replace('bitbucket:', 'https://bitbucket.org/')
      .replace('gitlab:', 'https://gitlab.com/');

    // If no prefix is present, it defaults to github
    if (!url.startsWith('https')) url = `https://github.com/${url}`;

    url += '.git';

    return {
      type: 'git',
      url,
    };
  }

  throw new Error('Unable to parse repository field of root package.json');
}

function addPackageInfoFields(tree: Tree, options: NormalizedSchema) {
  const rootPackage: unknown = readJson(tree, 'package.json');
  updateJson(tree, join(options.directory, 'package.json'), (packagePackage: unknown) => {
    if (typeof packagePackage !== 'object') throw new Error(`Unable to parse ${options.directory}/package.json`);
    return {
      ...packagePackage,
      ...(inOperator('author', rootPackage) ? { author: rootPackage.author } : {}),
      ...(inOperator('homepage', rootPackage) ? { homepage: rootPackage.homepage } : {}),
      ...(inOperator('bugs', rootPackage) ? { bugs: rootPackage.bugs } : {}),
      ...(inOperator('funding', rootPackage) ? { funding: rootPackage.funding } : {}),
      ...(inOperator('repository', rootPackage) ? { repository: { ...parseRepoInfo(rootPackage.repository), directory: options.directory } } : {}),
    };
  });
}

function setupPublishing(tree: Tree, options: NormalizedSchema) {
  /* eslint-disable no-param-reassign */
  if (options.publish !== 'private') {
    // Set properties in package.json necessary for publishing
    updateJson(tree, joinPathFragments(options.directory, 'package.json'), (json) => {
      if (!isRecord(json)) throw new Error('package.json format is invalid');
      const scripts = maybeInitObject(json, 'scripts');
      if (!scripts) throw new Error('package.json format is invalid');

      json['publishConfig'] = { access: options.publish };
      json['files'] = ['dist'];

      return json;
    });
  } else {
    // This package shouldn't be published, so mark as private
    updateJson(tree, joinPathFragments(options.directory, 'package.json'), (json) => {
      if (!isRecord(json)) throw new Error('package.json format is invalid');

      return {
        private: true,
        ...json,
      };
    });
  }
  /* eslint-enable no-param-reassign */
}

export default async function generate(tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  addPackageInfoFields(tree, normalizedOptions);

  const finalizeTasks: GeneratorCallback[] = [];

  const licenseDefaults = getLicenseDefaults(tree);
  if (licenseDefaults) {
    finalizeTasks.push(await generateLicensePackage(tree, {
      ...licenseDefaults,
      packageName: normalizedOptions.name,
    }));
  }

  setupPublishing(tree, normalizedOptions);

  if (getGeneratorDefaults(tree, 'release-package')) {
    finalizeTasks.push(await generateReleasePackage(tree, { packageName: normalizedOptions.name }));
  }

  return async () => {
    const pmc = getPackageManagerCommand(detectPackageManager());
    // In order for possible future calls to `npm install -w` to work, we need to make sure
    // this new package is registered in our package-lock.json
    execSync(`${pmc.install} --package-lock-only`, {
      cwd: tree.root,
      stdio: [0, 1, 2],
    });

    for (const finalize of finalizeTasks) {
      // Don't parallelize to avoid potential race conditions
      // eslint-disable-next-line no-await-in-loop
      await finalize();
    }
  };
}
