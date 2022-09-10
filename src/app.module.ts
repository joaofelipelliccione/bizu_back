import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { AppsModule } from './apps/apps.module';
import { FlowsModule } from './flows/flows.module';

@Module({
  imports: [AuthModule, CountriesModule, AppsModule, FlowsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
