import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {

    const form = await request.json();
    const backendBaseUrl = 'https://task-planer-api.vercel.app'; 
    
    const response = await fetch(`${backendBaseUrl}/api/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
  
    return NextResponse.json({ 
      success: true,
      data,
    }, { status: 200 });
    

  } catch (error) {
    console.error('Ошибка сети:', error);
    return NextResponse.json(
      { error: 'Сервер недоступен. Проверьте консоль разработчика.' },
      { status: 500 }
    );
  }
}