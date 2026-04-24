import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import PasswordReset from './components/auth/PasswordReset';
import EventList from './components/events/EventList';
import EventDetail from './components/events/EventDetail';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <EventDetail eventId={id!} />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/events" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;