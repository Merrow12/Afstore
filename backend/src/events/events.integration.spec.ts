import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { EventsService } from './events.service';

const mockEventsService = {
  findAll: jest.fn().mockResolvedValue({
    events: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  }),
  findOne: jest.fn().mockRejectedValue({ status: 404, message: 'Not Found' }),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  remove: jest.fn().mockResolvedValue({}),
};

describe('Events API (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EventsService)
      .useValue(mockEventsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /events — должен вернуть список событий', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('events');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.events)).toBe(true);
      });
  });

  it('GET /events?search=тест — должен фильтровать по поиску', () => {
    return request(app.getHttpServer())
      .get('/events?search=тест')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('events');
      });
  });

  it('GET /events?page=1&limit=9 — должен поддерживать пагинацию', () => {
    return request(app.getHttpServer())
      .get('/events?page=1&limit=9')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('totalPages');
      });
  });
});