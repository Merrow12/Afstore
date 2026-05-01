import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CreateEventForm() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
      toast.error('Доступ только для организаторов');
      navigate('/events');
      return;
    }
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => {
        // Если нет endpoint — используем заглушку
        setCategories([
          { id: 'cat-1', name: 'Лекция', slug: 'lecture' },
          { id: 'cat-2', name: 'Хакатон', slug: 'hackathon' },
          { id: 'cat-3', name: 'Спорт', slug: 'sport' },
          { id: 'cat-4', name: 'Культура', slug: 'culture' },
          { id: 'cat-5', name: 'Наука', slug: 'science' },
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.dateTime || !form.location || !form.categoryId) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events', {
        ...form,
        dateTime: new Date(form.dateTime),
        organizerId: user.id,
        status: user.role === 'ADMIN' ? 'PUBLISHED' : 'DRAFT',
      });
      toast.success(user.role === 'ADMIN'
        ? 'Мероприятие опубликовано! 🎉'
        : 'Мероприятие отправлено на модерацию! ✨'
      );
      navigate('/events');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка при создании мероприятия');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 16px',
    borderRadius: 12,
    border: '1.5px solid #b2dde8',
    fontSize: 14,
    fontFamily: "'Roboto', sans-serif",
    color: '#0f2a30',
    background: '#f4f9fb',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontSize: 12,
    color: '#7a9ea6',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
    display: 'block',
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>

      <button onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e0f0f5', background: '#fff', color: '#7a9ea6', fontSize: 13, fontFamily: "'Roboto', sans-serif", fontWeight: 500, marginBottom: 20 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="#7a9ea6" strokeWidth="1.4" strokeLinecap="round"/></svg>
        Назад к афише
      </button>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', overflow: 'hidden' }}>
        {/* Шапка */}
        <div style={{ background: 'linear-gradient(135deg, #e8f7fb 0%, #f4f9fb 100%)', padding: '28px 28px 24px', borderBottom: '1px solid #e0f0f5' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #b2dde8', color: '#1a6b7c', fontSize: 12, padding: '4px 12px', borderRadius: 20, marginBottom: 12, fontWeight: 500 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#62b6cb' }} />
            {user?.role === 'ADMIN' ? 'Публикация события' : 'Новое мероприятие'}
          </div>
          <h1 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 24, fontWeight: 700, color: '#0f2a30', marginBottom: 6 }}>
            Создать мероприятие
          </h1>
          <p style={{ fontSize: 14, color: '#7a9ea6' }}>
            {user?.role === 'ADMIN'
              ? 'Мероприятие будет опубликовано сразу'
              : 'Мероприятие будет отправлено на модерацию администратору'}
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div>
            <label style={labelStyle}>Название *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Например: Лекция по машинному обучению"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Описание *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Подробное описание мероприятия..."
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Дата и время *</label>
              <input
                type="datetime-local"
                value={form.dateTime}
                onChange={e => setForm({ ...form, dateTime: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Категория *</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                style={inputStyle}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Место проведения *</label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Например: Аудитория 101, корпус А"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Ссылка на изображение (необязательно)</label>
            <input
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
            />
          </div>

          {/* Превью */}
          {form.imageUrl && (
            <div>
              <label style={labelStyle}>Превью изображения</label>
              <img
                src={form.imageUrl}
                alt="preview"
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid #e0f0f5' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: loading ? '#a0b8be' : '#62b6cb', color: '#fff', fontSize: 15, border: 'none', fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
            >
              {loading ? 'Создание...' : (
                <>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>+</div>
                  {user?.role === 'ADMIN' ? 'Опубликовать' : 'Отправить на модерацию'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', color: '#7a9ea6', fontSize: 15, border: '1.5px solid #e0f0f5', fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}