'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = '/admin/studio';
    } else {
      setError('Wrong password');
      setPassword('');
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360, padding: '0 1.5rem' }}>
        <p
          style={{
            fontSize: '0.6rem',
            letterSpacing: '4px',
            color: '#404040',
            textTransform: 'uppercase',
            marginBottom: '2rem',
          }}
        >
          Krkhouse — Admin
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            required
            style={{
              backgroundColor: '#111',
              border: '1px solid #222',
              color: '#d0d0d0',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              fontFamily: '"Courier New", monospace',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ fontSize: '0.7rem', color: '#8B5A6B', letterSpacing: '1px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              color: loading ? '#333' : '#d0d0d0',
              padding: '0.75rem',
              fontSize: '0.65rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: '"Courier New", monospace',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
