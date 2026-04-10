import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const mockEventsService = {
  findAll: jest.fn().mockResolvedValue({ events: [], total: 0 }),
  findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Test' }),
  create: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest.fn().mockResolvedValue({ id: '1' }),
  remove: jest.fn().mockResolvedValue({}),
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(() => {
    controller = new EventsController(mockEventsService as unknown as EventsService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('должен возвращать список событий', async () => {
    const result = await controller.findAll();
    expect(result).toHaveProperty('events');
    expect(mockEventsService.findAll).toHaveBeenCalled();
  });

  it('должен возвращать одно событие', async () => {
    const result = await controller.findOne('1');
    expect(result).toHaveProperty('id');
    expect(mockEventsService.findOne).toHaveBeenCalledWith('1');
  });
});