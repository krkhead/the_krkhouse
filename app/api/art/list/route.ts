import { NextRequest, NextResponse } from 'next/server';
import { getArtworks } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  try {
    const data = await getArtworks(limit, offset);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('Art list error:', err);
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
  }
}
