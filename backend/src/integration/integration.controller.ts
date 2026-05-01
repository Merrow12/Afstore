import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('lms/schedule')
  getLmsSchedule(@Query('facultyId') facultyId?: string) {
    return this.integrationService.getLmsSchedule(facultyId);
  }

  @Get('lms/students')
  getLmsStudents(@Query('groupId') groupId?: string) {
    return this.integrationService.getLmsStudents(groupId);
  }

  @Post('lms/sync')
  syncEventsToLms(@Body() body: { eventIds: string[] }) {
    return this.integrationService.syncEventsToLms(body.eventIds);
  }
}