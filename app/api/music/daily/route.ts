import { NextResponse } from 'next/server';
import { getMusicPicks, saveMusicPicks } from '@/lib/db';
import { getDailyPicks } from '@/lib/spotify';

export const revalidate = 3600;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  try {
    const cached = await getMusicPicks(today);
    if (cached) return NextResponse.json(cached);

    const picks = await getDailyPicks(today);
    const full = { date: today, ...picks };
    await saveMusicPicks(full);
    return NextResponse.json(full);
  } catch (err) {
    console.error('Music picks error:', err);
    return NextResponse.json({ error: 'Failed to fetch music picks' }, { status: 500 });
  }
}
