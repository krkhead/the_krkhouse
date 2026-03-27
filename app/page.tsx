import Link from 'next/link';

const ROOMS = [
  {
    href: '/drive',
    label: 'The Drive',
    tag: 'SOUND',
    desc: 'Three sonic lanes. Astral, Technical, Sonic. Daily curation.',
    accent: '#8B6F47',
  },
  {
    href: '/kitchen',
    label: 'The Kitchen',
    tag: 'CULINARY',
    desc: 'Fusion explorations. Nigerian ingredients, global technique.',
    accent: '#A85C5C',
  },
  {
    href: '/studio',
    label: 'The Studio',
    tag: 'ART',
    desc: 'Visual archive. Raw, expressive, unfiltered.',
    accent: '#6B4C8A',
  },
];

export default function Foyer() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.65rem',
              letterSpacing: '3px',
              color: '#404040',
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}
          >
            Lagos, Nigeria
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '-4px',
              textTransform: 'uppercase',
              color: '#d0d0d0',
              lineHeight: 0.9,
              fontFamily: '"Courier New", monospace',
            }}
          >
            The<br />Krkhouse
          </h1>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_SUBSTACK_URL ?? 'https://substack.com/@teganora'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '2px',
            color: '#404040',
            textDecoration: 'none',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
            marginTop: '0.5rem',
          }}
        >
          Substack ↗
        </a>
      </header>

      {/* Manifesto line */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            letterSpacing: '1px',
            color: '#303030',
            textTransform: 'uppercase',
            fontFamily: '"Courier New", monospace',
          }}
        >
          Lagos is loud. So I curate.
        </p>
      </div>

      {/* Room cards */}
      <main
        style={{
          flex: 1,
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1px',
          backgroundColor: '#1a1a1a',
          alignContent: 'start',
        }}
      >
        {ROOMS.map((room) => (
          <Link
            key={room.href}
            href={room.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                backgroundColor: '#0a0a0a',
                padding: '2rem 1.5rem',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '3px',
                    color: room.accent,
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  {room.tag}
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 900,
                    letterSpacing: '-2px',
                    textTransform: 'uppercase',
                    color: '#d0d0d0',
                    lineHeight: 1,
                    fontFamily: '"Courier New", monospace',
                  }}
                >
                  {room.label}
                </h2>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#404040',
                  lineHeight: 1.6,
                  marginTop: '1rem',
                }}
              >
                {room.desc}
              </p>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.6rem', color: '#222', letterSpacing: '1px' }}>
          © KRKHOUSE — PERSONAL ARCHIVE
        </span>
        <span style={{ fontSize: '0.6rem', color: '#222', letterSpacing: '1px' }}>
          THREE ROOMS
        </span>
      </footer>
    </div>
  );
}
