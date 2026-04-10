import RoomLayout from '@/app/components/RoomLayout';

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
    <RoomLayout room="drive" label="The Drive" subtitle="Sound">

      {/* ── Bleeding headline ──────────────────────────── */}
      <div style={{ overflow: 'visible', marginBottom: '0.25rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 10vw, 7rem)',
          lineHeight: 0.85,
          letterSpacing: '-2px',
          color: '#f0f0f0',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          marginLeft: '-2px', /* slight bleed left */
        }}>
          Nobody Drives<br />
          <span style={{ color: '#e0ff00' }}>In Silence</span><br />
          Anymore.
        </h1>
      </div>

      {/* Body copy */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: '#404040',
        lineHeight: 1.8,
        maxWidth: 480,
        letterSpacing: '0.3px',
        marginBottom: '0.5rem',
      }}>
        Texture to survive the gridlock. The daily rotation of sonic grit,
        astral dissonance, and underground technicality. Seeded daily. Played loud.
      </p>

      {/* Date stamp */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '3px',
        color: '#2a2a2a',
        textTransform: 'uppercase',
        marginBottom: '3rem',
        borderTop: '1px solid #111',
        paddingTop: '0.75rem',
      }}>
        {today}
      </p>

      {/* ── Three playlist lanes ───────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#111' }}>
        {LANES.map((lane) => (
          <div
            key={lane.id}
            style={{
              backgroundColor: '#050505',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: `4px solid ${lane.accent}`,
            }}
          >
            <div>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                letterSpacing: '-0.5px',
                color: lane.accent,
                textTransform: 'uppercase',
                lineHeight: 0.9,
                marginBottom: '0.35rem',
              }}>
                {lane.label}
              </span>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: '#2a2a2a',
                letterSpacing: '1px',
              }}>
                {lane.desc}
              </p>
            </div>

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
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        color: '#1a1a1a',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginTop: '3rem',
      }}>
        Played loud.
      </p>
    </RoomLayout>
  );
}
