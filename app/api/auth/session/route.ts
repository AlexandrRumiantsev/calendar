import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Получаем секрет из переменных окружения (в .env)
  const secret = process.env.NEXTAUTH_SECRET;

  console.log('request',request)
  
  /*
  if (!secret) {
    return NextResponse.json({ error: 'NEXTAUTH_SECRET not set' }, { status: 500 });
  }
    */

  try {
    // Пытаемся достать токен из куки запроса
    /*const token = await getToken({
      req: request,
      secret: secret,
    });*/
    const token = null;

    // Если токен есть - возвращаем его как объект { user }
    if (token) {
      //return NextResponse.json({ user: token }, { status: 200 });
    } else {
      // Если токена нет - возвращаем пустой объект
      //return NextResponse.json({ user: null }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Ошибка при получении сессии:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}