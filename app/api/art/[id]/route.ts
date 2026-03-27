import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artworkId = parseInt(id);

  if (isNaN(artworkId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const artwork = await getArtworkById(artworkId);
    if (!artwork) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(artwork);
  } catch (err) {
    console.error('Artwork fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch artwork' }, { status: 500 });
  }
}
