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

@Module({
  imports: [
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
  providers: [],
})
export class AppModule {}
