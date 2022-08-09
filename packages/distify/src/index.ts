#!/usr/bin/env node
import fg from 'fast-glob';
import { copyFile, mkdir, readFile } from 'fs/promises';
import { dirname, join, basename } from 'path';
import { exit } from 'process';

async function getConfig() {
  const config = JSON.parse(
    await readFile('distify.config.json', 'utf-8'),
  ) as Record<string, unknown>;
  const { sourceGlobs, outputPath, sourceRoot } = config;

  if (
    !Array.isArray(sourceGlobs)
    || !sourceGlobs.every((glob): glob is string => typeof glob === 'string')
  ) {
    throw new Error(
      'Invalid configuration: sourceGlobs must be an array of strings',
    );
  }

  if (typeof outputPath !== 'string') {
    throw new Error('Invalid configuration: outputPath must be a string');
  }

  if (sourceRoot !== undefined && typeof sourceRoot !== 'string') {
    throw new Error(
      'Invalid configuration: sourceRoot must be a string if present',
    );
  }

  return {
    sourceGlobs,
    outputPath,
    sourceRoot: sourceRoot ?? '',
  };
}

async function run() {
  const config = await getConfig();

  const files = await fg(config.sourceGlobs, {
    dot: true,
    cwd: join(process.cwd(), config.sourceRoot),
  });
  await Promise.all(
    files.map(async (file) => {
      const newDir = join(config.outputPath, dirname(file));
      await mkdir(newDir, { recursive: true });
      await copyFile(
        join(config.sourceRoot, file),
        join(newDir, basename(file)),
      );
    }),
  );
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  exit(1);
});
