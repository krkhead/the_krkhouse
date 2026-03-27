import { put, del } from '@vercel/blob';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE_MB = 10;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF`;
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File too large. Max ${MAX_SIZE_MB}MB`;
  }
  return null;
}

export async function uploadArtwork(file: File, uuid: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const pathname = `studio/${uuid}.${ext}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return blob.url;
}

export async function deleteArtwork(url: string): Promise<void> {
  await del(url);
}
