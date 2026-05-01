import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function PasswordReset() {
  const [step, setStep] = useState<'email' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/password-reset', { email });
      toast.success('Запрос отправлен! Введите новый пароль.');
      setStep('newPassword');
    } catch {
      toast.error('Ошибка отправки запроса');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Пароль должен быть не менее 8 символов');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/password-reset/confirm', { email, newPassword });
      toast.success('Пароль успешно изменён! 🎉');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      toast.error('Ошибка смены пароля');
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
    marginBottom: 12,
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0f0f5', overflow: 'hidden' }}>

        <div style={{ background: 'linear-gradient(135deg, #e8f7fb 0%, #f4f9fb 100%)', padding: '28px 28px 20px', borderBottom: '1px solid #e0f0f5' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e8f7fb', border: '1.5px solid #b2dde8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="9" width="12" height="9" rx="2" stroke="#62b6cb" strokeWidth="1.5" fill="none"/>
              <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="#62b6cb" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="1.5" fill="#62b6cb"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 20, fontWeight: 700, color: '#0f2a30', marginBottom: 4 }}>
            {step === 'email' ? 'Восстановление пароля' : 'Новый пароль'}
          </h2>
          <p style={{ fontSize: 13, color: '#7a9ea6' }}>
            {step === 'email'
              ? 'Введите email вашего аккаунта'
              : `Придумайте новый пароль для ${email}`}
          </p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <label style={{ fontSize: 12, color: '#7a9ea6', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', borderRadius: 12, background: loading ? '#a0b8be' : '#62b6cb', color: '#fff', fontSize: 14, border: 'none', fontWeight: 600, fontFamily: "'Roboto', sans-serif", marginBottom: 12 }}>
                {loading ? 'Отправка...' : 'Продолжить'}
              </button>
              <button type="button" onClick={() => navigate('/login')} style={{ width: '100%', padding: '11px', borderRadius: 12, background: '#f4f9fb', color: '#7a9ea6', fontSize: 14, border: '1px solid #e0f0f5', fontFamily: "'Roboto', sans-serif" }}>
                Вернуться к входу
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <label style={{ fontSize: 12, color: '#7a9ea6', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Новый пароль</label>
              <input
                type="password"
                placeholder="Минимум 8 символов"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <label style={{ fontSize: 12, color: '#7a9ea6', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>Подтвердите пароль</label>
              <input
                type="password"
                placeholder="Повторите пароль"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', borderRadius: 12, background: loading ? '#a0b8be' : '#62b6cb', color: '#fff', fontSize: 14, border: 'none', fontWeight: 600, fontFamily: "'Roboto', sans-serif", marginBottom: 12 }}>
                {loading ? 'Сохранение...' : 'Сохранить пароль'}
              </button>
              <button type="button" onClick={() => setStep('email')} style={{ width: '100%', padding: '11px', borderRadius: 12, background: '#f4f9fb', color: '#7a9ea6', fontSize: 14, border: '1px solid #e0f0f5', fontFamily: "'Roboto', sans-serif" }}>
                Назад
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}