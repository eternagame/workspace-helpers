import getConfig from '@eternagame/vite-utils';

export default getConfig({
  type: 'lib',
  env: 'node',
  resourceFiles: {
    sourceRoot: 'src',
    sourceGlobs: ['**/files/**/*', '**/schema.json'],
  },
});
