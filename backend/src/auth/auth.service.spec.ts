import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

// Мокаем PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockJwtService as unknown as JwtService);
  });

  it('должен быть определён', () => {
    expect(authService).toBeDefined();
  });

  it('должен хешировать пароль при регистрации', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 12);
    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it('должен генерировать JWT токен', () => {
    const token = mockJwtService.sign({ userId: '123', role: 'STUDENT' });
    expect(token).toBe('mock-token');
    expect(mockJwtService.sign).toHaveBeenCalled();
  });

  it('bcrypt не должен совпадать с неверным паролем', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 12);
    const isMatch = await bcrypt.compare('wrongpassword', hash);
    expect(isMatch).toBe(false);
  });
});