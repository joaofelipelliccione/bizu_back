import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { AppsModule } from './apps/apps.module';
import { FlowsModule } from './flows/flows.module';
import { ScreensModule } from './screens/screens.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { FavoriteScreensModule } from './favorite-screens/favorite-screens.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './configs/mailer.config';
import { AppController } from './app.controller';
import { CategoriesModule } from './categories/categories.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 20 * 60,
      limit: 500,
    }),
    AuthModule,
    CountriesModule,
    AppsModule,
    FlowsModule,
    ScreensModule,
    SubscriptionsModule,
    FavoriteScreensModule,
    MailerModule.forRoot(mailerConfig),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
