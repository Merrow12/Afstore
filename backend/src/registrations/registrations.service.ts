import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RegistrationsService {

  async register(userId: string, eventId: string) {
    // Проверяем существует ли событие
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Мероприятие не найдено');

    // Проверяем не записан ли уже пользователь
    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) throw new ConflictException('Вы уже записаны на это мероприятие');

    const registration = await prisma.registration.create({
      data: { userId, eventId },
      include: {
        event: { select: { title: true, dateTime: true, location: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return {
      message: 'Вы успешно записались на мероприятие!',
      registration,
    };
  }

  async unregister(userId: string, eventId: string) {
    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!existing) throw new NotFoundException('Регистрация не найдена');

    await prisma.registration.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    return { message: 'Вы отменили запись на мероприятие' };
  }

  async getUserRegistrations(userId: string) {
    return prisma.registration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            dateTime: true,
            location: true,
            status: true,
            category: { select: { name: true, slug: true } },
            organizer: { select: { name: true } },
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async checkRegistration(userId: string, eventId: string) {
    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    return { isRegistered: !!existing };
  }
}