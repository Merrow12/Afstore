import toast from 'react-hot-toast';
import { useState } from 'react';
import api from '../../api/client';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('userId', res.data.user.id);
      toast.success(`Добро пожаловать, ${res.data.user.name}! 👋`);
      setTimeout(() => window.location.href = '/events', 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
      toast.error('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Вход</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email" placeholder="Email" required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password" placeholder="Пароль" required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: 10, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
      </p>
      <p style={{ textAlign: 'center' }}>
        <a href="/password-reset">Забыли пароль?</a>
      </p>
    </div>
  );
}