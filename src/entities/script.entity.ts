import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { ExecOptions } from 'child_process';
import { UserEntity } from './user.entity';

export enum ScriptStatus {
  ENABLED = 'enabled',
  DRAFT = 'draft',
  DISABLED = 'disabled',
  ARCHIVED = 'archived',
}

export type ScriptArgumentType =
  | 'text'
  | 'number'
  | 'file'
  | 'date'
  | 'datetime'
  | 'datetime-range'
  | 'time'
  | 'select';

export interface ScriptArgument {
  type: ScriptArgumentType;
  name: string;
  description: string;
  required: boolean;
}

@Entity('scripts')
@Unique('scripts_name_uniq', ['name'])
export class ScriptEntity {
  @Column({
    type: 'varchar',
    primary: true,
    primaryKeyConstraintName: 'scripts_pkey',
  })
  scriptId: string;

  @Column({ type: 'enum', enum: ScriptStatus, default: ScriptStatus.ENABLED })
  status: ScriptStatus;

  @Column({ type: 'varchar', array: true, nullable: true })
  permissions: string[];

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  template: string;

  @Column({ type: 'json', nullable: true })
  arguments: ScriptArgument[];

  @Column({ type: 'json' })
  argumentsSchema: any;

  @Column({ type: 'json' })
  execOptions: ExecOptions;

  @Column({ type: 'integer' })
  timeout: number;

  @Column({ type: 'varchar', array: true })
  tags: string[];

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  lastTriggeredAt: Date;

  @ManyToOne(() => UserEntity)
  lastTriggeredBy: UserEntity;
}
