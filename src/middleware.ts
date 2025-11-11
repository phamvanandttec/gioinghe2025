import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (excluding login page)

  if ((request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) &&
      !request.nextUrl.pathname.startsWith('/XX_afternoon/login')) {
    
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin-session')?.value === 'authenticated';
    
    if (!isAuthenticated) {
      // Return 401 Unauthorized for API routes
      if (request.nextUrl.pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized access' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Redirect to login page for other admin routes
      return NextResponse.redirect(new URL('/XX_afternoon/login', request.url));
    }
  }

  return NextResponse.next();
}

