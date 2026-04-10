import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';

const mockNotifyService = {
  sendEventAnnouncement: jest.fn().mockResolvedValue({}),
  getNotifications: jest.fn().mockResolvedValue([]),
  markAsRead: jest.fn().mockResolvedValue({}),
};

describe('NotifyController', () => {
  let controller: NotifyController;

  beforeEach(() => {
    controller = new NotifyController(mockNotifyService as unknown as NotifyService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });
});