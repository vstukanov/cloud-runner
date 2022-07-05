import { MigrationInterface, QueryRunner } from 'typeorm';

const SYSTEM_ROLES = [
  ['auth.login', true],
  ['auth.login.password', true],
  ['auth.login.google', true],
];

export class createSystemRoles1656756738830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO permissions (name, system) 
      VALUES ('auth.login.password', true),
             ('auth.login.google', true); 
    `);

    await queryRunner.query(`
      INSERT INTO roles (name, system)
      VALUES ('default', true),
             ('admin', true);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
