/**
 * Seed artworks from the /atwok folder to Vercel Blob + Neon DB
 *
 * Usage:
 *   npx ts-node scripts/seed-artworks.ts
 *
 * Reads all images from the source folder, uploads to Vercel Blob,
 * and inserts metadata into the artworks table.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SOURCE_DIR = 'C:\\Users\\onuor\\OneDrive\\Desktop\\atwok';
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic'];
const BATCH_SIZE = 5;

async function uploadFile(filePath: string, uuid: string): Promise<string> {
  const { put } = await import('@vercel/blob');
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', gif: 'image/gif', avif: 'image/avif', heic: 'image/heic',
  };
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: mimeMap[ext] ?? 'image/jpeg' });
  const { url } = await put(`studio/${uuid}.${ext}`, blob, {
    access: 'public',
    addRandomSuffix: false,
  });
  return url;
}

async function main() {
  const { default: sql } = await import('../lib/db');

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ALLOWED_EXTS.includes(ext);
  });

  console.log(`Found ${files.length} files in ${SOURCE_DIR}`);

  let seeded = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (filename) => {
        const filePath = path.join(SOURCE_DIR, filename);
        const uuid = crypto.randomUUID();

        // Check if already seeded
        const [existing] = await sql`SELECT id FROM artworks WHERE filename = ${filename}`;
        if (existing) {
          skipped++;
          return;
        }

        try {
          const blobUrl = await uploadFile(filePath, uuid);
          await sql`
            INSERT INTO artworks (uuid, filename, blob_url, room)
            VALUES (${uuid}, ${filename}, ${blobUrl}, 'studio')
            ON CONFLICT (uuid) DO NOTHING
          `;
          seeded++;
          console.log(`[${seeded}] Uploaded: ${filename}`);
        } catch (err) {
          console.error(`Failed: ${filename}`, err);
        }
      })
    );
  }

  console.log(`\nDone. Seeded: ${seeded}, Skipped (already exist): ${skipped}`);
  
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
