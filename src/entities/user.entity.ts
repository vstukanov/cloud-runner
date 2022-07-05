import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleEntity } from './role.entity';

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity('users')
@Unique('users_email_uniq', ['email'])
export class UserEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'users_pkey' })
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @ManyToMany(() => RoleEntity, { cascade: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];

  @Column({ type: 'varchar', nullable: true })
  totpSecret: string;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;
}
