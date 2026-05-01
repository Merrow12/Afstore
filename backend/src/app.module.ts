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

@Module({
  imports: [AuthModule, EventsModule, NotifyModule, AdminModule, FeedbackModule, RecommendationsModule, IntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
