import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RecommendationsService {

  async getRecommendations(userId: string, limit = 6) {
    const userRegistrations = await prisma.registration.findMany({
      where: { userId },
      select: { eventId: true },
    });

    const userEventIds = userRegistrations.map(r => r.eventId);

    if (userEventIds.length === 0) {
      return this.getPopular(limit);
    }

    const similarUsers = await prisma.registration.findMany({
      where: {
        eventId: { in: userEventIds },
        userId: { not: userId },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    const similarUserIds = similarUsers.map(u => u.userId);

    if (similarUserIds.length === 0) {
      return this.getPopular(limit);
    }

    const recommendedRegs = await prisma.registration.findMany({
      where: {
        userId: { in: similarUserIds },
        eventId: { notIn: userEventIds },
      },
      select: { eventId: true },
    });

    // Считаем score с учётом рейтинга отзывов
    const eventScores: Record<string, number> = {};
    recommendedRegs.forEach(r => {
      eventScores[r.eventId] = (eventScores[r.eventId] || 0) + 1;
    });

    // Добавляем средний рейтинг отзывов к score
    const reviews = await prisma.review.findMany({
      where: { eventId: { in: Object.keys(eventScores) } },
      select: { eventId: true, rating: true },
    });

    const ratingMap: Record<string, number[]> = {};
    reviews.forEach(r => {
      if (!ratingMap[r.eventId]) ratingMap[r.eventId] = [];
      ratingMap[r.eventId].push(r.rating);
    });

    // Итоговый score = частота * 0.6 + средний рейтинг * 0.4
    Object.keys(eventScores).forEach(eventId => {
      const ratings = ratingMap[eventId] || [];
      const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 3;
      eventScores[eventId] = eventScores[eventId] * 0.6 + avgRating * 0.4;
    });

    const sortedEventIds = Object.entries(eventScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (sortedEventIds.length === 0) return this.getPopular(limit);

    return prisma.event.findMany({
      where: { id: { in: sortedEventIds }, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        dateTime: true,
        location: true,
        imageUrl: true,
        category: { select: { name: true, slug: true } },
        organizer: { select: { name: true } },
      },
    });
  }

  async getPopular(limit = 6) {
    // Популярность = кол-во регистраций + средний рейтинг
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      take: limit * 3,
      select: {
        id: true,
        title: true,
        dateTime: true,
        location: true,
        imageUrl: true,
        category: { select: { name: true, slug: true } },
        organizer: { select: { name: true } },
        registrations: { select: { id: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    const scored = events.map(event => {
      const regCount = event.registrations.length;
      const avgRating = event.reviews.length > 0
        ? event.reviews.reduce((a, b) => a + b.rating, 0) / event.reviews.length
        : 3;
      const score = regCount * 0.6 + avgRating * 0.4;
      const { registrations, reviews, ...rest } = event;
      return { ...rest, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...rest }) => rest);
  }
}