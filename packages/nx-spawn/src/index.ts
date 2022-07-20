#!/usr/bin/env node
import { exit, cwd, argv } from 'process';
import { join } from 'path';
import {
  createProjectGraphAsync,
  workspaceRoot,
  type ProjectGraph,
} from '@nrwl/devkit';
/* eslint-disable import/extensions */
import { Workspaces } from 'nx/src/config/workspaces.js';
/* eslint-enable import/extensions */
import concurrently from 'concurrently';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface CommandInfo {
  packageName: string;
  cwd: string;
}

function computeDepCommands(
  projectGraph: ProjectGraph,
  parentPackage: string,
  command: string
): CommandInfo[] {
  const deps = projectGraph.dependencies[parentPackage];
  if (!deps) return [];
  return (
    deps
      // A dependency may or may not be one of our packages - if it is, projectGraph.nodes will include it
      .filter((dep) => Object.keys(projectGraph.nodes).includes(dep.target))
      .map((dep) => {
        const data = projectGraph.nodes[dep.target]?.data as unknown;
        if (typeof data !== 'object' || data === null)
          throw new Error('Unable to determine dependency directory');
        const { root } = data as Record<string, unknown>;
        if (!root || typeof root !== 'string')
          throw new Error(`Root directory for ${dep.target} not found`);
        const resolvedRoot = join(workspaceRoot, root);

        return [
          ...computeDepCommands(projectGraph, dep.target, command),
          {
            packageName: dep.target,
            cwd: resolvedRoot,
          },
        ];
      })
      .flat()
  );
}

async function run() {
  const args = yargs(hideBin(argv))
    .command(
      '$0 <command>',
      'Run a command for all dependencies of a given package',
      (yargsCommand) =>
        yargsCommand
          .positional('command', {
            describe: 'command to run for all dependencies',
            type: 'string',
          })
          .options({
            noRoot: {
              default: false,
              type: 'boolean',
              describe:
                "If true, don't run the command for the current package, only its dependencies",
            },
            extraRootCommand: {
              default: '',
              type: 'string',
              describe:
                'If present, run this additional command concurrently in the context of the current package',
            },
          })
    )
    .parse();
  // Yargs does ensure it's not undefined, but for some reason the types don't reflect that
  const command = args.command as string;

  const ws = new Workspaces(workspaceRoot);
  const packageToRun = ws.calculateDefaultProjectName(
    cwd(),
    ws.readWorkspaceConfiguration()
  );
  const projectGraph = await createProjectGraphAsync();
  const depCommands = computeDepCommands(projectGraph, packageToRun, command);

  await concurrently(
    [
      ...(args.extraRootCommand
        ? [{ name: packageToRun, command: args.extraRootCommand }]
        : []),
      ...(!args.noRoot ? [{ name: packageToRun, command }] : []),
      ...depCommands.map((dep) => ({
        name: dep.packageName,
        command,
        cwd: dep.cwd,
      })),
    ],
    { prefixColors: ['cyan'] }
  ).result;
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  exit(1);
});
