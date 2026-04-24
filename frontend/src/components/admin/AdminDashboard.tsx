import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  recentEvents: { id: string; title: string; status: string; createdAt: string; category: { name: string } }[];
}

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  PUBLISHED: { bg: '#e8f5e9', color: '#2e7d32', label: 'Опубликовано' },
  DRAFT:     { bg: '#fff8e1', color: '#f57f17', label: 'На модерации' },
  CANCELLED: { bg: '#fce4ec', color: '#c62828', label: 'Отклонено' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch { alert('Ошибка изменения роли'); }
  };

  const handleModerate = async (eventId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await api.patch(`/admin/events/${eventId}/moderate`, { action });
      window.location.reload();
    } catch { alert('Ошибка модерации'); }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: 40, color: '#7a9ea6' }}>Загрузка...</p>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff8e1', border: '1px solid #ffe082', color: '#f57f17', fontSize: 12, padding: '4px 12px', borderRadius: 20, marginBottom: 8, fontWeight: 500 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f57f17' }} />
            Панель управления
          </div>
          <h1 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 26, fontWeight: 700, color: '#0f2a30' }}>
            Администрирование
          </h1>
        </div>
        <button onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, background: '#fff', border: '1.5px solid #e0f0f5', color: '#7a9ea6', fontSize: 13, fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="#7a9ea6" strokeWidth="1.4" strokeLinecap="round"/></svg>
          На афишу
        </button>
      </div>

      {/* Статистика */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Пользователей', value: stats?.totalUsers, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="7" r="3" stroke="#62b6cb" strokeWidth="1.5" fill="none"/><path d="M2 17c0-4 2.7-6 6-6s6 2 6 6" stroke="#62b6cb" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="15" cy="8" r="2.5" stroke="#62b6cb" strokeWidth="1.3" fill="none"/><path d="M18 16c0-2.5-1.5-4-3-4" stroke="#62b6cb" strokeWidth="1.3" strokeLinecap="round"/></svg>, bg: '#e8f7fb', border: '#b2dde8' },
          { label: 'Мероприятий',   value: stats?.totalEvents, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="12" rx="3" stroke="#4caf50" strokeWidth="1.5" fill="none"/><rect x="3" y="5" width="14" height="5" rx="3" fill="#e8f5e9"/><circle cx="7" cy="15" r="1" fill="#4caf50"/><circle cx="10" cy="15" r="1" fill="#4caf50"/><circle cx="13" cy="15" r="1" fill="#4caf50"/></svg>, bg: '#e8f5e9', border: '#c8e6c9' },
          { label: 'Регистраций',   value: stats?.totalRegistrations, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, bg: '#ede7f6', border: '#d1c4e9' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${card.border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 26, fontWeight: 700, color: '#0f2a30', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: '#a0b8be', marginTop: 4 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Последние мероприятия */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30', marginBottom: 16 }}>
          Последние мероприятия
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats?.recentEvents.map(event => {
            const s = statusStyle[event.status] || statusStyle.DRAFT;
            return (
              <div key={event.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, border: '1px solid #e8f4f8', background: '#fafcfd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#e8f7fb', color: '#1a6b7c', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8 }}>{event.category.name}</span>
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: 14, fontWeight: 600, color: '#0f2a30' }}>{event.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8 }}>{s.label}</span>
                  {event.status === 'DRAFT' && (
                    <>
                      <button onClick={() => handleModerate(event.id, 'APPROVE')}
                        style={{ padding: '5px 12px', borderRadius: 8, background: '#e8f5e9', color: '#2e7d32', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                        ✓ Одобрить
                      </button>
                      <button onClick={() => handleModerate(event.id, 'REJECT')}
                        style={{ padding: '5px 12px', borderRadius: 8, background: '#fce4ec', color: '#c62828', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                        ✗ Отклонить
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Пользователи */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', padding: '20px 24px' }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30', marginBottom: 16 }}>
          Пользователи
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {users.map(user => {
            const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, border: '1px solid #e8f4f8', background: '#fafcfd' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e8f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#62b6cb', border: '1.5px solid #b2dde8', flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 14, fontWeight: 600, color: '#0f2a30' }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: '#a0b8be' }}>{user.email}</div>
                </div>
                <div style={{ fontSize: 12, color: '#7a9ea6', marginRight: 16 }}>{user.faculty || '—'}</div>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e0f0f5', fontSize: 13, fontFamily: "'Roboto', sans-serif", color: '#0f2a30', background: '#f4f9fb', outline: 'none' }}
                >
                  <option value="STUDENT">Студент</option>
                  <option value="ORGANIZER">Организатор</option>
                  <option value="ADMIN">Админ</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}