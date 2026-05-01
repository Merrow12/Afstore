import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  faculty?: string;
}

interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  category: { name: string; slug: string };
}

const roleLabels: Record<string, { label: string; bg: string; color: string }> = {
  STUDENT:   { label: 'Студент',     bg: '#e8f7fb', color: '#1a6b7c' },
  ORGANIZER: { label: 'Организатор', bg: '#e8f5e9', color: '#2e7d32' },
  ADMIN:     { label: 'Админ',       bg: '#fff3e0', color: '#e65100' },
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'ORGANIZER' || user.role === 'ADMIN') {
      api.get(`/events?organizerId=${user.id}`)
        .then(res => setEvents(res.data.events))
        .catch(console.error);
    } else {
      api.get(`/registrations/user/${user.id}`)
        .then(res => setEvents(res.data.map((r: any) => r.event)))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <p style={{ textAlign: 'center', padding: 40 }}>Загрузка...</p>;

  const role = roleLabels[user.role] || roleLabels.STUDENT;
  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const isOrganizer = user.role === 'ORGANIZER' || user.role === 'ADMIN';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>

      {/* Карточка профиля */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', overflow: 'hidden', marginBottom: 24 }}>

        {/* Шапка */}
        <div style={{ background: 'linear-gradient(135deg, #e8f7fb 0%, #f4f9fb 100%)', padding: '32px 28px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: '#62b6cb', opacity: 0.07 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#62b6cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: "'Roboto Slab', serif", border: '3px solid #fff', boxShadow: '0 2px 12px rgba(98,182,203,0.3)' }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 22, fontWeight: 700, color: '#0f2a30', marginBottom: 6 }}>
                {user.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: role.bg, color: role.color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 8 }}>
                  {role.label}
                </span>
                {user.faculty && (
                  <span style={{ fontSize: 13, color: '#7a9ea6' }}>· {user.faculty}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Детали */}
        <div style={{ padding: '20px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#f4f9fb', borderRadius: 10, padding: '12px 16px', border: '1px solid #e0f0f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="2" stroke="#b0c8ce" strokeWidth="1.2" fill="none"/><path d="M1 5l6 4 6-4" stroke="#b0c8ce" strokeWidth="1.2"/></svg>
                <span style={{ fontSize: 11, color: '#a0b8be', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</span>
              </div>
              <div style={{ fontSize: 14, color: '#0f2a30', fontWeight: 500 }}>{user.email}</div>
            </div>
            <div style={{ background: '#f4f9fb', borderRadius: 10, padding: '12px 16px', border: '1px solid #e0f0f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="8" rx="2" stroke="#b0c8ce" strokeWidth="1.2" fill="none"/><path d="M5 4V3a2 2 0 0 1 4 0v1" stroke="#b0c8ce" strokeWidth="1.2"/></svg>
                <span style={{ fontSize: 11, color: '#a0b8be', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Факультет</span>
              </div>
              <div style={{ fontSize: 14, color: '#0f2a30', fontWeight: 500 }}>{user.faculty || 'Не указан'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {isOrganizer && (
              <button
                onClick={() => navigate('/events/create')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 10, background: '#62b6cb', color: '#fff', fontSize: 13, border: 'none', fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
              >
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>+</div>
                Создать мероприятие
              </button>
            )}
            <button
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 10, background: '#fff0f0', color: '#c0392b', fontSize: 13, border: '1.5px solid #fcc', fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7h7M9 4l3 3-3 3" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round"/><path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Мероприятия */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', padding: '20px 24px' }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30', marginBottom: 16 }}>
          {isOrganizer ? 'Мои мероприятия' : 'Мои записи'}
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#a0b8be' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
              <rect x="6" y="10" width="28" height="24" rx="5" fill="#e8f7fb"/>
              <rect x="6" y="10" width="28" height="8" rx="5" fill="#b2dde8"/>
              <circle cx="20" cy="26" r="4" fill="#b2dde8"/>
            </svg>
            <p style={{ fontSize: 14, marginBottom: 8 }}>
              {isOrganizer ? 'Нет мероприятий' : 'Вы ещё не записались ни на одно мероприятие'}
            </p>
            {!isOrganizer && (
              <button
                onClick={() => navigate('/events')}
                style={{ padding: '8px 20px', borderRadius: 10, background: '#62b6cb', color: '#fff', border: 'none', fontSize: 13, fontFamily: "'Roboto', sans-serif", fontWeight: 500, cursor: 'pointer' }}
              >
                Перейти к афише
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {events.map(event => {
              if (!event) return null;
              const date = new Date(event.dateTime);
              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, border: '1px solid #e8f4f8', cursor: 'pointer', background: '#fafcfd' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e8f7fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 700, color: '#1a6b7c', lineHeight: 1 }}>{date.getDate()}</div>
                    <div style={{ fontSize: 9, color: '#a0b8be', textTransform: 'uppercase' }}>{date.toLocaleString('ru-RU', { month: 'short' })}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 14, fontWeight: 600, color: '#0f2a30', marginBottom: 4 }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: '#7a9ea6' }}>📍 {event.location}</div>
                  </div>
                  {event.category && (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8, background: '#e8f7fb', color: '#1a6b7c', flexShrink: 0 }}>
                      {event.category.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}