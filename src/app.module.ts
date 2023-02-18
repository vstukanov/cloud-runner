import * as config from 'config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config.util.toObject(config)],
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          autoLoadEntities: true,
        };
      },
      async dataSourceFactory() {
        await AppDataSource.initialize();
        return AppDataSource;
      },
    }),
    CommonModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
