import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../entities';
import _ from 'lodash';

@Injectable()
export class PermissionService {
  check(user: UserEntity, permissions: string[] | string): string[] {
    const requiredPermissions = _.castArray(permissions);

    const existingPermissions = _.flattenDeep(
      user.roles.map((role) =>
        role.permissions.map((permission) => permission.name),
      ),
    );

    return _.difference(requiredPermissions, existingPermissions);
  }

  require(user: UserEntity, permissions: string[] | string) {
    const missingPermissions = this.check(user, permissions);

    if (!_.isEmpty(missingPermissions)) {
      throw new UnauthorizedException({
        reason: 'permission.required',
        permissions,
      });
    }
  }
}
