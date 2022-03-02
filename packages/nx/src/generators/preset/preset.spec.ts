import type { Tree } from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import { newGenerator } from '@nrwl/workspace/src/generators/new/new';
import { Preset } from '@nrwl/workspace/src/generators/utils/presets';
import { join } from 'path';
import generate from './preset';

describe('preset', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTree();
    // As part of our generation we need to introspect the workspace, which requires getting the nx.json,.
    // Nx grabs the preset given to the "extends" keyword via require.resolve, so while we will never
    // write to the actual file system with this tree, it does need to be "mounted" in a location where
    // the require.resolve can find our preset
    tree.root = join(__dirname, './virtual');
    await newGenerator(tree, {
      cli: 'nx',
      preset: Preset.Apps,
      skipInstall: false,
      skipGit: false,
      linter: 'eslint',
      defaultBase: 'main',
      name: 'my-workspace',
      directory: '.',
      npmScope: 'npmScope',
      appName: 'app',
    });
  });

  it('should work', async () => {
    await generate(tree, {
      copyrightHolder: 'Eterna Commons',
      description: 'My cool workspace',
      license: 'BSD3',
      readmeProlog: '',
    });
  });
});
