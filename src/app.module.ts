import * as config from 'config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';

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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(conig: ConfigService) {
        return {
          secret: conig.get('auth.jwt_secret'),
        };
      },
    }),
    PassportModule,
    CommonModule,
    AuthModule,
    SeedModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
