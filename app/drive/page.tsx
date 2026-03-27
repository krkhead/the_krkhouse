import RoomLayout from '@/app/components/RoomLayout';
import { getMusicPicks, saveMusicPicks } from '@/lib/db';
import { getDailyPicks } from '@/lib/spotify';
import type { DailyPicks } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

const LANE_META = {
  astral: {
    label: 'Astral',
    desc: 'Elevation. Atmosphere. Float above the noise.',
    accent: '#8B6F47',
  },
  technical: {
    label: 'Technical',
    desc: 'Precision. Cadence. Rhythmic intelligence.',
    accent: '#6B7A8B',
  },
  sonic: {
    label: 'Sonic',
    desc: 'Immediate impact. Energy. Presence.',
    accent: '#8B5A6B',
  },
};

async function getOrGeneratePicks(): Promise<DailyPicks | null> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const cached = await getMusicPicks(today);
    if (cached) return cached;
    const picks = await getDailyPicks(today);
    const full: DailyPicks = { date: today, ...picks };
    await saveMusicPicks(full);
    return full;
  } catch (err) {
    console.error('Failed to get music picks:', err);
    return null;
  }
}

export default async function DrivePage() {
  const picks = await getOrGeneratePicks();
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
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

      {!picks ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '1px' }}>
            Music unavailable — check Spotify credentials
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#111' }}>
          {(['astral', 'technical', 'sonic'] as const).map((lane) => {
            const track = picks[lane];
            const meta = LANE_META[lane];
            return (
              <div
                key={lane}
                style={{
                  backgroundColor: '#0a0a0a',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '1.25rem',
                  alignItems: 'center',
                }}
              >
                {/* Album art */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.image}
                  alt=""
                  draggable={false}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(20%) contrast(1.1)',
                    flexShrink: 0,
                  }}
                />

                {/* Track info */}
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.6rem',
                      letterSpacing: '3px',
                      color: meta.accent,
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {meta.label}
                  </span>
                  <p
                    style={{
                      fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.5px',
                      color: '#d0d0d0',
                      lineHeight: 1.2,
                      fontFamily: '"Courier New", monospace',
                    }}
                  >
                    {track.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#505050',
                      marginTop: '0.25rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {track.artist}
                  </p>
                  <p style={{ fontSize: '0.6rem', color: '#2a2a2a', marginTop: '0.5rem' }}>
                    {meta.desc}
                  </p>
                </div>

                {/* Spotify link */}
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '2px',
                    color: '#404040',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    border: '1px solid #222',
                    padding: '0.4rem 0.75rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  Open ↗
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Note */}
      <p
        style={{
          fontSize: '0.6rem',
          color: '#1f1f1f',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginTop: '3rem',
        }}
      >
        Picks refresh daily
      </p>
    </RoomLayout>
  );
}
