import 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { winstonLoggerModuleFactory } from './common/services/logger.service';
import { existsSync, writeFileSync } from 'fs';
import { SeedService } from './modules/seed/seed.service';

const SEED_PATH = '.CLOUD_RUNNER_SEED';

async function bootstrap() {
  const logger = winstonLoggerModuleFactory('api');

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  if (!existsSync(SEED_PATH)) {
    logger.log('initial seed');
    const seedService = app.get<SeedService>(SeedService);
    await seedService.seedAll();
    writeFileSync(SEED_PATH, '');
  }

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('api.port');
  const host = configService.get('api.host');

  logger.log(`Start listening ${host}:${port}`);
  await app.listen(port);
}

bootstrap();
