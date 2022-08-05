import path from 'path';
import fs from 'fs';

/**
 * Determines whether or not a package.json exists in some parent directory of a directory
 *
 * @param dir The directory to start searching from (this directory is not checked, only its parents)
 * @returns Paths to parent directories that contain package.json files
 */
export default function findPkgUp(dir: string): string[] {
  const { root } = path.parse(dir);
  let searchDir = path.dirname(dir);
  const dirs: string[] = [];
  while (searchDir !== root) {
    if (fs.existsSync(path.join(searchDir, 'package.json'))) {
      dirs.push(searchDir);
    }
    searchDir = path.dirname(searchDir);
  }
  return dirs;
}
