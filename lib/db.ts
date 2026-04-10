import { neon } from '@neondatabase/serverless';
import type { Artwork, Essay, DailyPicks } from './types';

const sql = neon(process.env.DATABASE_URL!);

export default sql;

// --- Artworks ---

export async function getArtworks(limit = 50, offset = 0): Promise<{ total: number; items: Artwork[] }> {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM artworks WHERE room = 'studio'`;
  const items = await sql`
    SELECT * FROM artworks
    WHERE room = 'studio'
    ORDER BY sort_order ASC, created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as Artwork[];
  return { total: count as number, items };
}

export async function getArtworkById(id: number): Promise<Artwork | null> {
  const rows = await sql`SELECT * FROM artworks WHERE id = ${id}` as Artwork[];
  return rows[0] ?? null;
}

export async function insertArtwork(data: {
  uuid: string;
  filename: string;
  blob_url: string;
  room?: string;
}): Promise<Artwork> {
  const rows = await sql`
    INSERT INTO artworks (uuid, filename, blob_url, room)
    VALUES (${data.uuid}, ${data.filename}, ${data.blob_url}, ${data.room ?? 'studio'})
    RETURNING *
  ` as Artwork[];
  return rows[0];
}

// --- Music Picks ---

export async function getMusicPicks(date: string): Promise<DailyPicks | null> {
  const rows = await sql`SELECT * FROM music_picks WHERE pick_date = ${date}`;
  const row = rows[0];
  if (!row) return null;
  return {
    date,
    astral: {
      trackId: row.astral_track_id as string,
      artist: row.astral_artist as string,
      name: row.astral_name as string,
      image: row.astral_image_url as string,
      spotifyUrl: `https://open.spotify.com/track/${row.astral_track_id}`,
    },
    technical: {
      trackId: row.technical_track_id as string,
      artist: row.technical_artist as string,
      name: row.technical_name as string,
      image: row.technical_image_url as string,
      spotifyUrl: `https://open.spotify.com/track/${row.technical_track_id}`,
    },
    sonic: {
      trackId: row.sonic_track_id as string,
      artist: row.sonic_artist as string,
      name: row.sonic_name as string,
      image: row.sonic_image_url as string,
      spotifyUrl: `https://open.spotify.com/track/${row.sonic_track_id}`,
    },
  };
}

export async function saveMusicPicks(picks: DailyPicks): Promise<void> {
  await sql`
    INSERT INTO music_picks (
      pick_date,
      astral_track_id, astral_artist, astral_name, astral_image_url,
      technical_track_id, technical_artist, technical_name, technical_image_url,
      sonic_track_id, sonic_artist, sonic_name, sonic_image_url
    ) VALUES (
      ${picks.date},
      ${picks.astral.trackId}, ${picks.astral.artist}, ${picks.astral.name}, ${picks.astral.image},
      ${picks.technical.trackId}, ${picks.technical.artist}, ${picks.technical.name}, ${picks.technical.image},
      ${picks.sonic.trackId}, ${picks.sonic.artist}, ${picks.sonic.name}, ${picks.sonic.image}
    )
    ON CONFLICT (pick_date) DO NOTHING
  `;
}

// --- Kitchen Essays ---

export async function getEssays(): Promise<Essay[]> {
  const rows = await sql`
    SELECT * FROM kitchen_essays
    WHERE published_at IS NOT NULL
    ORDER BY published_at DESC
  `;
  return rows as Essay[];
}

export async function getEssayBySlug(slug: string): Promise<Essay | null> {
  const rows = await sql`SELECT * FROM kitchen_essays WHERE slug = ${slug}` as Essay[];
  return rows[0] ?? null;
}

export async function insertEssay(data: Omit<Essay, 'id' | 'created_at'>): Promise<Essay> {
  const rows = await sql`
    INSERT INTO kitchen_essays (slug, title, content, featured_image_url, excerpt, published_at)
    VALUES (${data.slug}, ${data.title}, ${data.content}, ${data.featured_image_url}, ${data.excerpt}, ${data.published_at})
    RETURNING *
  ` as Essay[];
  return rows[0];
}
