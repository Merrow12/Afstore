import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('user/:userId')
  getRecommendations(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationsService.getRecommendations(userId, Number(limit) || 6);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    return this.recommendationsService.getPopular(Number(limit) || 6);
  }
}