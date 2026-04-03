import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EventsService {

  async findAll(category?: string, faculty?: string, page = 1, limit = 50) {
    const where: any = { status: 'PUBLISHED' };
    if (category) where.categoryId = category;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dateTime: 'asc' },
        select: {
          id: true,
          title: true,
          dateTime: true,
          location: true,
          imageUrl: true,
          category: { select: { name: true } },
          organizer: { select: { name: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total, page, limit };
  }

  async findOne(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true } },
        reviews: { include: { user: { select: { name: true } } } },
      },
    });
    if (!event) throw new NotFoundException('Мероприятие не найдено');
    return event;
  }

  async create(data: {
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    categoryId: string;
    organizerId: string;
    imageUrl?: string;
  }) {
    return prisma.event.create({ data });
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    imageUrl: string;
  }>) {
    return prisma.event.update({ where: { id }, data });
  }

  async remove(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}