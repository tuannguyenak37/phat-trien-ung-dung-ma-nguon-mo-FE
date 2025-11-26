import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 👇 QUAN TRỌNG: Kiểm tra cookie Refresh Token 
  // (Thay 'refresh_token' bằng tên chính xác Backend bạn đặt cho cookie)
  const hasRefreshToken = request.cookies.has('refresh_token'); 
  
  const { pathname } = request.nextUrl;
  
  // Các trang chỉ dành cho khách (chưa login)
  const authPaths = ['/auth/login', '/login', '/register'];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP (Có Cookie Refresh Token)
  if (hasRefreshToken) {
    // Nếu cố vào trang Login -> Đá về Home
   
    // Cho qua các trang khác
    return NextResponse.next(); 
  }

  // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (Không có Cookie)
  if (!hasRefreshToken) {
    // Nếu KHÔNG phải trang Auth (tức là đang vào trang bảo mật như /profile) -> Đá về Login
    if (!isAuthPage) {
      const loginUrl = new URL('/auth/login', request.url);
      // (Option) Gắn thêm url cũ để login xong quay lại
      loginUrl.searchParams.set('redirect_url', pathname); 
      return NextResponse.redirect(loginUrl); 
    }
    // Cho qua nếu đang vào trang Login
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Chạy trên mọi route trừ file tĩnh và API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}