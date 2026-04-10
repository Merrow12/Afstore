import { useState } from 'react';
import api from '../../api/client';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/password-reset', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Письмо отправлено</h2>
        <p>Проверьте почту {email} — мы отправили ссылку для сброса пароля.</p>
        <a href="/login">Вернуться к входу</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Восстановление пароля</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email" placeholder="Ваш Email" required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: 10, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          {loading ? 'Отправка...' : 'Отправить ссылку'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        <a href="/login">Вернуться к входу</a>
      </p>
    </div>
  );
}