import { NextRequest, NextResponse } from 'next/server';
import { validateImageFile, uploadArtwork } from '@/lib/blob';
import { insertArtwork } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const uuid = crypto.randomUUID();
    const blobUrl = await uploadArtwork(file, uuid);
    const artwork = await insertArtwork({
      uuid,
      filename: file.name,
      blob_url: blobUrl,
      room: 'studio',
    });

    return NextResponse.json({
      success: true,
      id: artwork.id,
      blob_url: blobUrl,
      filename: file.name,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
