import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('event/:eventId')
  getReviews(@Param('eventId') eventId: string) {
    return this.feedbackService.getReviews(eventId);
  }

  @Post('event/:eventId')
  createReview(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string; rating: number; comment?: string },
  ) {
    return this.feedbackService.createReview(body.userId, eventId, body.rating, body.comment);
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string) {
    return this.feedbackService.deleteReview(id);
  }

  @Get('event/:eventId/rating')
  getEventRating(@Param('eventId') eventId: string) {
    return this.feedbackService.getEventRating(eventId);
  }
}