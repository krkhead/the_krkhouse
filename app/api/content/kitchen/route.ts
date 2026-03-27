import { NextResponse } from 'next/server';
import { getEssays } from '@/lib/db';

export const revalidate = 300;

export async function GET() {
  try {
    const essays = await getEssays();
    return NextResponse.json({ essays });
  } catch (err) {
    console.error('Essays fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch essays' }, { status: 500 });
  }
}
