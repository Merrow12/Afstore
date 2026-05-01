import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {

  // Заглушка — имитация получения расписания из LMS
  async getLmsSchedule(facultyId?: string) {
    return {
      source: 'LMS Integration (stub)',
      facultyId: facultyId || 'all',
      schedule: [
        {
          id: 'lms-1',
          title: 'Лекция: Алгоритмы и структуры данных',
          dateTime: '2026-05-05T10:00:00',
          location: 'Аудитория 301',
          faculty: 'ИТ',
          professor: 'Иванов А.А.',
          type: 'lecture',
        },
        {
          id: 'lms-2',
          title: 'Практика: Базы данных',
          dateTime: '2026-05-06T12:00:00',
          location: 'Компьютерный класс 205',
          faculty: 'ИТ',
          professor: 'Петров Б.Б.',
          type: 'practice',
        },
        {
          id: 'lms-3',
          title: 'Семинар: Машинное обучение',
          dateTime: '2026-05-07T14:00:00',
          location: 'Лаборатория 102',
          faculty: 'ИТ',
          professor: 'Сидоров В.В.',
          type: 'seminar',
        },
      ],
    };
  }

  // Заглушка — имитация получения списка студентов из LMS
  async getLmsStudents(groupId?: string) {
    return {
      source: 'LMS Integration (stub)',
      groupId: groupId || 'all',
      students: [
        { id: 'st-1', name: 'Алексей Иванов', group: '24б-ИТ', email: 'ivanov@university.ru' },
        { id: 'st-2', name: 'Мария Петрова', group: '24б-ИТ', email: 'petrova@university.ru' },
        { id: 'st-3', name: 'Дмитрий Сидоров', group: '24б-ИТ', email: 'sidorov@university.ru' },
      ],
    };
  }

  // Заглушка — синхронизация событий AFStore с LMS
  async syncEventsToLms(eventIds: string[]) {
    return {
      source: 'LMS Integration (stub)',
      status: 'success',
      syncedCount: eventIds.length,
      message: `Синхронизировано ${eventIds.length} событий с LMS`,
      syncedAt: new Date().toISOString(),
    };
  }
}