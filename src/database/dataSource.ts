import { DataSource } from 'typeorm';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.HOST,
  port: 3306,
  username: process.env.JAWS_DB_USERNAME,
  password: process.env.JAWS_DB_PASSWORD,
  database: process.env.JAWS_DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
});

export default dataSource;
