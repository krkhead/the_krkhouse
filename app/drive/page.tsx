import RoomLayout from '@/app/components/RoomLayout';

/**
 * The Drive — three curated playlist lanes.
 * Uses Spotify's official embed player (no API credentials required).
 * Embeds work on any domain; theme=0 forces dark mode.
 */

const LANES = [
  {
    id: 'astral',
    playlistId: '4sssNLoBjV0SvDQ8ClK25V',
    label: 'Astral',
    desc: 'Elevation. Atmosphere. Float above the noise.',
    accent: '#8B6F47',
  },
  {
    id: 'technical',
    playlistId: '7wT4DYZViAYKOOb4jyWJq3',
    label: 'Technical',
    desc: 'Precision. Cadence. Rhythmic intelligence.',
    accent: '#6B7A8B',
  },
  {
    id: 'sonic',
    playlistId: '3HEMAS8C4NPVSVf9cj4Ymm',
    label: 'Sonic',
    desc: 'Immediate impact. Energy. Presence.',
    accent: '#8B5A6B',
  },
] as const;

export default function DrivePage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <RoomLayout room="drive" label="The Drive" subtitle="Daily sound">
      {/* Date */}
      <p
        style={{
          fontSize: '0.65rem',
          letterSpacing: '2px',
          color: '#303030',
          textTransform: 'uppercase',
          marginBottom: '3rem',
        }}
      >
        {today}
      </p>

      {/* Three playlist lanes */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: '#111',
        }}
      >
        {LANES.map((lane) => (
          <div
            key={lane.id}
            style={{
              backgroundColor: '#0a0a0a',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Lane header */}
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6rem',
                  letterSpacing: '3px',
                  color: lane.accent,
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                {lane.label}
              </span>
              <p style={{ fontSize: '0.6rem', color: '#2a2a2a', letterSpacing: '0.5px' }}>
                {lane.desc}
              </p>
            </div>

            {/* Spotify embed — official embed endpoint, dark theme */}
            <iframe
              src={`https://open.spotify.com/embed/playlist/${lane.playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={`${lane.label} playlist`}
              style={{ border: 0 }}
            />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          fontSize: '0.6rem',
          color: '#1f1f1f',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginTop: '3rem',
        }}
      >
        Curated selections
      </p>
    </RoomLayout>
  );
}
