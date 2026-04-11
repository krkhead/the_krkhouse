import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/db';
import { deleteArtwork } from '@/lib/blob';
import sql from '@/lib/db';

export async function DELETE(
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
    if (!artwork) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete from Vercel Blob then DB
    await deleteArtwork(artwork.blob_url);
    await sql`DELETE FROM artworks WHERE id = ${artworkId}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete artwork error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
