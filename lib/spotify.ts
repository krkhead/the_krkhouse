import crypto from 'crypto';
import type { SpotifyTrack, SpotifyPlaylistTrack, SpotifyTokenResponse } from './types';

// Spotify playlist IDs
export const PLAYLISTS = {
  astral: '4sssNLoBjV0SvDQ8ClK25V',
  technical: '7wT4DYZViAYKOOb4jyWJq3',
  sonic: '3HEMAS8C4NPVSVf9cj4Ymm',
} as const;

// --- Token management (Client Credentials flow) ---

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status} ${res.statusText}`);
  }

  const data: SpotifyTokenResponse = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 1 min buffer
  };

  return cachedToken.token;
}

// --- Playlist fetching ---

async function getAllPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
  const tracks: SpotifyTrack[] = [];
  let url: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=next,items(track(id,name,artists,album,external_urls,is_local))`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Spotify playlist error: ${res.status} ${res.statusText}`);
    }

    const data: { items: SpotifyPlaylistTrack[]; next: string | null } = await res.json();

    for (const item of data.items) {
      if (!item.track || item.track.is_local) continue;
      const t = item.track;
      tracks.push({
        trackId: t.id,
        artist: t.artists.map((a) => a.name).join(', '),
        name: t.name,
        image: t.album.images[0]?.url ?? '',
        albumName: t.album.name,
        spotifyUrl: t.external_urls.spotify,
      });
    }

    url = data.next;
  }

  return tracks;
}

// --- Deterministic daily RNG ---

function getDailySeed(dateStr: string): string {
  const secret = process.env.DAILY_MUSIC_SEED_KEY ?? 'krkhouse-default-seed';
  return crypto.createHash('sha256').update(`${dateStr}${secret}`).digest('hex');
}

function seededIndex(seed: string, offset: number, length: number): number {
  const slice = seed.slice(offset * 8, offset * 8 + 8);
  return parseInt(slice, 16) % length;
}

// --- Main export: get today's picks ---

export async function getDailyPicks(dateStr: string): Promise<{
  astral: SpotifyTrack;
  technical: SpotifyTrack;
  sonic: SpotifyTrack;
}> {
  const [astralTracks, technicalTracks, sonicTracks] = await Promise.all([
    getAllPlaylistTracks(PLAYLISTS.astral),
    getAllPlaylistTracks(PLAYLISTS.technical),
    getAllPlaylistTracks(PLAYLISTS.sonic),
  ]);

  if (!astralTracks.length || !technicalTracks.length || !sonicTracks.length) {
    throw new Error('One or more Spotify playlists returned no tracks');
  }

  const seed = getDailySeed(dateStr);

  return {
    astral: astralTracks[seededIndex(seed, 0, astralTracks.length)],
    technical: technicalTracks[seededIndex(seed, 1, technicalTracks.length)],
    sonic: sonicTracks[seededIndex(seed, 2, sonicTracks.length)],
  };
}
