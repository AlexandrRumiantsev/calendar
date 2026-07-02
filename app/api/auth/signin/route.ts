import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    const backendBaseUrl = 'https://task-planer-api.vercel.app'; 
    
    const tokenResponse = await fetch(`${backendBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return NextResponse.json(
        { error: errorText || 'Неверный логин или пароль.' },
        { status: tokenResponse.status }
      );
    }

    const userData = await tokenResponse.json();

    if (!userData.access_token) {
      console.error('Бэкенд вернул успех, но без access_token.');
      return NextResponse.json(
        { error: 'Ошибка авторизации. Токен не получен.' },
        { status: 500 }
      );
    }

    const profileResponse = await fetch(`${backendBaseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userData.access_token}`
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Сессия недействительна.' },
        { status: profileResponse.status }
      );
    }

    const profileData = await profileResponse.json();

    return NextResponse.json({ 
      success: true,
      user: profileData,
      token: userData.access_token,
    }, { status: 200 });

  } catch (error) {
    console.error('Ошибка сети:', error);
    return NextResponse.json(
      { error: 'Сервер недоступен. Проверьте консоль разработчика.' },
      { status: 500 }
    );
  }
}