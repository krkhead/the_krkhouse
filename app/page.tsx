import Link from 'next/link';

const ROOMS = [
  {
    href: '/drive',
    label: 'The Drive',
    tag: 'Sound',
    desc: 'Three sonic lanes. Astral, Technical, Sonic.',
    accent: '#8B6F47',
    border: '5px solid #8B6F47',
  },
  {
    href: '/studio',
    label: 'The Studio',
    tag: 'Art',
    desc: 'Visual archive. Raw, expressive, unfiltered.',
    accent: '#6B4C8A',
    border: '5px solid #6B4C8A',
  },
];

export default function Foyer() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505' }}>

      {/* Header — title bleeds large */}
      <header style={{ padding: '2rem 1.5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '3px',
            color: '#404040',
            textTransform: 'uppercase',
          }}>
            Lagos, Nigeria — {new Date().getFullYear()}
          </p>
          <a
            href="https://substack.com/@teganora"
            target="_blank"
            rel="noopener noreferrer"
            className="stamp-hover"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '2px',
              color: '#404040',
              textTransform: 'uppercase',
              border: '1px solid #1f1f1f',
              padding: '3px 8px',
            }}
          >
            Substack ↗
          </a>
        </div>

        {/* Giant brutalist title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 18vw, 13rem)',
          lineHeight: 0.85,
          letterSpacing: '-4px',
          color: '#f0f0f0',
          textTransform: 'uppercase',
          marginBottom: '-0.1em',
        }}>
          The<br />
          <span style={{ color: '#e0ff00' }}>Krk</span>house
        </h1>
      </header>

      {/* Manifesto bar */}
      <div style={{
        borderTop: '3px solid #1a1a1a',
        borderBottom: '1px solid #111',
        padding: '0.75rem 1.5rem',
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '4px',
          color: '#2a2a2a',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          Lagos is loud. So I curate. ·&nbsp; Lagos is loud. So I curate. ·&nbsp; Lagos is loud. So I curate. ·&nbsp;
          Lagos is loud. So I curate. ·&nbsp; Lagos is loud. So I curate. ·&nbsp;
        </span>
      </div>

      {/* Room cards */}
      <main style={{
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3px',
        backgroundColor: '#111',
      }}>
        {ROOMS.map((room, i) => (
          <Link key={room.href} href={room.href} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              className="glitch-hover"
              style={{
                backgroundColor: '#050505',
                padding: '2.5rem 1.5rem',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderLeft: room.border,
                borderTop: i % 2 === 0 ? '1px solid #1a1a1a' : '3px solid #1a1a1a',
                borderRight: '1px solid #0f0f0f',
                borderBottom: i % 2 === 0 ? '3px solid #1a1a1a' : '1px solid #1a1a1a',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background scratches */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  opacity: 0.04,
                }}
              >
                <path
                  d={i === 0
                    ? 'M0,30 L100,70 M0,70 L100,30 M50,0 L48,100'
                    : 'M10,5 L20,95 M80,5 L75,95 M0,50 L100,52'}
                  stroke="#f0f0f0" strokeWidth="0.8" fill="none" strokeLinecap="round"
                />
              </svg>

              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '5px',
                  color: room.accent,
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  {room.tag}
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  lineHeight: 0.9,
                  color: '#f0f0f0',
                  textTransform: 'uppercase',
                  letterSpacing: '-1px',
                }}>
                  {room.label}
                </h2>
              </div>

              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#404040',
                letterSpacing: '1px',
                lineHeight: 1.6,
              }}>
                {room.desc}
              </p>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '3px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#1f1f1f', letterSpacing: '2px' }}>
          © KRKHOUSE — PERSONAL ARCHIVE
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#1f1f1f', letterSpacing: '2px' }}>
          TWO ROOMS
        </span>
      </footer>
    </div>
  );
}
