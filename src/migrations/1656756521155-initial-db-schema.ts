import { MigrationInterface, QueryRunner } from "typeorm";

export class initialDbSchema1656756521155 implements MigrationInterface {
    name = 'initialDbSchema1656756521155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "system" boolean NOT NULL DEFAULT false,
                CONSTRAINT "permissions_name_uniq" UNIQUE ("name"),
                CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "system" boolean NOT NULL DEFAULT false,
                CONSTRAINT "roles_name_uniq" UNIQUE ("name"),
                CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'active', 'disabled')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying,
                "full_name" character varying,
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
                "joined_at" TIMESTAMP,
                "last_login_at" TIMESTAMP,
                CONSTRAINT "users_email_uniq" UNIQUE ("email"),
                CONSTRAINT "users_pkey" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."jobs_status_enum" AS ENUM(
                'created',
                'running',
                'success',
                'failure',
                'timeout',
                'aborted',
                'unknown'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "jobs" (
                "job_id" character varying NOT NULL,
                "command" text NOT NULL,
                "exec_options" json NOT NULL,
                "arguments" json,
                "status" "public"."jobs_status_enum" NOT NULL DEFAULT 'created',
                "exit_status" integer,
                "triggered_at" TIMESTAMP NOT NULL,
                "duration" double precision,
                "triggered_by_id" integer,
                CONSTRAINT "jobs_pkey" PRIMARY KEY ("job_id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."scripts_status_enum" AS ENUM('enabled', 'draft', 'disabled', 'archived')
        `);
        await queryRunner.query(`
            CREATE TABLE "scripts" (
                "script_id" character varying NOT NULL,
                "status" "public"."scripts_status_enum" NOT NULL DEFAULT 'enabled',
                "permissions" character varying array,
                "name" character varying NOT NULL,
                "template" text NOT NULL,
                "arguments" json,
                "arguments_schema" json NOT NULL,
                "exec_options" json NOT NULL,
                "timeout" integer NOT NULL,
                "tags" character varying array NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "last_triggered_at" TIMESTAMP NOT NULL,
                "owner_id" integer,
                "last_triggered_by_id" integer,
                CONSTRAINT "scripts_name_uniq" UNIQUE ("name"),
                CONSTRAINT "scripts_pkey" PRIMARY KEY ("script_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "roles_permissions" (
                "role_id" integer NOT NULL,
                "permission_id" integer NOT NULL,
                CONSTRAINT "PK_0cd11f0b35c4d348c6ebb9b36b7" PRIMARY KEY ("role_id", "permission_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7d2dad9f14eddeb09c256fea71" ON "roles_permissions" ("role_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_337aa8dba227a1fe6b73998307" ON "roles_permissions" ("permission_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" integer NOT NULL,
                "role_id" integer NOT NULL,
                CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs"
            ADD CONSTRAINT "FK_636ce41345cd88950cd795516c2" FOREIGN KEY ("triggered_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "scripts"
            ADD CONSTRAINT "FK_e75af1cbded2a18dbe1886b6fe6" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "scripts"
            ADD CONSTRAINT "FK_126cebaba90a9f3003d09ddf931" FOREIGN KEY ("last_triggered_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "roles_permissions"
            ADD CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "roles_permissions"
            ADD CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"
        `);
        await queryRunner.query(`
            ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_337aa8dba227a1fe6b73998307b"
        `);
        await queryRunner.query(`
            ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719"
        `);
        await queryRunner.query(`
            ALTER TABLE "scripts" DROP CONSTRAINT "FK_126cebaba90a9f3003d09ddf931"
        `);
        await queryRunner.query(`
            ALTER TABLE "scripts" DROP CONSTRAINT "FK_e75af1cbded2a18dbe1886b6fe6"
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs" DROP CONSTRAINT "FK_636ce41345cd88950cd795516c2"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"
        `);
        await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_337aa8dba227a1fe6b73998307"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7d2dad9f14eddeb09c256fea71"
        `);
        await queryRunner.query(`
            DROP TABLE "roles_permissions"
        `);
        await queryRunner.query(`
            DROP TABLE "scripts"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."scripts_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "jobs"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."jobs_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP TABLE "permissions"
        `);
    }

}
