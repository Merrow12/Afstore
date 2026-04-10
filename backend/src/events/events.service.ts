import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EventsService {

  async findAll(
    category?: string,
    faculty?: string,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
    page = 1,
    limit = 50,
  ) {
    const where: any = { status: 'PUBLISHED' };

    if (category) where.categoryId = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (dateFrom || dateTo) {
      where.dateTime = {};
      if (dateFrom) where.dateTime.gte = new Date(dateFrom);
      if (dateTo) where.dateTime.lte = new Date(dateTo);
    }

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
          status: true,
          category: { select: { name: true, slug: true } },
          organizer: { select: { name: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}>) {
  return prisma.event.update({ where: { id }, data });
}

  async remove(id: string) {
    return prisma.event.delete({ where: { id } });
  }
}