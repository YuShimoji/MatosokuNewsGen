import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const { token } = req.nextauth;

    // 管理者専用ルート
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }

    // エディター専用ルート
    if (pathname.startsWith('/editor') && !['EDITOR', 'ADMIN'].includes(token?.role || '')) {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // 認証が必要なページにアクセスした際のリダイレクト先を指定
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

// 認証が必要なルートを指定
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/editor/:path*',
    '/api/admin/:path*',
    '/api/editor/:path*',
  ],
};
