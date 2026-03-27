# The Krkhouse Digital Library — Project Context

## Project Overview

**The Krkhouse** is a digital library showcasing curated cultural experiences through three rooms: **The Drive** (music), **The Kitchen** (culinary essays), and **The Studio** (visual art archive with 202+ pieces).

**Goal**: Create a beautiful, minimal web presence reflecting a raw avant-garde expressionist aesthetic while protecting original artwork from unauthorized reproduction.

**Tech Stack**: Next.js 16 (App Router) + Vercel Blob + Neon Postgres + Spotify Web API

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with credentials from:
# - Spotify Developer Dashboard
# - Neon Console
# - Vercel Project Settings (Blob token)

# Setup database (create tables)
npm run migrate

# Seed initial data
npm run seed:all

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

---

## Project Structure

```
krkhouse-web/
├── app/
│   ├── layout.tsx                    # Root layout, dark mode provider
│   ├── page.tsx                      # Landing page (Foyer)
│   ├── studio/
│   │   └── page.tsx                  # Art gallery (PROTECTED: watermark, no right-click)
│   ├── drive/
│   │   └── page.tsx                  # Daily music picks (Astral/Technical/Sonic)
│   ├── kitchen/
│   │   ├── page.tsx                  # Essays grid
│   │   └── [slug]/page.tsx           # Single essay view
│   ├── api/
│   │   ├── music/daily/route.ts      # GET daily picks (cached 24h)
│   │   ├── art/list/route.ts         # GET paginated artworks
│   │   ├── art/[id]/route.ts         # GET single artwork metadata
│   │   ├── upload/route.ts           # POST image to Blob + DB
│   │   └── content/kitchen/route.ts  # GET essays
│   └── components/
│       ├── RoomLayout.tsx            # Room wrapper (header, nav, styling)
│       ├── ArtGallery.tsx            # Grid of thumbnails (lazy-loaded)
│       ├── ArtExpandedView.tsx       # Full-screen art with watermark + protection
│       ├── SpotifyCard.tsx           # Music pick display
│       └── UploadModal.tsx           # Image upload dialog
│
├── lib/
│   ├── db.ts                         # Neon Postgres client
│   ├── spotify.ts                    # Spotify API service + daily RNG
│   ├── blob.ts                       # Vercel Blob operations
│   ├── watermark.ts                  # Watermark canvas generation (Studio protection)
│   └── types.ts                      # TypeScript interfaces
│
├── scripts/
│   ├── seed-artworks.ts              # Load 202 artworks from /atwok
│   ├── seed-essays.ts                # Load kitchen essays
│   └── seed-playlists.ts             # Fetch Spotify tracks
│
├── styles/
│   └── globals.css                   # Dark mode, bruised colors
│
├── .env.example                      # Template for environment variables
├── .env.local                        # (GITIGNORED) Local secrets
├── .gitignore                        # Protect .env files and build artifacts
├── next.config.js                    # Image optimization
├── tailwind.config.ts                # Bruised color theme
├── tsconfig.json
├── package.json
└── CLAUDE.md                         # This file
```

---

## Key Workflows

### 1. Daily Music Picks (Server-Side Deterministic)

**File:** `lib/spotify.ts` + `app/api/music/daily/route.ts`

**How it works:**
- Seed: `SHA256(YYYYMMDD + DAILY_MUSIC_SEED_KEY)`
- Uses seed as RNG to pick 1 track from each Spotify playlist (Astral/Technical/Sonic)
- Same seed = same picks for all users on same day
- Cache in DB for 24 hours

### 2. Studio Art Gallery (Protected)

**Files:** `app/studio/page.tsx` + `app/components/ArtExpandedView.tsx`

**Protection (Studio only):**
- Display-only (no downloads)
- Watermark overlay (© Krkhouse, canvas-based, ~10% opacity)
- Right-click disabled (contextmenu preventDefault)
- Responsive grid (2 col mobile → 5 col desktop)
- Click to expand, prev/next arrows, ESC to close

**Important:** Kitchen & Drive have NO protection (fully shareable)

### 3. Image Upload

**File:** `app/api/upload/route.ts`

**Flow:**
1. User selects image
2. Upload to Vercel Blob
3. Insert metadata into artworks table
4. Appears in Studio gallery immediately

---

## Database Schema (Neon Postgres)

```sql
CREATE TABLE artworks (
  id SERIAL PRIMARY KEY,
  uuid TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  room TEXT DEFAULT 'studio',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE music_picks (
  id SERIAL PRIMARY KEY,
  pick_date DATE NOT NULL UNIQUE,
  astral_track_id TEXT, astral_artist TEXT, astral_name TEXT, astral_image_url TEXT,
  technical_track_id TEXT, technical_artist TEXT, technical_name TEXT, technical_image_url TEXT,
  sonic_track_id TEXT, sonic_artist TEXT, sonic_name TEXT, sonic_image_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE kitchen_essays (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  excerpt TEXT,
  published_at TIMESTAMP
);
```

---

## Environment Variables

**Required in `.env.local` (DO NOT COMMIT):**

```
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/krkhouse?sslmode=require
VERCEL_BLOB_READ_WRITE_TOKEN=your_token
NEXT_PUBLIC_SUBSTACK_URL=https://substack.com/@teganora
DAILY_MUSIC_SEED_KEY=secret_key_for_rng
```

**⚠️ IMPORTANT:** `.env.local` is in `.gitignore` — it WILL NOT be committed or pushed

---

## Useful Commands

```bash
npm run dev                          # Start dev server (localhost:3000)
npm run migrate                      # Create database tables
npm run seed:all                     # Seed artworks + essays + playlists
npm run build                        # Build for production
npm run start                        # Start production server
vercel deploy --prod                 # Deploy to Vercel
```

---

## Critical Files

| File | Purpose |
|------|---------|
| `lib/spotify.ts` | Spotify API + deterministic daily randomization |
| `lib/watermark.ts` | Watermark canvas generation (Studio protection) |
| `app/studio/page.tsx` | Studio gallery grid layout |
| `app/api/music/daily/route.ts` | Daily music picks endpoint |
| `scripts/seed-artworks.ts` | Batch upload artworks from `/atwok` |

---

## Important Gotchas

1. **Watermark is client-side** — Applied in ArtExpandedView, not baked into image
2. **Daily seed is deterministic** — Don't rotate `DAILY_MUSIC_SEED_KEY` in production
3. **No metadata visible** — Artwork titles/descriptions exist in DB but never shown in UI
4. **Spotify playlists must exist** — Verify playlist IDs in `lib/spotify.ts`
5. **Database connection limited** — Neon free tier = 1 concurrent connection

---

## Architecture Decision Log

| Decision | Why | Tradeoff |
|----------|-----|----------|
| Server-side daily music | Deterministic, all users see same picks | Can't personalize |
| Watermark overlay (not baked) | Non-destructive, easily toggleable | Client-side processing |
| No visible metadata | Protects art from casual copying | Harder to add captions later |
| Display-only images | Discourages unauthorized use | Users can still screenshot |
| Vercel Blob | Fast, integrated | Vendor lock-in |
| Neon Postgres | Vercel PG sunset | One more vendor |

---

## Resources

- **Implementation Plan:** `C:\Users\onuor\.claude\plans\sprightly-cooking-treasure.md`
- **Art Folder:** `C:\Users\onuor\OneDrive\Desktop\atwok\`
- **Substack:** https://substack.com/@teganora
- **Spotify Astral:** https://open.spotify.com/playlist/4sssNLoBjV0SvDQ8ClK25V
- **Spotify Technical:** https://open.spotify.com/playlist/7wT4DYZViAYKOOb4jyWJq3
- **Spotify Sonic:** https://open.spotify.com/playlist/3HEMAS8C4NPVSVf9cj4Ymm

---

**Status:** Ready for Phase 1 implementation
**Last Updated:** 2026-03-27
