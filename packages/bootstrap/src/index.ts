#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import spawn from './await-spawn';

async function main() {
  const args = yargs(hideBin(process.argv))
    .command(
      '$0 <project>',
      'Initialize an nx workspace using the eternagame layout preset',
      (y) => y.positional('project', { type: 'string', demandOption: true })
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
    }).argv;

  mkdirSync(args.project);
  writeFileSync(
    join(args.project, 'package.json'),
    JSON.stringify({ name: args.project })
  );
  await spawn('git', ['init'], { cwd: args.project });
  await spawn('npm', ['install', '@eternagame/nx'], { cwd: args.project });

  const options = [
    args.project,
    ...(args.npmScope ? ['--npmScope', args.npmScope] : []),
  ];
  await spawn('npx', ['nx', 'g', '@eternagame/nx:preset', ...options], {
    cwd: args.project,
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
