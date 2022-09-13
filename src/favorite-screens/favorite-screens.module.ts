import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { favoriteScreensProviders } from './favorite-screens.providers';
import { FavoriteScreensService } from './favorite-screens.service';
import { FavoriteScreensController } from './favorite-screens.controller';
import { usersProviders } from '../users/users.providers';
import { screensProviders } from '../screens/screens.providers';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...favoriteScreensProviders,
    ...usersProviders,
    ...screensProviders,
    FavoriteScreensService,
    JwtService,
  ],
  controllers: [FavoriteScreensController],
  exports: [FavoriteScreensService],
})
export class FavoriteScreensModule {}
