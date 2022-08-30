import getConfig from '@eternagame/vite-utils';

export default getConfig({
  type: 'app',
  env: 'node',
  resourceFiles: {
    sourceRoot: 'src',
    sourceGlobs: ['tree-kill/tree-kill.sh'],
  },
});
