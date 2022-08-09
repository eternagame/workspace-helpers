// Note that this file has to be mts and not ts because we can't set type: module in our
// package.json, as eslint relies on commonjs
import getConfig from '@eternagame/vite-utils';

export default getConfig({ type: 'lib', env: 'node' });
