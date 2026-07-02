import { Metadata } from 'next';
import LoginForm from './form';

export const metadata: Metadata = {
  title: 'Вход в систему',
};

export default function LoginPage() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
  );
}
