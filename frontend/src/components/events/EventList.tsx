import { useEffect, useState } from 'react';
import api from '../../api/client';
import EventCard from './EventCard';
import EventFilters from './EventFilters';

interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  imageUrl?: string;
  category: { name: string; slug: string };
  organizer: { name: string };
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', dateFrom: '', dateTo: '' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      params.append('page', String(page));
      params.append('limit', '9');
      const res = await api.get(`/events?${params.toString()}`);
      setEvents(res.data.events);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Ошибка загрузки событий:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [filters, page]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', marginBottom: 24, border: '1px solid #e0f0f5', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 300, height: 300, borderRadius: '50%', background: '#62b6cb', opacity: 0.06 }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#e8f7fb', border: '1px solid #b2dde8', color: '#1a6b7c', fontSize: 12, padding: '5px 14px', borderRadius: 20, marginBottom: 16, fontWeight: 500 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#62b6cb' }} />
          Университетская афиша — 2026
        </div>
        <h1 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 10, color: '#0f2a30' }}>
          Все события вуза<br />в одном месте — <span style={{ color: '#62b6cb' }}>найди своё</span>
        </h1>
        <p style={{ fontSize: 15, color: '#6b8a90', lineHeight: 1.65, marginBottom: 24, maxWidth: 480 }}>
          Лекции, хакатоны, спорт и культурные мероприятия. Записывайся и не пропускай важное.
        </p>
        <div style={{ display: 'flex', gap: 10, maxWidth: 560 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderRadius: 12, border: '1.5px solid #b2dde8', background: '#f4f9fb' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7" cy="7" r="5" stroke="#b0c8ce" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="#b0c8ce" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input
              placeholder="Найти мероприятие..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#333', fontFamily: "'Roboto', sans-serif", background: 'none' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: '#1a6b7c', color: '#fff', fontSize: 14, border: 'none', fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            Найти
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <EventFilters onFilter={(f) => { setFilters(f); setPage(1); }} />

      {/* Статистика */}
      <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
        {[
          { val: total, label: 'мероприятий' },
          { val: 1, label: 'организатор' },
          { val: 0, label: 'регистраций' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 22, fontWeight: 700, color: '#0f2a30' }}>
              {s.val}<span style={{ color: '#62b6cb' }}>+</span>
            </div>
            <div style={{ fontSize: 12, color: '#a0b8be', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Заголовок секции */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30' }}>Ближайшие события</div>
        <div style={{ fontSize: 13, color: '#62b6cb', fontWeight: 500 }}>Смотреть все →</div>
      </div>

      {/* Карточки */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#7a9ea6', padding: 40 }}>Загрузка...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7a9ea6', padding: 40 }}>Мероприятия не найдены</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 20px', borderRadius: 10, border: '1.5px solid #b2dde8', background: '#fff', color: '#1a6b7c', fontWeight: 500, fontSize: 14 }}>
            ← Назад
          </button>
          <span style={{ padding: '8px 16px', color: '#7a9ea6', fontSize: 14 }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '8px 20px', borderRadius: 10, border: '1.5px solid #b2dde8', background: '#fff', color: '#1a6b7c', fontWeight: 500, fontSize: 14 }}>
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}