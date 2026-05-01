import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { NotifyModule } from './notify/notify.module';
import { AdminModule } from './admin/admin.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { IntegrationModule } from './integration/integration.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AuthModule, EventsModule, NotifyModule, AdminModule, FeedbackModule, RecommendationsModule, IntegrationModule, RegistrationsModule, CategoriesModule],
  controllers: [AppController, CategoriesController],
  providers: [AppService, CategoriesService],
})
export class AppModule {}
