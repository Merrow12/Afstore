import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class NotifyService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  async sendEventAnnouncement(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });
    if (!event) return;

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: true },
    });

    for (const reg of registrations) {
      await this.sendEmail(
        reg.user.email,
        `Напоминание: ${event.title}`,
        `Здравствуйте, ${reg.user.name}!\n\nНапоминаем о мероприятии "${event.title}".\nДата: ${event.dateTime}\nМесто: ${event.location}`,
      );
    }
  }

  async sendRegistrationConfirm(userId: string, eventId: string) {
    const [user, event] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.event.findUnique({ where: { id: eventId } }),
    ]);
    if (!user || !event) return;

    await this.sendEmail(
      user.email,
      `Вы записались на ${event.title}`,
      `Здравствуйте, ${user.name}!\n\nВы успешно зарегистрировались на "${event.title}".\nДата: ${event.dateTime}\nМесто: ${event.location}`,
    );

    await prisma.notification.create({
      data: {
        userId,
        type: 'REGISTRATION',
        message: `Вы записались на "${event.title}"`,
      },
    });
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  private async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Ошибка отправки email:', error);
    }
  }
}