import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('faculty') faculty?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.findAll(category, faculty, Number(page) || 1, Number(limit) || 50);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() body: {
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    categoryId: string;
    organizerId: string;
    imageUrl?: string;
  }) {
    return this.eventsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}