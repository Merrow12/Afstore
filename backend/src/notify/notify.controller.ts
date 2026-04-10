import { Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('announce/:eventId')
  sendAnnouncement(@Param('eventId') eventId: string) {
    return this.notifyService.sendEventAnnouncement(eventId);
  }

  @Get('user/:userId')
  getNotifications(@Param('userId') userId: string) {
    return this.notifyService.getNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notifyService.markAsRead(id);
  }
}