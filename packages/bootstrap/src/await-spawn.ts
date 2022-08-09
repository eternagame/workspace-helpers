import { spawn, type SpawnOptions } from 'child_process';

export default function spawnAsync(
  command: string,
  args: string[],
  options: SpawnOptions,
) {
  const child = spawn(command, args, { ...options, stdio: 'inherit' });
  const promise = new Promise<void>((resolve, reject) => {
    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        const err = new Error(`child exited with code ${code ?? 'null'}`);
        reject(err);
      }
    });
  });

  return promise;
}
