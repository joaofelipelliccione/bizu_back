import { DataSource } from 'typeorm';
import { App } from './entities/app.entity';

export const appsProviders = [
  {
    provide: 'APP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(App),
    inject: ['DATA_SOURCE'], // Vêm do arquivo database.providers.ts
  },
];
