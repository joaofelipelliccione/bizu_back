import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { countriesProviders } from './countries.providers';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...countriesProviders, CountriesService],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export class CountriesModule {}
