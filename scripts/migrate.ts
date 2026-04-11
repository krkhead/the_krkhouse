import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Running migrations...');

  await sql`
    CREATE TABLE IF NOT EXISTS artworks (
      id SERIAL PRIMARY KEY,
      uuid TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL,
      blob_url TEXT NOT NULL,
      room TEXT DEFAULT 'studio',
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS music_picks (
      id SERIAL PRIMARY KEY,
      pick_date DATE NOT NULL UNIQUE,
      astral_track_id TEXT,
      astral_artist TEXT,
      astral_name TEXT,
      astral_image_url TEXT,
      technical_track_id TEXT,
      technical_artist TEXT,
      technical_name TEXT,
      technical_image_url TEXT,
      sonic_track_id TEXT,
      sonic_artist TEXT,
      sonic_name TEXT,
      sonic_image_url TEXT,
      generated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS kitchen_essays (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      featured_image_url TEXT,
      excerpt TEXT,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_artworks_room ON artworks(room)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_artworks_created ON artworks(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_music_picks_date ON music_picks(pick_date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_essays_published ON kitchen_essays(published_at DESC)`;

  console.log('Migrations complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
