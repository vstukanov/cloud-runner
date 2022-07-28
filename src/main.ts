import 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { winstonLoggerModuleFactory } from './common/services/logger.service';

async function bootstrap() {
  const logger = winstonLoggerModuleFactory('api');

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('api.port');
  await app.listen(port);
}

bootstrap();
