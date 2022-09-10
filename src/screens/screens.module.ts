import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { screensProviders } from './screens.providers';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { flowsProviders } from 'src/flows/flows.providers';
import { appsProviders } from 'src/apps/apps.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...screensProviders,
    ...flowsProviders,
    ...appsProviders,
    ScreensService,
  ],
  controllers: [ScreensController],
  exports: [ScreensService],
})
export class ScreensModule {}
