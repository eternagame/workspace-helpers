#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import spawn from './src/await-spawn';

async function main() {
  const args = await yargs(hideBin(process.argv))
    .command(
      '$0 <name>',
      'Initialize an Nx-managed repository using the eternagame layout preset',
      (y) => y.positional('name', { type: 'string', demandOption: true }),
    )
    .option('eterna', {
      describe:
        'Use defaults intended for packages manged by the Eterna project',
      boolean: true,
      default: false,
    })
    .option('npmScope', {
      describe: 'Npm scope packages should be scoped to/published under',
      type: 'string',
    })
    .option('generator-version', {
      describe: 'Specifies the version of @eternagame/nx-plugin used for repository generation (eg --nx-plugin-version canary for the latest canary)',
      type: 'string',
    })
    .argv;

  mkdirSync(args.name);
  writeFileSync(
    join(args.name, 'package.json'),
    JSON.stringify({ name: args.name }),
  );
  await spawn('git', ['init'], { cwd: args.name });

  const pluginVersion = args.generatorVersion ?? 'latest';
  await spawn('npm', ['install', `@eternagame/nx-plugin@${pluginVersion}`], { cwd: args.name });

  const options = [
    args.name,
    ...(args.eterna ? ['--eternaDefaults'] : []),
    ...(args.npmScope ? ['--npmScope', args.npmScope] : []),
  ];
  await spawn('npx', ['nx', 'g', '@eternagame/nx-plugin:preset', ...options], {
    cwd: args.name,
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
