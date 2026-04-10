import { NextRequest, NextResponse } from 'next/server';
import { insertEssay } from '@/lib/db';

// Wrap plain text in <p> tags if no HTML detected
function formatContent(raw: string): string {
  if (raw.trim().startsWith('<')) return raw;
  return raw
    .split(/\n\n+/)
    .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
    .filter((p) => p !== '<p></p>')
    .join('\n');
}

// POST /api/admin/essays — create essay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, published_at } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'title, slug, and content are required' },
        { status: 400 }
      );
    }

    const essay = await insertEssay({
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      excerpt: excerpt || null,
      content: formatContent(content),
      featured_image_url: null,
      published_at: published_at ? new Date(published_at).toISOString() : new Date().toISOString(),
    });

    return NextResponse.json(essay, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error('Create essay error:', err);
    return NextResponse.json({ error: 'Failed to create essay' }, { status: 500 });
  }
}
