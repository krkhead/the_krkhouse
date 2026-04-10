'use client';

import Link from 'next/link';

const ROOM_ACCENTS: Record<string, string> = {
  drive:  '#8B6F47',
  studio: '#6B4C8A',
};

interface RoomLayoutProps {
  room: 'drive' | 'studio';
  label: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function RoomLayout({ room, label, subtitle, children, actions }: RoomLayoutProps) {
  const accent = ROOM_ACCENTS[room];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{
        borderBottom: '3px solid #111',
        borderLeft: `6px solid ${accent}`,
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: '#050505',
        zIndex: 50,
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
          <Link
            href="/"
            className="stamp-hover"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#303030',
              textDecoration: 'none',
              paddingBottom: '2px',
            }}
          >
            ← KRK
          </Link>

          {/* Room name — brutalist header, bleeds into the space */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              lineHeight: 0.88,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: '#f0f0f0',
            }}>
              {label}
            </h2>
            {subtitle && (
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                letterSpacing: '3px',
                color: accent,
                textTransform: 'uppercase',
                marginTop: '3px',
              }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {actions && <div>{actions}</div>}
      </header>

      {/* ── Content ────────────────────────────────────── */}
      <main style={{ padding: '1.5rem' }}>{children}</main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #0f0f0f',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '4rem',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#1a1a1a', letterSpacing: '2px' }}>
          © KRKHOUSE
        </span>
        <a
          href="https://substack.com/@teganora"
          target="_blank"
          rel="noopener noreferrer"
          className="stamp-hover"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: '#303030',
            letterSpacing: '2px',
            textDecoration: 'none',
          }}
        >
          SUBSTACK ↗
        </a>
      </footer>
    </div>
  );
}
