import { existsSync, readFileSync } from 'fs';
import {
  dirname, join, parse, resolve,
} from 'path';
import { cwd } from 'process';
import { builtinModules } from 'module';
import type { UserConfigFn } from 'vite';
import typescriptPlugin from 'rollup-plugin-typescript2';
import vuePlugin from '@vitejs/plugin-vue';
import type { TransformerFactoryCreator } from 'rollup-plugin-typescript2/dist/ioptions';
import postcssPresetEnv from 'postcss-preset-env';
import preserveShebangs from './src/rollup-preserve-shebangs';
import resourcePlugin from './src/rollup-resource-files';
import polyfillIoPlugin from './src/vite-polyfill-io';

function readPackageLock(): Record<string, unknown> {
  let checkDir = process.cwd();
  const { root } = parse(checkDir);
  while (checkDir !== root) {
    if (existsSync(join(checkDir, 'package-lock.json'))) {
      return JSON.parse(
        readFileSync(join(checkDir, 'package-lock.json'), { encoding: 'utf-8' }),
      ) as Record<string, unknown>;
    }
    checkDir = dirname(checkDir);
  }

  throw new Error('package-lock.json not found');
}

function getAllDeps() {
  const lockfile = readPackageLock();
  if (!lockfile['packages'] || typeof lockfile['packages'] !== 'object') throw new Error();
  const resolvedPaths = Object.keys(lockfile['packages']);
  return (
    resolvedPaths
      // Omit paths that map elsewhere within our project - if we use them, they'll also wind up
      // in node_modules anyways
      .filter((path) => path.startsWith('node_modules'))
      // Valid import strings start with anything that maps into node_modules
      .map((path) => path.replace(/node_modules\//, ''))
      // We want to match `<packagename>/*` not just `<packagename>`, or else when we deep import,
      // the deep imports will be bundled
      .map((dep) => new RegExp(`^${dep}(/.*)?$`))
  );
}

export interface Settings {
  type: 'app' | 'lib';
  env: 'vue' | 'web' | 'node' | 'iso';
  resourceFiles?: {
    sourceRoot: string;
    sourceGlobs: string[];
  };
  tsTransformers?: TransformerFactoryCreator[];
}

export default function getConfig(settings: Settings) {
  const isWeb = settings.env === 'web' || settings.env === 'vue';
  // This is what Vite says its default esbuild target is equivalent to
  // https://github.com/vitejs/vite/blob/9c1be108bfb1eac3dbbe432214349153d8b9ed5e/packages/vite/src/node/constants.ts#L15
  const browserslist = 'defaults and supports es6-module and supports es6-module-dynamic-import';

  // Explicitly specify we're using UserConfigFn instead of using defineConfig so that
  // if a consumer wants to override our config, they know the type they're modifying
  const config: UserConfigFn = ({ mode }) => ({
    esbuild: {
      // This will prevent esbuild from running its initial transpilation step (because we're using
      // rpt2), but it will still do tree shaking, bundling, minification, etc. This is because vite
      // actually has two internal esbuild plugins, the first one doing transpilation and the second
      // doing bundling, and the exclude pattern is only applied to the first one
      exclude: '**/*',
    },
    resolve: {
      alias: {
        '@': resolve(cwd(), 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          postcssPresetEnv({
            browsers: browserslist,
          }),
        ],
      },
    },
    build: {
      sourcemap: true,
      // While node applications are not libraries, using library mode does essentially what we need
      // anyways - avoiding Vite's browser-centric defaults
      lib:
        settings.type === 'lib' || settings.env === 'node'
          ? {
            entry: 'index.ts',
            fileName: '[name]',
            formats: ['es', 'cjs'],
          }
          : false,
      // If we're not in a webapp, file size doesn't really matter that much. If we're a lib,
      // rely on the app to minify the final output bundle
      minify: settings.type === 'app' && isWeb,
      rollupOptions: {
        external: [
          // No need to process/bundle dependencies unless we're in a webapp
          ...(settings.type === 'lib' || settings.env === 'node'
            ? getAllDeps()
            : []),
          // Don't try to process/bundle node builtins either
          ...(settings.env === 'node' ? builtinModules : []),
        ],
        output: {
          // If we're not in a webapp, don't bundle all our output files together
          ...(settings.type === 'lib' || settings.env === 'node'
            ? { preserveModules: true }
            : {}),
        },
        // If we're not in a webapp, don't tree shake. We don't need to since we're not doing any
        // bundling and all our dependencies are externalized - plus, more importantly, for
        // situations like our eslint plugin where we have to rely on `require.resolve` instead of
        // importing directly (until we migrate to eslint flat config), tree shaking will remove
        // things we actually use because we don't import them directly
        ...(settings.type === 'lib' || settings.env === 'node' ? { treeshake: false } : {}),
      },
      // If we're running multiple instances of vite in watch mode, emptying the output dir will
      // cause modules to momentarily fail to resolve. This could cause issues when:
      // * On starting our watch scripts, there is files in the out directory from a previous run,
      //   but we then remove it, so we move on to building a package that depends on it which
      //   bails because it can't find it
      // * After we've already started when we make a change, a downstream package will refresh
      //   when seeing the removal of the directory content, and when it goes to grab the updated
      //   content it wont be there
      emptyOutDir: mode !== 'development',
      // To simplify our scripts, development mode implies watch mode
      // (this is also the only way we would be able to provide watch mode options, as we can't
      // detect whether or not the watch flag has been passed to determine whether or not we should
      // provide the options object, which also enables watch mode)
      watch: mode === 'development' ? {} : null,
    },
    plugins: [
      // If we have an executable script, we need to preserve the shebang
      preserveShebangs(),
      ...(settings.env === 'vue'
        ? [vuePlugin()]
        : []),
      typescriptPlugin({
        tsconfig: mode === 'test' ? 'tsconfig.spec.json' : 'tsconfig.build.json',
        tsconfigOverride: {
          compilerOptions: {
            // rollup-plugin-tsconfig2 runs typescript in a cache directory, so the paths to the
            // source files in the emitted sourcemap will be incorrect (since it will be a
            // relative path from node_modules/.cache/rollup-plugin-typescript2/<id>/placeholder/
            // instead of dist/ where the sourcemap actually is).
            // Rollup handles this fine due to the way it merges chained source maps, so
            // everything is fine with `vite build`, but `vite serve` eschews rollup and does its
            // source map merging differently, leaving the incorrect source resolution intact.
            // To get around this, we'll tell typescript how to resolve source file locations
            // See https://github.com/ezolenko/rollup-plugin-typescript2/issues/407
            // Note that we use the root directory of our package because that's what
            // rootDir will evaluate to
            sourceRoot: resolve(cwd()),
            // vuePlugin generates code with implicit `any`s. We're relying on vue-tsc to report
            // errors in our source files anyways, so we'll still get errors if there's implicit
            // `any`s in the source.
            ...(settings.env === 'vue' ? { noImplicitAny: false } : {}),
          },
        },
        abortOnError: mode !== 'development',
        transformers: settings.tsTransformers ?? [],
      }),
      ...(settings.resourceFiles
        ? [resourcePlugin(settings.resourceFiles)]
        : []),
      ...(settings.type === 'app' && isWeb ? [polyfillIoPlugin(browserslist)] : []),
    ],
    test: {
      globals: true,
      environment: isWeb ? 'happy-dom' : 'node',
    },
  });

  return config;
}
