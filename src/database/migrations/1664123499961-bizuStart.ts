import { MigrationInterface, QueryRunner } from 'typeorm';

export class bizuStart1664123499961 implements MigrationInterface {
  name = 'bizuStart1664123499961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`flow\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`screen\` (\`id\` int NOT NULL AUTO_INCREMENT, \`print\` varchar(255) NOT NULL, \`flowId\` int NOT NULL, \`appId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`app\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platform\` enum ('Mobile', 'Web') NOT NULL, \`name\` varchar(20) NOT NULL, \`logo\` varchar(255) NOT NULL, \`slogan\` varchar(60) NOT NULL, \`websiteLink\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastUpdate\` datetime NULL, \`categoryId\` int NOT NULL, \`countryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`country\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`flag\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`favorite_screen\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NOT NULL, \`screenId\` int NOT NULL, UNIQUE INDEX \`REL_0aae45eb778f1cd86191f114fb\` (\`screenId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`username\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`profilePicture\` varchar(255) NOT NULL DEFAULT 'https://bizudesignbucket.s3.sa-east-1.amazonaws.com/profile_avatars/default.jpg', \`isVerified\` tinyint NOT NULL DEFAULT 0, \`signUp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastSignIn\` datetime NULL, \`subscriptionId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`price\` decimal(5,2) NOT NULL, \`durationInMonths\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`screen\` ADD CONSTRAINT \`FK_ec6990d3fefb939099a720a38bf\` FOREIGN KEY (\`flowId\`) REFERENCES \`flow\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`screen\` ADD CONSTRAINT \`FK_3a3e0205d3b43a426bac57764d2\` FOREIGN KEY (\`appId\`) REFERENCES \`app\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`app\` ADD CONSTRAINT \`FK_82437432d8e28f196979ca665cf\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`app\` ADD CONSTRAINT \`FK_5a3bebcddab90dde0eb28ccf9c4\` FOREIGN KEY (\`countryId\`) REFERENCES \`country\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_screen\` ADD CONSTRAINT \`FK_3d7d0d5f8f0fcc28f1ba51a1713\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_screen\` ADD CONSTRAINT \`FK_0aae45eb778f1cd86191f114fb8\` FOREIGN KEY (\`screenId\`) REFERENCES \`screen\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_f1d3ffb910b5c1a9052df7c1833\` FOREIGN KEY (\`subscriptionId\`) REFERENCES \`subscription\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_f1d3ffb910b5c1a9052df7c1833\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_screen\` DROP FOREIGN KEY \`FK_0aae45eb778f1cd86191f114fb8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_screen\` DROP FOREIGN KEY \`FK_3d7d0d5f8f0fcc28f1ba51a1713\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`app\` DROP FOREIGN KEY \`FK_5a3bebcddab90dde0eb28ccf9c4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`app\` DROP FOREIGN KEY \`FK_82437432d8e28f196979ca665cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`screen\` DROP FOREIGN KEY \`FK_3a3e0205d3b43a426bac57764d2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`screen\` DROP FOREIGN KEY \`FK_ec6990d3fefb939099a720a38bf\``,
    );
    await queryRunner.query(`DROP TABLE \`subscription\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_0aae45eb778f1cd86191f114fb\` ON \`favorite_screen\``,
    );
    await queryRunner.query(`DROP TABLE \`favorite_screen\``);
    await queryRunner.query(`DROP TABLE \`country\``);
    await queryRunner.query(`DROP TABLE \`app\``);
    await queryRunner.query(`DROP TABLE \`screen\``);
    await queryRunner.query(`DROP TABLE \`flow\``);
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
