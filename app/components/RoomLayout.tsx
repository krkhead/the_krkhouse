'use client';

import Link from 'next/link';

const ROOM_ACCENTS: Record<string, string> = {
  drive: '#8B6F47',
  kitchen: '#A85C5C',
  studio: '#6B4C8A',
};

interface RoomLayoutProps {
  room: 'drive' | 'kitchen' | 'studio';
  label: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function RoomLayout({ room, label, subtitle, children, actions }: RoomLayoutProps) {
  const accent = ROOM_ACCENTS[room];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid #222`,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.7rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#404040',
              textDecoration: 'none',
            }}
          >
            ← KRKHOUSE
          </Link>
          <div>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: accent,
                lineHeight: 1,
              }}
            >
              {label}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '1px',
                  color: '#404040',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && <div>{actions}</div>}
      </header>

      {/* Content */}
      <main style={{ padding: '1.5rem' }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #1a1a1a',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4rem',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#2a2a2a', letterSpacing: '1px' }}>
          © KRKHOUSE
        </span>
        <a
          href={process.env.NEXT_PUBLIC_SUBSTACK_URL ?? 'https://substack.com/@teganora'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#404040', fontSize: '0.65rem', letterSpacing: '1px', textDecoration: 'none' }}
          title="Substack"
        >
          SUBSTACK ↗
        </a>
      </footer>
    </div>
  );
}
