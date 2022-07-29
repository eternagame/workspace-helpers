import { readFileSync } from 'fs';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import pluginLegacy from '@vitejs/plugin-legacy';
import typescriptPlugin from 'rollup-plugin-typescript2';
import preserveShebangs from './rollup-preserve-shebangs';

function getAllDeps() {
  // Extract `dependencies` field from package.json
  const pkg = JSON.parse(
    readFileSync('package.json', { encoding: 'utf-8' })
  ) as Record<string, unknown>;
  const deps =
    pkg['dependencies'] && typeof pkg['dependencies'] === 'object'
      ? pkg['dependencies']
      : {};
  // We want to match `<packagename>/*` not just `<packagename>`, or else when we deep import,
  // the deep imports will be bundled
  const res = Object.keys(deps).map((dep) => new RegExp(`^${dep}(/.*)?$`));
  return res;
}

export default function getConfig(
  type: 'app' | 'lib',
  env: 'web' | 'node' | 'iso'
) {
  return defineConfig({
    build: {
      sourcemap: true,
      // While node applications are not libraries, using library mode does essentially what we need
      // anyways - avoiding Vite's browser-centric defaults
      lib:
        type === 'lib' || env === 'node'
          ? {
              entry: 'src/index.ts',
              fileName: 'index',
              formats: ['es'],
            }
          : false,
      rollupOptions: {
        external: [
          // No need to process/bundle dependencies unless we're in a webapp
          ...(type === 'lib' || env === 'node' ? getAllDeps() : []),
          // Don't try to process/bundle node builtins either
          ...(env === 'node' ? builtinModules : []),
        ],
      },
    },
    plugins: [
      // If we have an executable script, we need to preserve the shebang
      preserveShebangs(),
      {
        ...typescriptPlugin({
          tsconfig: 'tsconfig.build.json',
          tsconfigOverride: {
            compilerOptions: {
              // rollup-plugin-tsconfig2 runs typescript in a cache directory, so the paths to the source
              // files in the emitted sourcemap will be incorrect (since it will be a relative path from
              // node_modules/.cache/rollup-plugin-typescript2/<id>/placeholder/ instead of dist/ where the
              // sourcemap actually is).
              // Rollup handles this fine due to the way it merges chained source maps, so everything is fine
              // with `vite build`, but `vite serve` eschews rollup and does its source map merging differently,
              // leaving the incorrect source resolution intact.
              // To get around this, we'll tell typescript how to resolve source file locations
              // See https://github.com/ezolenko/rollup-plugin-typescript2/issues/407
              sourceRoot: '../src',
            },
          },
        }),
        enforce: 'pre',
      },
      ...(type === 'app' && env === 'web'
        ? [
            pluginLegacy({
              // This isn't really recommended (https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#modernpolyfills)
              // due to how heavy it is, but I'd like to be able to safely work with esnext features. At some point we should
              // probably investigate using an approach like polyfill.io
              modernPolyfills: true,
              renderLegacyChunks: false,
            }),
          ]
        : []),
    ],
  });
}
