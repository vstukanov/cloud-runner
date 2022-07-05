import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('permissions')
@Unique('permissions_name_uniq', ['name'])
export class PermissionEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'permissions_pkey' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  system: boolean;
}
