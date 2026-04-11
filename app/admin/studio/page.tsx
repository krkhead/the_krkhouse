'use client';

import { useState, useEffect, useRef } from 'react';
import type { Artwork } from '@/lib/types';

const BTN = {
  base: {
    fontSize: '0.6rem',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    border: '1px solid #333',
    padding: '0.4rem 0.85rem',
    cursor: 'pointer',
    fontFamily: '"Courier New", monospace',
  },
};

export default function AdminStudio() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const LIMIT = 50;

  async function load(off = 0) {
    setLoading(true);
    const res = await fetch(`/api/art/list?limit=${LIMIT}&offset=${off}`);
    const data = await res.json();
    setArtworks(data.items ?? []);
    setTotal(data.total ?? 0);
    setOffset(off);
    setLoading(false);
  }

  useEffect(() => { load(0); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setMsg(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);

    let done = 0;
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: form });
      done++;
      setMsg(`Uploaded ${done} / ${files.length}`);
    }

    setUploading(false);
    setMsg(`Done — ${done} uploaded`);
    if (fileRef.current) fileRef.current.value = '';
    load(0);
  }

  async function handleDelete(artwork: Artwork) {
    if (!confirm(`Delete "${artwork.filename}"?`)) return;
    setDeletingId(artwork.id);
    await fetch(`/api/admin/artworks/${artwork.id}`, { method: 'DELETE' });
    setDeletingId(null);
    setMsg(`Deleted: ${artwork.filename}`);
    load(offset);
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#6B4C8A', textTransform: 'uppercase' }}>
            Studio
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#404040', marginTop: '4px' }}>
            {total} artworks
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {msg && (
            <span style={{ fontSize: '0.6rem', color: '#505050', letterSpacing: '1px' }}>{msg}</span>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ ...BTN.base, backgroundColor: '#111', color: uploading ? '#333' : '#d0d0d0' }}
          >
            {uploading ? 'Uploading...' : '+ Upload'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ fontSize: '0.65rem', color: '#303030', letterSpacing: '2px' }}>Loading...</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '2px',
              backgroundColor: '#111',
            }}
          >
            {artworks.map((art) => (
              <div
                key={art.id}
                style={{ position: 'relative', backgroundColor: '#0a0a0a', aspectRatio: '1', overflow: 'hidden' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.blob_url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Delete overlay */}
                <button
                  onClick={() => handleDelete(art)}
                  disabled={deletingId === art.id}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(10,10,10,0.85)',
                    border: '1px solid #333',
                    color: deletingId === art.id ? '#333' : '#8B5A6B',
                    fontSize: '0.55rem',
                    letterSpacing: '1px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                  }}
                >
                  {deletingId === art.id ? '...' : 'DEL'}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <button
                onClick={() => load(Math.max(0, offset - LIMIT))}
                disabled={offset === 0}
                style={{ ...BTN.base, backgroundColor: '#111', color: offset === 0 ? '#333' : '#d0d0d0' }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '0.6rem', color: '#404040' }}>
                {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
              </span>
              <button
                onClick={() => load(offset + LIMIT)}
                disabled={offset + LIMIT >= total}
                style={{ ...BTN.base, backgroundColor: '#111', color: offset + LIMIT >= total ? '#333' : '#d0d0d0' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
