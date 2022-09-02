import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [AuthModule, CountriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
