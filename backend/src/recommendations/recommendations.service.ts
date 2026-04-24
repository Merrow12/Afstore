import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RecommendationsService {

  // Коллаборативная фильтрация — рекомендации на основе регистраций похожих пользователей
  async getRecommendations(userId: string, limit = 6) {
    // 1. Находим мероприятия на которые записан пользователь
    const userRegistrations = await prisma.registration.findMany({
      where: { userId },
      select: { eventId: true },
    });

    const userEventIds = userRegistrations.map(r => r.eventId);

    // 2. Если нет регистраций — возвращаем популярные события
    if (userEventIds.length === 0) {
      return this.getPopular(limit);
    }

    // 3. Находим пользователей которые записались на те же события
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

    // 4. Находим события на которые записались похожие пользователи
    const recommendedEvents = await prisma.registration.findMany({
      where: {
        userId: { in: similarUserIds },
        eventId: { notIn: userEventIds },
      },
      select: { eventId: true },
    });

    // 5. Считаем частоту — чем чаще событие встречается, тем выше рейтинг
    const eventFrequency: Record<string, number> = {};
    recommendedEvents.forEach(r => {
      eventFrequency[r.eventId] = (eventFrequency[r.eventId] || 0) + 1;
    });

    const sortedEventIds = Object.entries(eventFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (sortedEventIds.length === 0) {
      return this.getPopular(limit);
    }

    // 6. Возвращаем рекомендованные события
    return prisma.event.findMany({
      where: {
        id: { in: sortedEventIds },
        status: 'PUBLISHED',
      },
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

  // Популярные события — по количеству регистраций
  async getPopular(limit = 6) {
    const popular = await prisma.registration.groupBy({
      by: ['eventId'],
      _count: { eventId: true },
      orderBy: { _count: { eventId: 'desc' } },
      take: limit,
    });

    const eventIds = popular.map(p => p.eventId);

    if (eventIds.length === 0) {
      return prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        take: limit,
        orderBy: { dateTime: 'asc' },
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

    return prisma.event.findMany({
      where: { id: { in: eventIds }, status: 'PUBLISHED' },
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
}