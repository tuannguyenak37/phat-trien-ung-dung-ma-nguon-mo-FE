import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  
  const hasRefreshToken = request.cookies.has('refresh_token'); 
  
  const { pathname } = request.nextUrl;
  

  const authPaths = ['/auth/login', '/login', '/register'];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));


  if (hasRefreshToken) {
   
   
    // Cho qua các trang khác
    return NextResponse.next(); 
  }

  
  if (!hasRefreshToken) {

    if (!isAuthPage) {
      const loginUrl = new URL('/auth/login', request.url);
    
      loginUrl.searchParams.set('redirect_url', pathname); 
      return NextResponse.redirect(loginUrl); 
    }
    // Cho qua nếu đang vào trang Login
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {

  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}