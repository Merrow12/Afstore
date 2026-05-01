import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AdminService {

  async getUsers(page = 1, limit = 20) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          faculty: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit };
  }

  async changeRole(id: string, role: 'STUDENT' | 'ORGANIZER' | 'ADMIN') {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async getDashboardStats() {
    const [totalUsers, totalEvents, totalRegistrations] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count(),
    ]);

    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    });

    return { totalUsers, totalEvents, totalRegistrations, recentEvents };
  }

  async moderateEvent(id: string, action: 'APPROVE' | 'REJECT') {
    const status = action === 'APPROVE' ? 'PUBLISHED' : 'CANCELLED';
    return prisma.event.update({
      where: { id },
      data: { status },
      select: { id: true, title: true, status: true },
    });
  }
  async deleteEvent(id: string) {
    // Сначала удаляем связанные данные
    await prisma.registration.deleteMany({ where: { eventId: id } });
    await prisma.review.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });
    return { message: 'Мероприятие удалено' };
  }

  async getAllEvents() {
    return prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        dateTime: true,
        category: { select: { name: true } },
        organizer: { select: { name: true } },
        registrations: { select: { id: true } },
      },
    });
  }
}