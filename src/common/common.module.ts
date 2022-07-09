import { Global, Module } from '@nestjs/common';
import { JwtService, PermissionService } from './services';

@Global()
@Module({
  imports: [],
  providers: [PermissionService, JwtService],
  exports: [PermissionService, JwtService],
})
export class CommonModule {}
