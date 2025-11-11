import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();

    // Simple passphrase checking (as requested for prototype)
    if (passphrase === 'admin') {
      // Create a simple session
      const response = NextResponse.json({ success: true });
      
      // Set a session cookie
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 3, // 3 hours
        path: '/'
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid passphrase' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}