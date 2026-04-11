import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function expectedToken(): string {
  return crypto
    .createHmac('sha256', 'krkhouse-admin-v1')
    .update(process.env.ADMIN_PASSWORD ?? 'changeme')
    .digest('hex');
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page through unauthenticated
  if (pathname === '/admin/login') return NextResponse.next();

  const cookie = req.cookies.get('krkhouse_admin');
  const expected = expectedToken();

  if (!cookie || cookie.value !== expected) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
