import toast from 'react-hot-toast';
import { useState } from 'react';
import api from '../../api/client';

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: '', password: '', name: '', faculty: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('userId', res.data.user.id);
      toast.success('Аккаунт создан! Добро пожаловать 🎉');
      setTimeout(() => window.location.href = '/events', 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      toast.error('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Регистрация</h2>
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
            type="password" placeholder="Пароль (мин. 8 символов)" required minLength={8}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text" placeholder="Имя" required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text" placeholder="Факультет"
            value={form.faculty}
            onChange={e => setForm({ ...form, faculty: e.target.value })}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: 10, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 12 }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
}