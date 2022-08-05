// Note that this file has to be mjs and not ts because we can't set type: module in our package.json,
// as eslint relies on commonjs
import getConfig from '@eternagame/vite';

export default getConfig('lib', 'node');
