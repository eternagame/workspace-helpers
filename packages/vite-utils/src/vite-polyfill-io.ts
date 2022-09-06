import type { Plugin, IndexHtmlTransformContext, IndexHtmlTransformResult } from 'vite';
import babel from '@babel/core';
import jsFeaturesAnalyser from '@financial-times/js-features-analyser/src/index.js';
import generatePolyfillURL, { TYPE_NOTHING, TYPE_URL } from 'create-polyfill-service-url/src/index.js';
import { join } from 'path';
import { tmpdir } from 'os';
import type { OutputChunk } from 'rollup';
import { mkdtemp, readFile } from 'fs/promises';
import browserslist from 'browserslist';

export default function polyfillIoPlugin(browserTargets: string | string[]) {
  const plugin: Plugin = {
    name: 'vite-plugin-polyfill-io',
    apply: 'build',

    async transformIndexHtml(
      html: string,
      ctx: IndexHtmlTransformContext,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): Promise<IndexHtmlTransformResult | void> {
      if (!ctx.bundle) return;
      // Adapted from https://github.com/Financial-Times/polyfill-service-url-builder/blob/master/index.js
      const tmpFolder = await mkdtemp(join(tmpdir(), 'js-features-analyser'));
      const analyserOutput = join(tmpFolder, 'features.json');
      const browsers = browserslist(browserTargets);

      const features = Object.values(ctx.bundle)
        .filter((output): output is OutputChunk => output.type === 'chunk').map(
          async (chunk) => {
            babel.transformSync(chunk.code, {
              plugins: [
                [
                  jsFeaturesAnalyser,
                  {
                    outputDestination: analyserOutput,
                  },
                ],
              ],
              filename: chunk.fileName,
              ast: false,
              code: false,
            });
            return JSON.parse(await readFile(analyserOutput, 'utf-8')) as string[];
          },
        );
      const uniqueFeatures = [...new Set((await Promise.all(features)).flat())];
      const result = await generatePolyfillURL(uniqueFeatures, browsers);
      if (result.type === TYPE_NOTHING) {
        // Supported browsers support all required features, no need for polyfill
      } else if (result.type === TYPE_URL) {
        return [{
          tag: 'script',
          attrs: { src: result.message },
          injectTo: 'body',
        }];
      }
    },
  };

  return plugin;
}
