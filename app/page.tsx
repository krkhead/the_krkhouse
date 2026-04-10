import Link from 'next/link';

const ROOMS = [
  {
    href: '/drive',
    label: 'The Drive',
    tag: 'Sound',
    accent: '#8B6F47',
    borderLeft: '5px solid #8B6F47',
  },
  {
    href: '/studio',
    label: 'The Studio',
    tag: 'Art',
    accent: '#6B4C8A',
    borderLeft: '5px solid #6B4C8A',
  },
];

export default function Foyer() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', overflowX: 'hidden' }}>

      {/* ── Top bar ───────────────────────────────────── */}
      <div style={{
        padding: '1.25rem 1.5rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '3px',
          color: '#888888',
          textTransform: 'uppercase',
        }}>
          The Krkhouse — Lagos, NG
        </p>
        <a
          href="https://substack.com/@teganora"
          target="_blank"
          rel="noopener noreferrer"
          className="stamp-hover"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
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

      {/* ── BLEEDING HEADLINE ─────────────────────────── */}
      {/* Overflows right edge intentionally — raw, uncontained energy */}
      <header style={{
        padding: '1.5rem 1.5rem 0',
        overflow: 'visible',
        position: 'relative',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 15vw, 11rem)',
          lineHeight: 0.85,
          letterSpacing: '-3px',
          color: '#f0f0f0',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',         /* lets the text bleed off the right */
          overflow: 'visible',
          marginBottom: '0.1em',
        }}>
          Lagos Is Loud.<br />
          <span style={{ color: '#e0ff00' }}>So I Curate.</span>
        </h1>

        {/* Body copy — sits tight under the headline */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: '#404040',
          lineHeight: 1.8,
          maxWidth: 520,
          marginTop: '1.5rem',
          marginBottom: '2.5rem',
          letterSpacing: '0.3px',
        }}>
          This is the Krkhouse. An interface between the chaos of the city and
          intentional curation. No smooth edges. No polite consumption. A digital vault
          of sound, raw expressionism, and gut-reaction essays.
        </p>
      </header>

      {/* ── Room cards ────────────────────────────────── */}
      <main style={{
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderLeft: room.borderLeft,
                borderTop: i % 2 === 0 ? '1px solid #1a1a1a' : '3px solid #1a1a1a',
                borderRight: '1px solid #0f0f0f',
                borderBottom: i % 2 === 0 ? '3px solid #1a1a1a' : '1px solid #0f0f0f',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background scratches */}
              <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.04 }}
              >
                <path
                  d={i === 0 ? 'M0,30 L100,70 M0,70 L100,30 M50,0 L48,100' : 'M10,5 L20,95 M80,5 L75,95 M0,50 L100,52'}
                  stroke="#f0f0f0" strokeWidth="0.8" fill="none" strokeLinecap="round"
                />
              </svg>

              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                letterSpacing: '5px',
                color: room.accent,
                textTransform: 'uppercase',
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
                marginTop: 'auto',
                paddingTop: '1rem',
              }}>
                {room.label}
              </h2>
            </div>
          </Link>
        ))}
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #0f0f0f',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '3px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '2px' }}>
          © KRKHOUSE
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555555', letterSpacing: '2px' }}>
          TWO ROOMS
        </span>
      </footer>
    </div>
  );
}
