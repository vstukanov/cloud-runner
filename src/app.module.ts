import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { PermissionService } from './common/services/permission.service';
import { DeviceService } from './common/services/device.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {};
      },
      async dataSourceFactory() {
        await AppDataSource.initialize();
        return AppDataSource;
      },
    }),
  ],
  controllers: [],
  providers: [PermissionService, DeviceService],
})
export class AppModule {}
