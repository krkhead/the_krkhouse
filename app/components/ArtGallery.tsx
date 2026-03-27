'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '@/lib/types';

interface ArtGalleryProps {
  artworks: Artwork[];
  total: number;
}

export default function ArtGallery({ artworks, total }: ArtGalleryProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [items, setItems] = useState<Artwork[]>(artworks);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(artworks.length);

  const current = expanded !== null ? items[expanded] : null;

  const loadMore = useCallback(async () => {
    if (loading || items.length >= total) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/art/list?limit=50&offset=${offset}`);
      const data = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setOffset((prev) => prev + data.items.length);
    } finally {
      setLoading(false);
    }
  }, [loading, items.length, total, offset]);

  // Keyboard navigation
  useEffect(() => {
    if (expanded === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(null);
      if (e.key === 'ArrowRight') setExpanded((i) => (i !== null ? Math.min(i + 1, items.length - 1) : null));
      if (e.key === 'ArrowLeft') setExpanded((i) => (i !== null ? Math.max(i - 1, 0) : null));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded, items.length]);

  // Prevent body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  return (
    <>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '2px',
          backgroundColor: '#111',
        }}
      >
        {items.map((art, idx) => (
          <button
            key={art.id}
            onClick={() => setExpanded(idx)}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              all: 'unset',
              cursor: 'pointer',
              aspectRatio: '1',
              overflow: 'hidden',
              display: 'block',
              backgroundColor: '#0f0f0f',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.blob_url}
              alt=""
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                userSelect: 'none',
                WebkitUserDrag: 'none' as unknown as undefined,
              } as React.CSSProperties}
            />
          </button>
        ))}
      </div>

      {/* Load more */}
      {items.length < total && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              background: 'none',
              border: '1px solid #404040',
              color: '#d0d0d0',
              padding: '0.5rem 2rem',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.7rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Loading...' : `Load more (${total - items.length} remaining)`}
          </button>
        </div>
      )}

      {/* Expanded view */}
      {expanded !== null && current && (
        <div
          onClick={() => setExpanded(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.96)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Image container */}
          <div
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.blob_url}
              alt=""
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block',
                userSelect: 'none',
              } as React.CSSProperties}
            />
            {/* Watermark overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                fontSize: '0.7rem',
                color: 'rgba(208,208,208,0.45)',
                fontFamily: '"Courier New", monospace',
                letterSpacing: '1px',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              © Krkhouse
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((i) => (i !== null ? Math.max(i - 1, 0) : null)); }}
              disabled={expanded === 0}
              style={{
                background: 'none',
                border: '1px solid #333',
                color: expanded === 0 ? '#2a2a2a' : '#d0d0d0',
                padding: '0.4rem 1rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.7rem',
                cursor: expanded === 0 ? 'default' : 'pointer',
                letterSpacing: '1px',
              }}
            >
              ←
            </button>
            <span style={{ fontSize: '0.65rem', color: '#404040', letterSpacing: '1px' }}>
              {expanded + 1} / {items.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((i) => (i !== null ? Math.min(i + 1, items.length - 1) : null)); }}
              disabled={expanded === items.length - 1}
              style={{
                background: 'none',
                border: '1px solid #333',
                color: expanded === items.length - 1 ? '#2a2a2a' : '#d0d0d0',
                padding: '0.4rem 1rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.7rem',
                cursor: expanded === items.length - 1 ? 'default' : 'pointer',
                letterSpacing: '1px',
              }}
            >
              →
            </button>
          </div>

          {/* Close */}
          <button
            onClick={() => setExpanded(null)}
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#404040',
              fontSize: '0.7rem',
              fontFamily: '"Courier New", monospace',
              cursor: 'pointer',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Close [ESC]
          </button>
        </div>
      )}
    </>
  );
}
