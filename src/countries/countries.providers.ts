import { DataSource } from 'typeorm';
import { Country } from './entities/country.entity';

export const countriesProviders = [
  {
    provide: 'COUNTRY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Country),
    inject: ['DATA_SOURCE'], // Vêm do arquivo database.providers.ts
  },
];
