import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
