import javascript from './configs/javascript';
import nxJavascript from './configs/nx-javascript';
import nxTypescript from './configs/nx-typescript';
import typescript from './configs/typescript';
import vue3Javascript from './configs/vue3-javascript';
import vue3Typescript from './configs/vue3-typescript';
import monorepoDepLocation from './rules/monorepo-dep-location';

// Vite doesn't include `require.resolve` in the module graph, so import these
// to make sure they get built
import './configs/base/extraneous-deps';
import './configs/base/javascript';
import './configs/base/nx';
import './configs/base/typescript';
import './configs/base/vue';

export default {
  configs: {
    javascript,
    'nx-javascript': nxJavascript,
    'nx-typescript': nxTypescript,
    typescript,
    'vue3-javascript': vue3Javascript,
    'vue3-typescript': vue3Typescript,
  },
  rules: {
    'monorepo-dep-location': monorepoDepLocation,
  },
};
