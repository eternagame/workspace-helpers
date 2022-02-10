import { Tree } from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import { newGenerator } from '@nrwl/workspace/src/generators/new/new';
import { Preset } from '@nrwl/workspace/src/generators/utils/presets';
import { Linter } from '@nrwl/workspace/src/utils/lint';
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
      linter: Linter.EsLint,
      defaultBase: 'main',
      name: 'my-workspace',
      directory: '.',
      npmScope: 'npmScope',
      appName: 'app',
    });
  });

  it('should work', async () => {
    await generate(tree, {});
  });
});
