import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { screensProviders } from './screens.providers';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...screensProviders, ScreensService],
  controllers: [ScreensController],
  exports: [ScreensService],
})
export class ScreensModule {}
