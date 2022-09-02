import getConfig from '@eternagame/vite-utils';
import nestSwaggerPlugin from '@nestjs/swagger/plugin.js';

export default getConfig({
  type: 'app',
  env: 'node',
  tsTransformers: [
    (service) => ({
      before: [nestSwaggerPlugin.before({}, service.getProgram())],
      after: [],
    }),
  ],
});
