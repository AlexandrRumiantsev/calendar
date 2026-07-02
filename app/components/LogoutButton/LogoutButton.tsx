'use client';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { setAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setAuthenticated(false);
    router.push('/login');
  };

  return <button onClick={handleLogout} className="mt-4">Выйти из системы</button>;
}