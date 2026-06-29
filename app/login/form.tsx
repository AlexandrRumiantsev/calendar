
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.status === 200) {
      router.push('/');
    } else {
      const data = await res.json();
      setErrorMsg(data.error || 'Ошибка входа');
      console.log('API вернул ошибку:', data);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">Авторизация</h2>

      {errorMsg && (
        <p className="mb-4 text-red-600 text-sm text-center">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={!formData.email || !formData.password}
          className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${formData.email && formData.password
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Войти
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          Забыли пароль?
        </Link>
      </div>
    </div>
  );
}