import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { subscriptionsProviders } from './subscriptions.providers';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...subscriptionsProviders, SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
