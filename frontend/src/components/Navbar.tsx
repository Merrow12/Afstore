import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const canCreate = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';

  const navItems = [
    { label: 'Афиша', path: '/events' },
    { label: 'Профиль', path: '/profile' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Админ', path: '/admin' }] : []),
  ];

  return (
    <>
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e0f0f5',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 68,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>

        {/* Логотип */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/events')}>
          <div style={{ position: 'relative', width: 30, height: 40, flexShrink: 0 }}>
            <div style={{ position: 'absolute', width: 30, height: 40, borderRadius: 4, background: '#5B9BD5', transform: 'rotate(-8deg) translate(-4px, 2px)' }} />
            <div style={{ position: 'absolute', width: 30, height: 40, borderRadius: 4, background: '#378ADD', transform: 'rotate(-3deg) translate(-2px, 1px)' }} />
            <div style={{ position: 'absolute', width: 30, height: 40, borderRadius: 4, background: '#185FA5', border: '0.8px solid #85B7EB', display: 'flex', flexDirection: 'column', padding: 4, gap: 2 }}>
              <div style={{ background: 'rgba(230,241,251,0.85)', borderRadius: 2, height: 3, width: '100%' }} />
              <div style={{ background: 'rgba(230,241,251,0.5)', borderRadius: 2, height: 3, width: '76%' }} />
              <div style={{ background: 'rgba(55,138,221,0.7)', borderRadius: 2, height: 12, width: '100%', marginTop: 1 }} />
              <div style={{ background: 'rgba(230,241,251,0.5)', borderRadius: 2, height: 3, width: '76%' }} />
            </div>
          </div>
          <span style={{ fontFamily: "'Lobster', cursive", fontSize: 22, color: '#2E6BB7', lineHeight: 1 }}>
            AFStore
          </span>
        </div>

        {/* Навигация — десктоп */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: '#f4f9fb', borderRadius: 12, padding: 4,
          border: '1px solid #e0f0f5',
        }}>
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 13,
              color: location.pathname === item.path ? '#1a6b7c' : '#7a9ea6',
              border: 'none', fontFamily: "'Roboto', sans-serif", fontWeight: 500,
              background: location.pathname === item.path ? '#fff' : 'none',
              boxShadow: location.pathname === item.path ? '0 1px 4px rgba(98,182,203,0.2)' : 'none',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Правая часть */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              {/* Кнопка создать событие для организаторов */}
              {canCreate && (
                <button onClick={() => navigate('/events/create')} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10,
                  background: '#e8f7fb', color: '#1a6b7c',
                  fontSize: 13, border: '1.5px solid #b2dde8',
                  fontFamily: "'Roboto', sans-serif", fontWeight: 500,
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: '#62b6cb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, lineHeight: 1 }}>+</div>
                  Создать событие
                </button>
              )}

              {/* Уведомления */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: '#f4f9fb', border: '1px solid #e0f0f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2a4 4 0 0 0-4 4v3l-1.5 2h11L12 9V6a4 4 0 0 0-4-4z" stroke="#7a9ea6" strokeWidth="1.4" fill="none"/>
                    <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="#7a9ea6" strokeWidth="1.4" fill="none"/>
                  </svg>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#62b6cb', border: '2px solid #fff' }} />
              </div>

              {/* Имя пользователя */}
              <button onClick={() => navigate('/profile')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 10, background: 'none',
                color: '#62b6cb', fontSize: 13, border: '1.5px solid #b2dde8',
                fontFamily: "'Roboto', sans-serif", fontWeight: 500,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#62b6cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                  {user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 10, background: 'none',
                color: '#62b6cb', fontSize: 13, border: '1.5px solid #b2dde8',
                fontFamily: "'Roboto', sans-serif", fontWeight: 500,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="5" r="2.5" stroke="#62b6cb" strokeWidth="1.3"/>
                  <path d="M2 12c0-2.8 2.2-4 5-4s5 1.2 5 4" stroke="#62b6cb" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Войти
              </button>
              <button onClick={() => navigate('/register')} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 20px', borderRadius: 10, background: '#62b6cb',
                color: '#fff', fontSize: 13, border: 'none',
                fontFamily: "'Roboto', sans-serif", fontWeight: 500,
              }}>
                Регистрация
                <div style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            </>
          )}

          {/* Бургер для мобильных */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Открыть меню"
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#f4f9fb', border: '1px solid #e0f0f5',
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="#7a9ea6" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #e0f0f5',
          padding: '16px 24px', zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          {navItems.map(item => (
            <button key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              style={{
                padding: '12px 16px', borderRadius: 10, fontSize: 15,
                color: location.pathname === item.path ? '#1a6b7c' : '#0f2a30',
                border: 'none', fontFamily: "'Roboto', sans-serif", fontWeight: 500,
                background: location.pathname === item.path ? '#e8f7fb' : '#f4f9fb',
                textAlign: 'left', cursor: 'pointer',
              }}>
              {item.label}
            </button>
          ))}
          {canCreate && (
            <button
              onClick={() => { navigate('/events/create'); setMenuOpen(false); }}
              style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, color: '#1a6b7c', border: 'none', fontFamily: "'Roboto', sans-serif", fontWeight: 500, background: '#e8f7fb', textAlign: 'left', cursor: 'pointer' }}
            >
              + Создать событие
            </button>
          )}
          {!user && (
            <>
              <button onClick={() => { navigate('/login'); setMenuOpen(false); }}
                style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, color: '#62b6cb', border: '1.5px solid #b2dde8', fontFamily: "'Roboto', sans-serif", fontWeight: 500, background: '#fff', cursor: 'pointer' }}>
                Войти
              </button>
              <button onClick={() => { navigate('/register'); setMenuOpen(false); }}
                style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, color: '#fff', border: 'none', fontFamily: "'Roboto', sans-serif", fontWeight: 500, background: '#62b6cb', cursor: 'pointer' }}>
                Регистрация
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}