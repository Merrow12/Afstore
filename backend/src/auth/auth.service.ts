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
    return { accessToken: token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверный email или пароль');

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return { accessToken: token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }
}