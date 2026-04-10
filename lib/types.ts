// Artwork (Studio)
export interface Artwork {
  id: number;
  uuid: string;
  filename: string;
  blob_url: string;
  room: 'studio' | 'drive';
  sort_order: number;
  created_at: string;
}

// Spotify track
export interface SpotifyTrack {
  trackId: string;
  artist: string;
  name: string;
  image: string;
  spotifyUrl: string;
  albumName?: string;
}

// Daily music picks
export interface DailyPicks {
  date: string;
  astral: SpotifyTrack;
  technical: SpotifyTrack;
  sonic: SpotifyTrack;
}

// API responses
export interface ArtworkListResponse {
  total: number;
  items: Artwork[];
}

export interface UploadResponse {
  success: boolean;
  id: number;
  blob_url: string;
  filename: string;
}

// Spotify playlist track (raw API response)
export interface SpotifyPlaylistTrack {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string; width: number; height: number }[];
    };
    external_urls: { spotify: string };
    is_local: boolean;
    preview_url: string | null;
  } | null;
}

// Spotify token response
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
