import javascript = require('./configs/javascript');
import nxJavascript = require('./configs/nx-javascript');
import nxTypescript = require('./configs/nx-typescript');
import typescript = require('./configs/typescript');
import vue3Javascript = require('./configs/vue3-javascript');
import vue3Typescript = require('./configs/vue3-typescript');

module.exports = {
  configs: {
    javascript,
    'nx-javascript': nxJavascript,
    'nx-typescript': nxTypescript,
    typescript,
    'vue3-javascript': vue3Javascript,
    'vue3-typescript': vue3Typescript,
  },
};
