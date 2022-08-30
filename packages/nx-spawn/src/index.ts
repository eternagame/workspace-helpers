#!/usr/bin/env node
import { workspaceRoot, Workspaces } from '@nrwl/devkit';
import chalk from 'chalk';
import { argv, cwd, exit } from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import TaskOrchestrator from './task-orchestrator';

async function run() {
  // Handle CLI args
  const args = await yargs(hideBin(argv))
    .command(
      '$0 <command>',
      'Run an npm command, taking into account nx dependencies, allowing long-running tasks in dependencies',
      (yargsCommand) => yargsCommand.positional('command', {
        describe: 'command to run',
        type: 'string',
        demandOption: true,
      }),
    )
    .parse();
  const { command } = args;

  // Figure out the package we're running on based on our cwd
  const ws = new Workspaces(workspaceRoot);
  const packageName = ws.calculateDefaultProjectName(
    cwd(),
    ws.readWorkspaceConfiguration(),
  );

  // When the nx task runner prints output from a task to the console, prepend the
  // package it's coming from to the output so that you can tell what output is coming from where
  process.env['NX_PREFIX_OUTPUT'] = 'true';

  // Do the thing!
  await new TaskOrchestrator(command, packageName).run();
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(chalk.redBright(e));
  exit(1);
});
