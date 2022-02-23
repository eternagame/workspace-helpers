import type { Tree } from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import { newGenerator } from '@nrwl/workspace/src/generators/new/new';
import { Preset } from '@nrwl/workspace/src/generators/utils/presets';
import generate from './preset';

describe('preset', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTree();
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
