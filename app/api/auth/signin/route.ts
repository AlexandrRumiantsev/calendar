import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  const { email, password } = await request.json();

  console.log('email',email)
  console.log('password',password)


  // Просто возвращаем успех, чтобы проверить работу редиректа
  return NextResponse.json({
        user: {
          id: 'user-123',
          name: 'Тестовый Пользователь',
          email: email,
        },
      }, { status: 200 });
}



