import { execFile } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const DIRNAME = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

/**
 * Kill a process and its children
 *
 * @param pid Process ID to signal
 * @param signal Signal to send to the process (*nix only)
 *
 * Adapted from https://github.com/vuejs/vue-cli/blob/e63681735f01e5f22f0791251683c8418aa2aa8e/packages/@vue/cli-ui/apollo-server/util/terminate.js
 */
export default async function treeKill(
  pid: number,
  signal: number | string,
) {
  const isWindows = process.platform === 'win32';
  const isMacintosh = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  if (isWindows) {
    await promisify(execFile)('taskkill', ['/T', '/F', '/PID', pid.toString()]);
  } else if (isLinux || isMacintosh) {
    const cmd = resolve(DIRNAME, './tree-kill.sh');
    await promisify(execFile)(cmd, [pid.toString(), signal.toString()], {});
  } else {
    process.kill(pid, signal);
  }
}
