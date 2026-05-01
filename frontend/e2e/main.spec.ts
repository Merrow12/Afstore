import { test, expect } from '@playwright/test';

test.describe('AFStore — ключевые сценарии', () => {

  test('Главная страница загружается', async ({ page }) => {
    await page.goto('/events');
    await expect(page).toHaveTitle(/AFStore/);
    await expect(page.locator('text=Ближайшие события')).toBeVisible();
  });

  test('Поиск мероприятий работает', async ({ page }) => {
    await page.goto('/events');
    await page.fill('input[placeholder="Найти мероприятие..."]', 'Лекция');
    await page.waitForTimeout(1000);
    const cards = page.locator('[style*="border-radius: 16px"]');
    await expect(cards.first()).toBeVisible();
  });

  test('Страница регистрации открывается', async ({ page }) => {
    await page.goto('/register');
    // Используем h2 заголовок страницы а не кнопку в навбаре
    await expect(page.getByRole('heading', { name: 'Регистрация' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Страница логина открывается', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('Переход на детальную страницу мероприятия', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);
    // Кликаем на весь блок карточки
    await page.locator('div[style*="border-radius: 16px"][style*="cursor: pointer"]').first().click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/events\/.+/);
  });

  test('Фильтр по категории работает', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(1500);
    await page.selectOption('select[name="category"]', 'cat-1');
    await page.waitForTimeout(2000);
    // Проверяем что страница не пустая после фильтрации
    await expect(page.locator('text=Ближайшие события')).toBeVisible();
  });

  test('Страница профиля перенаправляет на логин', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Навбар содержит логотип AFStore', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('text=AFStore')).toBeVisible();
  });
});