import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class FeedbackService {

  async getReviews(eventId: string) {
    return prisma.review.findMany({
      where: { eventId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(userId: string, eventId: string, rating: number, comment?: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Мероприятие не найдено');

    return prisma.review.create({
      data: { userId, eventId, rating, comment },
      include: { user: { select: { name: true } } },
    });
  }

  async deleteReview(id: string) {
    return prisma.review.delete({ where: { id } });
  }

  async getEventRating(eventId: string) {
    const reviews = await prisma.review.findMany({ where: { eventId } });
    if (reviews.length === 0) return { eventId, avgRating: 0, reviewCount: 0 };

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return {
      eventId,
      avgRating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    };
  }
}