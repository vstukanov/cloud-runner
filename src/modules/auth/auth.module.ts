import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity, UserEntity } from '../../entities';
import { DeviceService } from './device.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeviceEntity])],
  controllers: [AuthController],
  providers: [AuthService, DeviceService, JwtStrategy],
  exports: [AuthService, DeviceService],
})
export class AuthModule {}
