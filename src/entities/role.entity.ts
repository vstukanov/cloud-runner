import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { PermissionEntity } from './permission.entity';

@Entity('roles')
@Unique('roles_name_uniq', ['name'])
export class RoleEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'roles_pkey' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  system: boolean;

  @ManyToMany(() => PermissionEntity, { cascade: false })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: PermissionEntity[];
}
