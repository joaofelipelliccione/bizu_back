import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { categoriesProviders } from './categories.providers';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...categoriesProviders, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
