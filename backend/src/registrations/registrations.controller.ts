import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  register(@Body() body: { userId: string; eventId: string }) {
    return this.registrationsService.register(body.userId, body.eventId);
  }

  @Delete()
  unregister(@Body() body: { userId: string; eventId: string }) {
    return this.registrationsService.unregister(body.userId, body.eventId);
  }

  @Get('user/:userId')
  getUserRegistrations(@Param('userId') userId: string) {
    return this.registrationsService.getUserRegistrations(userId);
  }

  @Get('check/:userId/:eventId')
  checkRegistration(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.registrationsService.checkRegistration(userId, eventId);
  }
}