import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, name: string, faculty?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Пользователь уже существует');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, faculty },
    });

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, faculty: user.faculty },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверный email или пароль');

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, faculty: user.faculty },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Не раскрываем существует ли email
      return { message: 'Если email зарегистрирован — письмо отправлено' };
    }

    // Генерируем временный токен
    const resetToken = Math.random().toString(36).substring(2, 15);

    // Сохраняем уведомление пользователю
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        message: `Запрос на сброс пароля. Токен: ${resetToken}`,
      },
    });

    return { message: 'Если email зарегистрирован — письмо отправлено' };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return { message: 'Пароль успешно изменён' };
  }
}