import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      // We'll let Nx handle loading env vars
      ignoreEnvFile: true,
    }),
  ],
})
export default class CoreModule {}
