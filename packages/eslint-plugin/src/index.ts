import monorepoDepLocation from './rules/monorepo-dep-location';

// Vite doesn't include `require.resolve` in the module graph, so import these
// to make sure they get built
import './configs/javascript';
import './configs/nx-javascript';
import './configs/nx-typescript';
import './configs/typescript';
import './configs/vue3-javascript';
import './configs/vue3-typescript';
import './configs/base/extraneous-deps';
import './configs/base/javascript';
import './configs/base/nx';
import './configs/base/typescript';
import './configs/base/vue';

export default {
  configs: {
    // Why are we doing this instead of importing directly? When running eslint through the vs code
    // eslint plugin, a single node process repeatedly creates new instances of eslint.
    // configs/base/extraneous-deps evaluates different results based on the cwd eslint is run from.
    // When using extends with require.resolve, eslint will use import-fresh to include configs
    // bypassing node's module cache. However, when a plugin is loaded, it is NOT loaded bypassing
    // the module cache. So this makes sure that when the vs code plugin lints files in different
    // directories, it will use a correctly-generated config, rather than a "stale" config generated
    // for a different directory.
    javascript: { extends: require.resolve('./configs/javascript') },
    'nx-javascript': { extends: require.resolve('./configs/nx-javascript') },
    'nx-typescript': { extends: require.resolve('./configs/nx-typescript') },
    typescript: { extends: require.resolve('./configs/typescript') },
    'vue3-javascript': { extends: require.resolve('./configs/vue3-javascript') },
    'vue3-typescript': { extends: require.resolve('./configs/vue3-typescript') },
  },
  rules: {
    'monorepo-dep-location': monorepoDepLocation,
  },
};
