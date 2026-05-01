import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: { name: string };
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  imageUrl?: string;
  status: string;
  category: { name: string; slug: string };
  organizer: { name: string; email: string };
  reviews: Review[];
  avgRating?: number | null;
  reviewCount?: number;
  registrationCount?: number;
}

const categoryColors: Record<string, { bg: string; tag: string; text: string }> = {
  lecture:   { bg: '#e0f5ff', tag: '#b2e0ec', text: '#1a6b7c' },
  hackathon: { bg: '#e8f5e9', tag: '#c8e6c9', text: '#2e7d32' },
  sport:     { bg: '#fff3e0', tag: '#ffe0b2', text: '#e65100' },
  culture:   { bg: '#fce4ec', tag: '#f8bbd0', text: '#880e4f' },
  science:   { bg: '#ede7f6', tag: '#d1c4e9', text: '#4527a0' },
};

export default function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [registered, setRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Проверяем записан ли пользователь
    const userId = localStorage.getItem('userId');
    if (userId) {
      api.get(`/registrations/check/${userId}/${eventId}`)
        .then(res => setRegistered(res.data.isRegistered))
        .catch(console.error);
    }
  }, [eventId]);

  const handleRegister = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Войдите в аккаунт чтобы записаться');
      navigate('/login');
      return;
    }
    setRegLoading(true);
    try {
      if (registered) {
        await api.delete('/registrations', { data: { userId, eventId } });
        setRegistered(false);
        toast.success('Вы отменили запись на мероприятие');
      } else {
        await api.post('/registrations', { userId, eventId });
        setRegistered(true);
        toast.success('Вы успешно записались на мероприятие! 🎉');
        // Обновляем счётчик
        setEvent(prev => prev ? { ...prev, registrationCount: (prev.registrationCount || 0) + 1 } : prev);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка при записи');
    } finally {
      setRegLoading(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Войдите в аккаунт чтобы оставить отзыв');
      navigate('/login');
      return;
    }
    try {
      await api.post(`/feedback/event/${eventId}`, { userId, rating, comment });
      toast.success('Отзыв успешно добавлен! ✨');
      setComment('');
      window.location.reload();
    } catch {
      toast.error('Ошибка при добавлении отзыва');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: 40, color: '#7a9ea6' }}>Загрузка...</p>;
  if (!event) return <p style={{ textAlign: 'center', padding: 40 }}>Мероприятие не найдено</p>;

  const slug = event.category?.slug || 'lecture';
  const colors = categoryColors[slug] || categoryColors.lecture;
  const date = new Date(event.dateTime);
  const orgInitials = event.organizer.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>

      <button onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e0f0f5', background: '#fff', color: '#7a9ea6', fontSize: 13, fontFamily: "'Roboto', sans-serif", fontWeight: 500, marginBottom: 20 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="#7a9ea6" strokeWidth="1.4" strokeLinecap="round"/></svg>
        Назад к афише
      </button>

      {/* Главная карточка */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: 200, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, background: colors.tag, color: colors.text, fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 10 }}>
            {event.category.name}
          </div>
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <button
              onClick={handleRegister}
              disabled={regLoading}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 12, background: registered ? '#e8f5e9' : '#62b6cb', color: registered ? '#2e7d32' : '#fff', fontSize: 14, border: registered ? '1.5px solid #c8e6c9' : 'none', fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
            >
              {regLoading ? '...' : registered ? (
                <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Записан — отменить</>
              ) : (
                <><div style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>+</div>Записаться</>
              )}
            </button>
          </div>
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
          )}
        </div>

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <h1 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 24, fontWeight: 700, color: '#0f2a30', lineHeight: 1.3, flex: 1 }}>
              {event.title}
            </h1>
            {event.avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff8e1', padding: '6px 12px', borderRadius: 10, marginLeft: 16, flexShrink: 0 }}>
                <span style={{ color: '#f59e0b', fontSize: 16 }}>★</span>
                <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 700, color: '#0f2a30' }}>{event.avgRating}</span>
                <span style={{ fontSize: 12, color: '#a0b8be' }}>({event.reviewCount})</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Дата и время', value: date.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#62b6cb" strokeWidth="1.4" fill="none"/><path d="M8 5v3l2 2" stroke="#62b6cb" strokeWidth="1.4" strokeLinecap="round"/></svg> },
              { label: 'Место проведения', value: event.location, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 9 4 9s4-5.5 4-9c0-2.2-1.8-4-4-4z" stroke="#62b6cb" strokeWidth="1.4" fill="none"/><circle cx="8" cy="6" r="1.5" fill="#62b6cb"/></svg> },
              { label: 'Записалось', value: `${event.registrationCount || 0} человек`, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="#62b6cb" strokeWidth="1.4" fill="none"/><path d="M2 13c0-2.8 1.8-4 4-4s4 1.2 4 4" stroke="#62b6cb" strokeWidth="1.4" strokeLinecap="round" fill="none"/><path d="M11 8c1.5 0 3 .8 3 3" stroke="#62b6cb" strokeWidth="1.4" strokeLinecap="round" fill="none"/><circle cx="12" cy="5" r="2" stroke="#62b6cb" strokeWidth="1.4" fill="none"/></svg> },
              { label: 'Категория', value: event.category.name, icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="#62b6cb"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="#62b6cb" opacity="0.5"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="#62b6cb" opacity="0.5"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="#62b6cb" opacity="0.3"/></svg> },
            ].map(item => (
              <div key={item.label} style={{ background: '#f4f9fb', borderRadius: 12, padding: '14px 16px', border: '1px solid #e0f0f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  {item.icon}
                  <span style={{ fontSize: 11, color: '#a0b8be', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 14, color: '#0f2a30', fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f4f9fb', borderRadius: 12, border: '1px solid #e0f0f5', marginBottom: 24 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#62b6cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {orgInitials}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#a0b8be', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Организатор</div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 14, fontWeight: 600, color: '#0f2a30' }}>{event.organizer.name}</div>
              <div style={{ fontSize: 12, color: '#7a9ea6' }}>{event.organizer.email}</div>
            </div>
          </div>

          <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 15, fontWeight: 600, color: '#0f2a30', marginBottom: 10 }}>Описание</div>
          <p style={{ fontSize: 14, color: '#4a6b72', lineHeight: 1.7 }}>{event.description}</p>
        </div>
      </div>

      {/* Отзывы */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30', marginBottom: 16 }}>
          Отзывы ({event.reviews.length})
        </div>
        {event.reviews.length === 0 ? (
          <p style={{ color: '#a0b8be', fontSize: 14, padding: '16px 0' }}>Отзывов пока нет — будьте первым!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {event.reviews.map(review => (
              <div key={review.id} style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #e8f4f8', background: '#fafcfd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e8f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#62b6cb', border: '1.5px solid #b2dde8' }}>
                      {review.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: 14, fontWeight: 600, color: '#0f2a30' }}>{review.user.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize: 14, color: s <= review.rating ? '#f59e0b' : '#e0f0f5' }}>★</span>
                    ))}
                  </div>
                </div>
                {review.comment && <p style={{ fontSize: 13, color: '#4a6b72', lineHeight: 1.6 }}>{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Форма отзыва */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', padding: '20px 24px' }}>
        <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 600, color: '#0f2a30', marginBottom: 16 }}>Оставить отзыв</div>
        <form onSubmit={handleReview}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: '#7a9ea6', marginBottom: 8, fontWeight: 500 }}>Ваша оценка</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: s <= rating ? '#f59e0b' : '#e0f0f5', padding: '0 2px' }}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Поделитесь впечатлениями о мероприятии..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #b2dde8', minHeight: 90, fontSize: 14, fontFamily: "'Roboto', sans-serif", color: '#0f2a30', background: '#f4f9fb', outline: 'none', resize: 'vertical', marginBottom: 14, boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, background: '#62b6cb', color: '#fff', fontSize: 14, border: 'none', fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>+</div>
            Отправить отзыв
          </button>
        </form>
      </div>
    </div>
  );
}