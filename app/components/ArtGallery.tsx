'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Artwork } from '@/lib/types';

interface ArtGalleryProps {
  artworks: Artwork[];
  total: number;
}

// Deterministic rotation — never random at render time (avoids hydration mismatch)
const ROTATIONS = [-1.5, 0.7, -0.4, 1.2, -0.9, 0.5, -1.3, 0.3, -0.6, 1.1, -0.2, 0.8];
const MARGINS   = [0, 4, 0, 8, 2, 0, 6, 0, 3, 0, 7, 2]; // px bottom-margin variation

// Asymmetric border per item — cycles through 4 treatments
const BORDERS = [
  { borderLeft: '5px solid #e0ff00', borderTop: '1px solid #1a1a1a', borderRight: '1px solid #0f0f0f', borderBottom: '2px solid #1a1a1a' },
  { borderLeft: '1px solid #0f0f0f', borderTop: '4px solid #6B4C8A', borderRight: '2px solid #1a1a1a', borderBottom: '1px solid #0f0f0f' },
  { borderLeft: '3px solid #f0f0f0', borderTop: '1px solid #0f0f0f', borderRight: '1px solid #1a1a1a', borderBottom: '4px solid #1a1a1a' },
  { borderLeft: '1px solid #1a1a1a', borderTop: '2px solid #1a1a1a', borderRight: '5px solid #8B6F47', borderBottom: '1px solid #0f0f0f' },
];

// SVG scratch patterns (viewBox 0 0 100 100, preserveAspectRatio none)
const SCRATCHES = [
  'M8,15 Q45,8 92,22 M12,72 Q52,62 90,78 M48,3 L52,97',
  'M0,32 L100,68 M3,62 L97,38 M50,0 L47,100',
  'M12,0 L8,100 M88,0 L92,100 M0,48 L100,52 M0,53 L100,47',
  'M5,88 L95,12 M8,92 L92,8 M52,2 L48,98',
  'M0,22 Q28,12 58,28 Q88,44 100,38 M0,68 Q22,78 55,62 Q88,48 100,58',
  'M32,4 L68,96 M68,4 L32,96 M0,50 L100,50 M50,0 L50,100',
  'M15,0 L12,100 M30,5 L28,95 M70,0 L73,100 M85,5 L82,95',
  'M0,15 L100,85 M0,85 L100,15 M50,5 L52,95',
];

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
      if (e.key === 'ArrowRight') setExpanded((i) => i !== null ? Math.min(i + 1, items.length - 1) : null);
      if (e.key === 'ArrowLeft')  setExpanded((i) => i !== null ? Math.max(i - 1, 0) : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded, items.length]);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  return (
    <>
      {/* ── Masonry grid ─────────────────────────────── */}
      <div className="masonry-grid">
        {items.map((art, idx) => {
          const rot    = ROTATIONS[art.id % ROTATIONS.length];
          const mb     = MARGINS[art.id % MARGINS.length];
          const border = BORDERS[idx % BORDERS.length];
          const scratch = SCRATCHES[art.id % SCRATCHES.length];

          return (
            <div
              key={art.id}
              className="masonry-item glitch-hover"
              style={{
                transform: `rotate(${rot}deg)`,
                marginBottom: `${mb + 3}px`,
                ...border,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#0a0a0a',
              }}
            >
              <button
                onClick={() => setExpanded(idx)}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                }}
              >
                <Image
                  src={art.blob_url}
                  alt=""
                  width={800}
                  height={800}
                  priority={idx < 4}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    userSelect: 'none',
                  } as React.CSSProperties}
                />

                {/* SVG scratch overlay — disappears in expanded view */}
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
                    opacity: 0.22,
                  }}
                >
                  <path
                    d={scratch}
                    stroke="#f0f0f0"
                    strokeWidth="0.7"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Load more ─────────────────────────────────── */}
      {items.length < total && (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <button
            onClick={loadMore}
            disabled={loading}
            className="stamp-hover"
            style={{
              background: 'none',
              borderLeft: '4px solid #e0ff00',
              borderTop: '1px solid #404040',
              borderRight: '1px solid #404040',
              borderBottom: '3px solid #404040',
              color: loading ? '#2a2a2a' : '#f0f0f0',
              padding: '0.75rem 2.5rem',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : `Load more — ${total - items.length} remaining`}
          </button>
        </div>
      )}

      {/* ── Expanded view ─────────────────────────────── */}
      {expanded !== null && current && (
        <div
          onClick={() => setExpanded(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5,5,5,0.97)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Image — clean in expanded view (no scratches, no rotation) */}
          <div
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderLeft: '4px solid #e0ff00',
            }}
          >
            <Image
              src={current.blob_url}
              alt=""
              width={1600}
              height={1600}
              priority
              quality={90}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              sizes="90vw"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                userSelect: 'none',
              } as React.CSSProperties}
            />
            {/* Watermark */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(240,240,240,0.35)',
              letterSpacing: '1px',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              © Krkhouse
            </div>
          </div>

          {/* Nav controls */}
          <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((i) => i !== null ? Math.max(i - 1, 0) : null); }}
              disabled={expanded === 0}
              style={{
                background: 'none',
                border: '1px solid #333',
                color: expanded === 0 ? '#222' : '#f0f0f0',
                padding: '0.4rem 1.2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                cursor: expanded === 0 ? 'default' : 'pointer',
                letterSpacing: '1px',
              }}
            >←</button>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#404040',
              letterSpacing: '2px',
            }}>
              {expanded + 1} / {items.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((i) => i !== null ? Math.min(i + 1, items.length - 1) : null); }}
              disabled={expanded === items.length - 1}
              style={{
                background: 'none',
                border: '1px solid #333',
                color: expanded === items.length - 1 ? '#222' : '#f0f0f0',
                padding: '0.4rem 1.2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                cursor: expanded === items.length - 1 ? 'default' : 'pointer',
                letterSpacing: '1px',
              }}
            >→</button>
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
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              cursor: 'pointer',
              letterSpacing: '3px',
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
