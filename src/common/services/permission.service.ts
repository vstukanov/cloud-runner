import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { castArray, flattenDeep, isEmpty, difference, uniq } from 'lodash';

@Injectable()
export class PermissionService {
  check(user: UserEntity, permissions: string[] | string): string[] {
    const requiredPermissions = castArray(permissions);
    const existingPermissions = this.getUserPermissions(user);

    return difference(requiredPermissions, existingPermissions);
  }

  getUserPermissions(user: UserEntity) {
    return uniq(
      flattenDeep(
        user.roles.map((role) =>
          role.permissions.map((permission) => permission.name),
        ),
      ),
    );
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
