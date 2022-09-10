import { DataSource } from 'typeorm';
import { Screen } from './entities/screen.entity';

export const screensProviders = [
  {
    provide: 'SCREEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Screen),
    inject: ['DATA_SOURCE'], // Vêm do arquivo database.providers.ts
  },
];
