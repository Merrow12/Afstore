import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Нарастаем до 100 пользователей
    { duration: '1m',  target: 1000 }, // Держим 1000 пользователей
    { duration: '30s', target: 0 },    // Снижаем до 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% запросов быстрее 2 сек
    http_req_failed:   ['rate<0.01'],  // Менее 1% ошибок
  },
};

export default function () {
  // Тест главной страницы событий
  const eventsRes = http.get('http://localhost:3000/events?page=1&limit=9');
  check(eventsRes, {
    'events status 200':        r => r.status === 200,
    'events response time < 1s': r => r.timings.duration < 1000,
  });

  sleep(0.5);

  // Тест поиска
  const searchRes = http.get('http://localhost:3000/events?search=lekcia');
  check(searchRes, {
    'search status 200': r => r.status === 200,
    'search response time < 1s': r => r.timings.duration < 1000,
  });

  sleep(0.5);

  // Тест популярных рекомендаций
  const recRes = http.get('http://localhost:3000/recommendations/popular');
  check(recRes, {
    'recommendations status 200': r => r.status === 200,
  });

  sleep(1);
}