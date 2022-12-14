import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { appsProviders } from './apps.providers';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { categoriesProviders } from 'src/categories/categories.providers';
import { countriesProviders } from '../countries/countries.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...appsProviders,
    ...categoriesProviders,
    ...countriesProviders,
    AppsService,
  ],
  controllers: [AppsController],
  exports: [AppsService],
})
export class AppsModule {}
