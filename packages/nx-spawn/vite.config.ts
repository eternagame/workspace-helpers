import getConfig from '@eternagame/vite-utils';

export default getConfig({
  type: 'app',
  env: 'node',
  resourceFiles: {
    sourceRoot: '.',
    sourceGlobs: ['src/tree-kill/tree-kill.sh'],
  },
});
