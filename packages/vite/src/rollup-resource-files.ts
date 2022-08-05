import type { Plugin } from 'vite';
import fg from 'fast-glob';
import { basename, dirname, join } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default function resourcePlugin(options: {
  sourceRoot: string;
  sourceGlobs: string[];
}) {
  const plugin: Plugin = {
    name: 'rollup-plugin-resource-files',
    async generateBundle(outputOptions) {
      const outDir = outputOptions.dir;
      if (!outDir)
        throw new Error(
          'Unable to copy resource files to output directory since the output directory is not specified'
        );

      const files = await fg(options.sourceGlobs, {
        dot: true,
        cwd: join(process.cwd(), options.sourceRoot),
      });

      for (const file of files) {
        const newDir = join(outDir, dirname(file));
        mkdirSync(newDir, { recursive: true });
        copyFileSync(
          join(options.sourceRoot, file),
          join(newDir, basename(file))
        );
      }
    },
  };

  return plugin;
}
