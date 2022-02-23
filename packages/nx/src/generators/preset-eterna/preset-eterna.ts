import path from 'path';
import { readFileSync } from 'fs';
import type { Tree } from '@nrwl/devkit';
import generatePreset from '../preset/preset';

const COPYRIGHT_HOLDER = 'Eterna Commons';
const README_PROLOG = `'Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)`;

interface Schema {
  description: string;
  license: 'BSD3' | 'EternaNoncommercial' | 'None';
}

export default async function generate(tree: Tree, options: Schema) {
  await generatePreset(tree, {
    description: options.description,
    license:
      options.license !== 'EternaNoncommercial' ? options.license : 'Custom',
    copyrightHolder: COPYRIGHT_HOLDER,
    readmeProlog: README_PROLOG,
  });

  if (options.license === 'EternaNoncommercial') {
    tree.write(
      'LICENSE',
      readFileSync(path.join(__dirname, 'files/EternaNoncommercial'))
    );
  }
}
