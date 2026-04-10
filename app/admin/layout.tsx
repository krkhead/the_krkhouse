'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  const tab = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        style={{
          fontSize: '0.6rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: active ? '#d0d0d0' : '#404040',
          borderBottom: active ? '1px solid #d0d0d0' : '1px solid transparent',
          paddingBottom: '2px',
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #1a1a1a',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '2px',
              color: '#303030',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            ← Site
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {tab('/admin/studio', 'Studio')}
            {tab('/admin/kitchen', 'Kitchen')}
          </nav>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1px solid #222',
            color: '#404040',
            fontSize: '0.6rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: '2rem 1.5rem' }}>{children}</main>
    </div>
  );
}
