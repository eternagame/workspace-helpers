import { mkdirSync } from 'fs';
import { join } from 'path';
import { watch } from 'chokidar';
import {
  createProjectGraphAsync,
  readNxJson,
  workspaceRoot,
  type ProjectGraph,
  type Task,
  type TaskGraph,
  getOutputsForTargetAndConfiguration,
} from '@nrwl/devkit';
// This is a bit dodgy, but we need to import stuff not explicitly exported by nx.
// In order for node to resolve them properly, we have to specify the extensions
/* eslint-disable import/extensions */
import { createTaskGraph } from 'nx/src/tasks-runner/create-task-graph.js';
import { ForkedProcessTaskRunner } from 'nx/src/tasks-runner/forked-process-task-runner.js';
import { createRunOneDynamicOutputRenderer } from 'nx/src/tasks-runner/life-cycles/dynamic-run-one-terminal-output-life-cycle.js';
/* eslint-enable import/extensions */
import chalk from 'chalk';
import type { ChildProcess } from 'child_process';
import { exit } from 'process';
import PromiseWalker from './promise-walker';
import treeKill from './tree-kill';

/** The result of the process run for a task */
interface ProcessResult {
  /** Return/status code of the program */
  code: number;
  /** The content that was sent to the terminal */
  terminalOutput: string;
}

/**
 * Information about a process that has been kicked off, but may not be "ready"
 * (ie, written its initial output) yet
 */
interface StartedProcess {
  task: Task;
  process: Promise<ProcessResult>;
}

/**
 * Runs a command in a given package, including dependencies, but only waiting for the initial
 * output of dependencies rather than for them to exit
 */
export default class TaskOrchestrator {
  constructor(
    private readonly _rootCommand: string,
    private readonly _rootPackage: string,
  ) {}

  /** Run the command */
  public async run(): Promise<void> {
    // Make sure our cache directory exists
    mkdirSync(this._cacheDir, { recursive: true });

    // Get metadata about the tasks we're going to run
    const projectGraph = await createProjectGraphAsync();
    const taskGraph = await this.createTaskGraph(projectGraph);
    const tasks: Task[] = Object.values(taskGraph.tasks);

    // The thing that actually starts our tasks
    const runner = await this.createRunner(tasks);

    // Keeping track of the tasks we've spun up so far
    const startedTasks: Task[] = [];
    const readyTasks: Task[] = [];
    const pendingProcesses = new PromiseWalker<StartedProcess>();
    const readyProcesses: Promise<ProcessResult>[] = [];

    while (readyProcesses.length < tasks.length) {
      // For any tasks that are able to start, start them
      const newTasks = this.getAvailableTasks(
        taskGraph.dependencies,
        tasks,
        startedTasks,
        readyTasks,
      );
      // Note that these tasks have started so we don't start them again
      startedTasks.push(...newTasks);
      // Once any of the tasks we've previously started (whether in this iteration or a previous one
      // has started (ie, we've confirmed the output is present), we can note that it has started
      // and check for any new tasks we can start (by continuing to the next iteration of the loop)
      pendingProcesses.add(
        ...newTasks.map((task) => this.startTask(task, runner, projectGraph)),
      );
      // We aren't `await`ing needlessly - we've already batched as much as we can
      // eslint-disable-next-line no-await-in-loop
      const finished = await pendingProcesses.next();
      readyTasks.push(finished.task);
      readyProcesses.push(finished.process);
      // If one of the processes we've started fails, we should bail, because we're no longer
      // running all processes like the user intended
      finished.process
        .then(async (result) => {
          if (result.code > 0) {
            // We're in the process of shutting down our child processes forcefully
            if (this._finished) return;
            this._finished = true;

            /* eslint-enable no-console */
            await this.killRunnerProcesses(runner, 'SIGINT');
            throw new Error(`${finished.task.target.project}:${finished.task.target.target} exited with code ${result.code}. See above for output logs.`);
          } else if (
            finished.task.target.project === this._rootPackage
            && finished.task.target.target === this._rootCommand
          ) {
            // eslint-disable-next-line no-console
            console.info('[nx-spawn] Primary task exited successfully');
            this._finished = true;
            await this.killRunnerProcesses(runner, 'SIGINT');
            exit();
          }
        })
        .catch((reason) => {
          // eslint-disable-next-line no-console
          console.error(chalk.redBright(reason));
          throw new Error(
            `The task runner threw an error while trying to run ${finished.task.target.project}:${finished.task.target.target}`,
          );
        });
    }

    // Block, as we want the processes we've spawned to keep running
    await Promise.all(readyProcesses);
  }

  private async killRunnerProcesses(runner: ForkedProcessTaskRunner, signal: string) {
    // We need to kill all tasks that have been started - see https://github.com/nrwl/nx/issues/11782
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error runner.processes is private, but we need the PIDs
    const processes = (runner.processes as Set<ChildProcess>);
    for (const proc of processes) {
      const { pid } = proc;
      // If pid is undefined, the process failed to start
      // eslint-disable-next-line no-continue
      if (!pid) continue;
      // eslint-disable-next-line no-await-in-loop
      await treeKill(pid, signal);
    }
  }

  /**
   * Create the nx task graph, which holds information on the dependencies of the
   * task we want to run
   *
   * @param projectGraph The Nx project graph for the Nx project we're working with
   * @returns The task graph
   */
  private async createTaskGraph(
    projectGraph: ProjectGraph,
  ): Promise<TaskGraph> {
    // Determine tasks that need to be run
    const defaults = readNxJson().targetDefaults ?? {};
    const targetDeps = Object.fromEntries(
      Object.entries(defaults).map(([target, config]) => [
        target,
        config.dependsOn ?? [],
      ]),
    );
    const taskGraph = createTaskGraph(
      projectGraph,
      targetDeps,
      [this._rootPackage],
      [this._rootCommand],
      undefined,
      { __overrides_unparsed__: [] },
    );

    return taskGraph;
  }

  /**
   * Create the Nx task runner we want to use to run our tasks
   *
   * @param tasks The tasks our task runner will be running
   * @returns The task runner
   */
  private async createRunner(tasks: Task[]): Promise<ForkedProcessTaskRunner> {
    const { lifeCycle } = await createRunOneDynamicOutputRenderer({
      initiatingProject: this._rootPackage,
      tasks,
      args: { target: this._rootCommand },
      overrides: { __overrides_unparsed__: [] },
    });
    return new ForkedProcessTaskRunner({ lifeCycle });
  }

  /**
   * Get the next set of tasks that are ready to be run (ie, their dependencies have been marked
   * as completed)
   *
   * @param dependencies Via the task graph, a map of task IDs to the task IDs of its dependencies
   * @param tasks The complete list of tasks to run
   * @param started Tasks that have already been kicked off, but may or may not be ready
   * @param ready Tasks that are to be considered completed
   * @returns
   */
  private getAvailableTasks(
    dependencies: Record<string, string[]>,
    tasks: Task[],
    started: Task[],
    ready: Task[],
  ): Task[] {
    const newTasks: Task[] = [];
    for (const candidate of tasks) {
      // If all dependencies are done and we're not already running or completed, it's good to start
      if (
        dependencies[candidate.id]?.every((depId) => ready.some((task) => task.id === depId))
        && !started.some((task) => task.id === candidate.id)
        && !ready.some((task) => task.id === candidate.id)
      ) {
        newTasks.push(candidate);
      }
    }
    return newTasks;
  }

  /**
   * Use the task runner to execute a task
   *
   * @param task The task to run
   * @param runner The Nx task runner to run the task
   * @param projectGraph The Nx project graph for the Nx project we're working with
   * @returns Information about the task that has been started up
   */
  private async startTask(
    task: Task,
    runner: ForkedProcessTaskRunner,
    projectGraph: ProjectGraph,
  ): Promise<StartedProcess> {
    // Start the task
    const process = runner.forkProcessPipeOutputCapture(task, {
      temporaryOutputPath: this.temporaryOutputPath(task),
      streamOutput: true,
    });

    // Spin up a chokidar watcher to notify us when the output files for the task are written
    const node = projectGraph.nodes[task.target.project];
    if (!node) throw new Error(`Can't find node for ${task.target.project}`);
    const outputs = getOutputsForTargetAndConfiguration(task, node);
    const watcher = watch(outputs, {
      cwd: workspaceRoot,
      ignoreInitial: false,
    });

    if (this.isLongRunningTask(task)) {
      // Assuming the task has outputs, make sure the task has written the outputs at least once
      // before moving on and starting subsequent tasks
      await Promise.all(
        outputs.map(
          (f) => new Promise<void>((resolve) => {
            watcher.on('add', (path) => {
              if (path.startsWith(f)) resolve();
            });
          }),
        ),
      );
    } else {
      // Wait for the task to exit
      await process;
    }

    return {
      task,
      process,
    };
  }

  private isLongRunningTask(task: Task) {
    return (
      (
        !!(task.overrides as Record<string, unknown>)['watch']
        && (task.overrides as Record<string, unknown>)['watch'] !== 'false'
      )
      || task.target.target.endsWith(':watch')
      || task.target.target.endsWith('-watch')
      || task.target.target === 'serve'
      || task.target.target === 'dev'
      || task.target.target === 'start');
  }

  /**
   * Determine the temporary where the task runner should put command output
   *
   * @param task The task for which command output is to be stored
   * @returns The
   */
  private temporaryOutputPath(task: Task) {
    // Note that : is an invalid character in paths on Windows
    return join(this._cacheDir, task.id.replace(':', '__'));
  }

  private _cacheDir = join(
    workspaceRoot,
    'node_modules',
    '.cache',
    'nx-spawn',
    'terminal-outputs',
  );

  private _finished = false;
}
