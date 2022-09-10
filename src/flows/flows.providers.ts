import { DataSource } from 'typeorm';
import { Flow } from './entities/flow.entity';

export const flowsProviders = [
  {
    provide: 'FLOW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Flow),
    inject: ['DATA_SOURCE'], // Vêm do arquivo database.providers.ts
  },
];
