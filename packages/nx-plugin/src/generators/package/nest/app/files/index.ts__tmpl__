import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import AppModule from './src/app.module';
import createOpenAPIDocument from './src/openapi-document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const document = createOpenAPIDocument(app);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
  // eslint-disable-next-line no-console
  console.info(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
