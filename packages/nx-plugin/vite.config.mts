import getConfig from '@eternagame/vite-utils';

export default getConfig({
  type: 'lib',
  env: 'node',
  resourceFiles: {
    sourceRoot: '.',
    sourceGlobs: ['**/files/**/*', '**/schema.json'],
  },
});
