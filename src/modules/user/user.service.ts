import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit } from 'lodash';
import { PermissionService } from '../../common/services';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly permissionsService: PermissionService,
  ) {}

  async getMe(userId: number) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      ...omit(user, [
        'invitationCode',
        'password',
        'totpSecret',
        'roles',
        'status',
      ]),
      permissions: this.permissionsService.getUserPermissions(user),
    };
  }
}
