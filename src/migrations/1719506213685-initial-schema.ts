import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1625847615203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "isAdmin" boolean NOT NULL DEFAULT (false)
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "report" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "price" integer NOT NULL,
                "approved" boolean NOT NULL DEFAULT (0),
                "make" varchar NOT NULL,
                "model" varchar NOT NULL,
                "year" integer NOT NULL,
                "lng" integer NOT NULL,
                "lat" integer NOT NULL,
                "mileage" integer NOT NULL,
                "userId" integer
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "report"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
