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
    minRating?: number,
    organizerId?: string,
  ) {
    page = Math.max(1, Math.abs(Math.floor(page)));
    limit = Math.min(100, Math.max(1, Math.abs(Math.floor(limit))));

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
          reviews: { select: { rating: true } },
          registrations: { select: { id: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    let result = events.map(event => {
      const avgRating = event.reviews.length > 0
        ? Math.round((event.reviews.reduce((a, b) => a + b.rating, 0) / event.reviews.length) * 10) / 10
        : null;
      const { reviews, registrations, ...rest } = event;
      return {
        ...rest,
        avgRating,
        reviewCount: reviews.length,
        registrationCount: registrations.length,
      };
    });

    if (minRating) {
      result = result.filter(e => e.avgRating !== null && e.avgRating >= minRating);
    }

    return { events: result, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true } },
        reviews: { include: { user: { select: { name: true } } } },
        registrations: { select: { id: true } },
      },
    });
    if (!event) throw new NotFoundException('Мероприятие не найдено');

    const avgRating = event.reviews.length > 0
      ? Math.round((event.reviews.reduce((a, b) => a + b.rating, 0) / event.reviews.length) * 10) / 10
      : null;

    return {
      ...event,
      avgRating,
      reviewCount: event.reviews.length,
      registrationCount: event.registrations.length,
    };
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