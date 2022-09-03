import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [AuthModule, CountriesModule, AppsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
