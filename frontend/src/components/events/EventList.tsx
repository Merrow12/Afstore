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
  category: { name: string };
  organizer: { name: string };
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '', category: '', dateFrom: '', dateTo: ''
  });

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

  useEffect(() => {
    fetchEvents();
  }, [filters, page]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>📅 Афиша мероприятий</h1>

      <EventFilters onFilter={(f) => { setFilters(f); setPage(1); }} />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Загрузка...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Мероприятия не найдены</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20
        }}>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}
          >
            ← Назад
          </button>
          <span style={{ padding: '8px 16px' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}