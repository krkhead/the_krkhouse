import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// DELETE /api/admin/essays/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const essayId = parseInt(id);

  if (isNaN(essayId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const result = await sql`DELETE FROM kitchen_essays WHERE id = ${essayId} RETURNING id`;
    if (!result.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete essay error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
