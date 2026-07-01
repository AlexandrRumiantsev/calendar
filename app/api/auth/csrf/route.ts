import { getCsrfToken } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const csrfToken = await getCsrfToken({ req: request });
    return NextResponse.json({ csrfToken: csrfToken }, { status: 200 });
    
  } catch (error) {
    console.error('Ошибка при генерации CSRF токена:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}