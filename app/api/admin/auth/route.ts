import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const COOKIE = 'krkhouse_admin';

function expectedToken(): string {
  return crypto
    .createHmac('sha256', 'krkhouse-admin-v1')
    .update(process.env.ADMIN_PASSWORD ?? 'changeme')
    .digest('hex');
}

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return res;
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
