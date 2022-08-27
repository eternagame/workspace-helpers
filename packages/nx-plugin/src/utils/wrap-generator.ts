import {
  Tree, updateJson, readJson,
} from '@nrwl/devkit';
import { getValue, isRecord, maybeInitObject } from './json';

export function setGeneratorDefaults(
  tree: Tree,
  generator: string,
  newDefaults: Record<string, unknown>,
) {
  updateJson(tree, 'nx.json', (json: Record<string, unknown>) => {
    // Get current or initialize generator defaults in nx.json
    const generators = maybeInitObject(json, 'generators');
    if (!generators) throw new Error('nx.json generators property is invalid');

    // Get current or initialize generator defaults for the passed generator in nx.json
    // Note that you can set defaults both like {"<plugin>:<generator>": {}} or
    // {"<plugin>": {"<generator>"": {}}}. If the latter setup is already present, we'll use that,
    // otherwise we'll use (or set up, if it doesn't exist) the former.
    const pluginDefaults = getValue(generators, null, '@eternagame/nx-plugin');
    const defaults = isRecord(pluginDefaults)
      ? maybeInitObject(pluginDefaults, generator)
      : maybeInitObject(generators, `@eternagame/nx-plugin:${generator}`);
    if (!defaults) {
      throw new Error(`Generator defaults for @eternagame/nx-plugin:${generator} in nx.json is invalid`);
    }

    // Note this is mutating the original object that was passed in and is being returned
    for (const [key, value] of Object.entries(newDefaults)) {
      defaults[key] = value;
    }

    return json;
  });
}

export function getGeneratorDefaults(tree: Tree, generator: string) {
  const nxJson: unknown = readJson(tree, 'nx.json');
  const options = getValue(nxJson, null, 'generators', `@eternagame/nx-plugin:${generator}`)
    || getValue(nxJson, null, 'generators', '@eternagame/nx-plugin', generator);
  if (!isRecord(options)) {
    return null;
  }
  return options;
}
