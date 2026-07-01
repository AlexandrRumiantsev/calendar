import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Получен запрос от клиента: email', email);
    console.log('Получен запрос от клиента: password', password);


    // --- НАЧАЛО: ЗАПРОС К ВАШЕМУ БЭКЕНДУ ---
    const backendUrl = 'https://ваш-бэкэнд.com/api/generate-token'; // <-- ЗАМЕНИТЕ НА URL ВАШЕГО ЭНДПОИНТА

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Если вашему бэкенду нужны другие заголовки (например, API Key), добавьте их здесь
        // 'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({ email, password }),
    });


    if (backendResponse.ok) {
      // Ваш бэкенд должен вернуть объект пользователя или токен
      const userData = await backendResponse.json();
      
      // Возвращаем ответ в формате, который ждет next-auth/react
      return NextResponse.json({ user: userData }, { status: 200 });

    } else {
      // Если бэкенд вернул ошибку (например, неверный пароль)
      const errorData = await backendResponse.json();
      const errorMessage = errorData.message || 'Ошибка авторизации на сервере';

      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

  } catch (error) {
    // Эта ошибка возникнет, если бэкенд недоступен (сетевая ошибка)
    console.error('Ошибка сети:', error);
    return NextResponse.json(
      { error: 'Сервер недоступен. Проверьте консоль разработчика.' },
      { status: 500 }
    );
  }
}