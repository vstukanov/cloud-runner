import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity, RoleEntity, UserEntity } from '../../entities';
import { SeedService } from './seed.service';
import { AuthService } from '../auth';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
    AuthModule,
  ],
  providers: [SeedService, AuthService],
})
export class SeedModule {}
