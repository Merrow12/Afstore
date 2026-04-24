import { Controller, Get, Patch, Param, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  private checkAdmin(authorization: string) {
    if (!authorization) throw new UnauthorizedException('Нет токена');
    const token = authorization.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'ADMIN') throw new UnauthorizedException('Нет доступа');
      return payload;
    } catch {
      throw new UnauthorizedException('Недействительный токен');
    }
  }

  @Get('users')
  getUsers(
    @Headers('authorization') auth: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.checkAdmin(auth);
    return this.adminService.getUsers(Number(page) || 1, Number(limit) || 20);
  }

  @Patch('users/:id/role')
  changeRole(
    @Headers('authorization') auth: string,
    @Param('id') id: string,
    @Body() body: { role: 'STUDENT' | 'ORGANIZER' | 'ADMIN' },
  ) {
    this.checkAdmin(auth);
    return this.adminService.changeRole(id, body.role);
  }

  @Get('stats')
  getDashboardStats(@Headers('authorization') auth: string) {
    this.checkAdmin(auth);
    return this.adminService.getDashboardStats();
  }

  @Patch('events/:id/moderate')
  moderateEvent(
    @Headers('authorization') auth: string,
    @Param('id') id: string,
    @Body() body: { action: 'APPROVE' | 'REJECT' },
  ) {
    this.checkAdmin(auth);
    return this.adminService.moderateEvent(id, body.action);
  }
}