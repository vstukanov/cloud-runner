import { Injectable, Logger } from '@nestjs/common';
import { PermissionEntity, RoleEntity, UserEntity } from '../../entities';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth';
import { UserStatus } from '../../entities/user.entity';
import { nanoid } from 'nanoid';
import { AuthPermissions } from '../auth/auth.permissions';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private readonly authService: AuthService,
  ) {}

  async seedPermissions() {
    return Promise.all(
      [...Object.values(AuthPermissions)].map(async (perm) => {
        const permModel = this.permissionRepository.create({
          name: perm,
          system: true,
        });

        await this.permissionRepository.save(permModel);
        return permModel;
      }),
    );
  }
  async seedAdminUser() {
    this.logger.log('seed admin user');
    const email = this.configService.get('seed.admin_email');
    const password = this.configService.get('seed.admin_password');
    const passwordHash = await this.authService.passwordHash(password);
    const fullName = this.configService.get('seed.admin_fullname');
    const permissions = await this.seedPermissions();

    const adminRole = this.roleRepository.create({
      name: 'admin',
      permissions,
      system: true,
    });

    await this.roleRepository.save(adminRole);

    const adminUser = this.userRepository.create({
      email,
      password: passwordHash,
      fullName,
      invitationCode: nanoid(21),
      status: UserStatus.ACTIVE,
      joinedAt: new Date(),
      roles: [adminRole],
    });

    await this.userRepository.save(adminUser);
  }

  async seedAll() {
    await this.seedAdminUser();
  }
}
