import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';

export enum DeviceStatus {
  NEW = 'new',
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

@Entity('devices')
@Unique('devices_refresh_token_uniq', ['refresh_token'])
export class DeviceEntity {
  @Column({
    type: 'varchar',
    primary: true,
    primaryKeyConstraintName: 'devices_pkey',
  })
  deviceId: string;

  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.NEW })
  status: DeviceStatus;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  lastLoginWith: Date;
}
