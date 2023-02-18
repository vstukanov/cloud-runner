import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { castArray, flattenDeep, isEmpty, difference } from 'lodash';

@Injectable()
export class PermissionService {
  check(user: UserEntity, permissions: string[] | string): string[] {
    const requiredPermissions = castArray(permissions);

    const existingPermissions = flattenDeep(
      user.roles.map((role) =>
        role.permissions.map((permission) => permission.name),
      ),
    );

    return difference(requiredPermissions, existingPermissions);
  }

  require(user: UserEntity, permissions: string[] | string) {
    const missingPermissions = this.check(user, permissions);

    if (!isEmpty(missingPermissions)) {
      throw new UnauthorizedException({
        reason: 'permission.required',
        permissions,
      });
    }
  }
}
