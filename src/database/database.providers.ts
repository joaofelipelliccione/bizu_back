import { DataSource } from 'typeorm';
import 'dotenv/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.HOST,
        port: 3306,
        username: process.env.JAWS_DB_USERNAME,
        password: process.env.JAWS_DB_PASSWORD,
        database: process.env.JAWS_DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Deve ser 'false' quando for para produção.
      });

      return dataSource.initialize();
    },
  },
];
