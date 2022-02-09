const javascript = require('./configs/javascript');
const nxJavascript = require('./configs/nx-javascript');
const nxTypescript = require('./configs/nx-typescript');
const typescript = require('./configs/typescript');
const vue3Javascript = require('./configs/vue3-javascript');
const vue3Typescript = require('./configs/vue3-typescript');

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
