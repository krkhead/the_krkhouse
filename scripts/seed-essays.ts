/**
 * Seed kitchen essays to the database
 * Add your essays to the ESSAYS array below, then run:
 *   npx ts-node scripts/seed-essays.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ESSAYS: Array<{
  slug: string;
  title: string;
  content: string; // HTML or plain text
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string; // ISO date string e.g. "2026-03-01"
}> = [
  // Add essays here. Example:
  // {
  //   slug: 'suya-ramen',
  //   title: 'Suya Ramen',
  //   content: '<p>What happens when suya spice meets a tonkotsu base?</p>',
  //   excerpt: 'West African heat meets Japanese depth.',
  //   published_at: '2026-03-01',
  // },
];

async function main() {
  const { default: sql } = await import('../lib/db');

  if (ESSAYS.length === 0) {
    console.log('No essays to seed. Add them to the ESSAYS array in this script.');
    
    return;
  }

  let seeded = 0;
  for (const essay of ESSAYS) {
    const [existing] = await sql`SELECT id FROM kitchen_essays WHERE slug = ${essay.slug}`;
    if (existing) {
      console.log(`Skipped (exists): ${essay.slug}`);
      continue;
    }
    await sql`
      INSERT INTO kitchen_essays (slug, title, content, excerpt, featured_image_url, published_at)
      VALUES (
        ${essay.slug},
        ${essay.title},
        ${essay.content},
        ${essay.excerpt ?? null},
        ${essay.featured_image_url ?? null},
        ${essay.published_at ? new Date(essay.published_at) : null}
      )
    `;
    seeded++;
    console.log(`Seeded: ${essay.title}`);
  }

  console.log(`\nDone. Seeded ${seeded} essays.`);
  
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
