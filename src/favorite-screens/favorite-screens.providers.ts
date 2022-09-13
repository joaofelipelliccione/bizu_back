import { DataSource } from 'typeorm';
import { FavoriteScreen } from './entities/favorite-screen.entity';

export const favoriteScreensProviders = [
  {
    provide: 'FAVORITE_SCREEN_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FavoriteScreen),
    inject: ['DATA_SOURCE'], // Vêm do arquivo database.providers.ts
  },
];
