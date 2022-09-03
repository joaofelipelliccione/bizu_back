import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { appsProviders } from './apps.providers';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...appsProviders, AppsService],
  controllers: [AppsController],
  exports: [AppsService],
})
export class AppsModule {}
