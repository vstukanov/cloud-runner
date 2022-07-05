import { Column, Entity, ManyToOne } from 'typeorm';
import { ExecOptions } from 'child_process';
import { UserEntity } from './user.entity';

export enum JobStatus {
  CREATED = 'created',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  TIMEOUT = 'timeout',
  ABORTED = 'aborted',
  UNKNOWN = 'unknown',
}

@Entity('jobs')
export class JobEntity {
  @Column({
    type: 'varchar',
    primary: true,
    primaryKeyConstraintName: 'jobs_pkey',
  })
  jobId: string;

  @Column({ type: 'text', nullable: false })
  command: string;

  @Column({ type: 'json' })
  execOptions: ExecOptions;

  @Column({ type: 'json', nullable: true })
  arguments: any;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.CREATED })
  status: JobStatus;

  @Column({ type: 'integer', nullable: true })
  exitStatus: number;

  @Column()
  triggeredAt: Date;

  @ManyToOne(() => UserEntity)
  triggeredBy: UserEntity;

  @Column({ type: 'float8', nullable: true })
  duration: number;
}
