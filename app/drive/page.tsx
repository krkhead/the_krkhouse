'use client';

import { useMemo } from 'react';
import RoomLayout from '@/app/components/RoomLayout';

// All available playlist lanes — add more here as needed
const ALL_LANES = [
  {
    id: 'astral',
    playlistId: '4sssNLoBjV0SvDQ8ClK25V',
    label: 'Astral',
    desc: 'Elevation. Atmosphere. Float above the noise.',
    accent: '#8B6F47',
  },
  {
    id: 'technical',
    playlistId: '7wT4DYZViAYKOOb4jyWJq3',
    label: 'Technical',
    desc: 'Precision. Cadence. Rhythmic intelligence.',
    accent: '#6B7A8B',
  },
  {
    id: 'sonic',
    playlistId: '3HEMAS8C4NPVSVf9cj4Ymm',
    label: 'Sonic',
    desc: 'Immediate impact. Energy. Presence.',
    accent: '#8B5A6B',
  },
] as const;

// How many lanes to show at once
const LANES_TO_SHOW = 3;

/**
 * Seeded shuffle — deterministic per day so all visitors see the same order,
 * but the order rotates every day. Uses a simple LCG seeded by the date string.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function dateSeed(): number {
  const d = new Date();
  // e.g. 20260410 — changes daily
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export default function DrivePage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Shuffle once per render; stable within the same day
  const lanes = useMemo(
    () => seededShuffle([...ALL_LANES], dateSeed()).slice(0, LANES_TO_SHOW),
    []
  );

  return (
    <RoomLayout room="drive" label="The Drive" subtitle="Sound">

      {/* ── Bleeding headline ──────────────────────────── */}
      <div style={{ overflow: 'visible', marginBottom: '0.25rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 10vw, 7rem)',
          lineHeight: 0.85,
          letterSpacing: '-2px',
          color: '#f0f0f0',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          marginLeft: '-2px',
        }}>
          Nobody Drives<br />
          <span style={{ color: '#e0ff00' }}>In Silence</span><br />
          Anymore.
        </h1>
      </div>

      {/* Body copy — acid yellow box */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: '#050505',
        lineHeight: 1.8,
        maxWidth: 480,
        letterSpacing: '0.3px',
        marginBottom: '0.5rem',
        backgroundColor: '#e0ff00',
        padding: '0.75rem 1rem',
        display: 'inline-block',
      }}>
        Texture to survive the gridlock. The daily rotation of sonic grit,
        astral dissonance, and underground technicality. Seeded daily. Played loud.
      </p>

      {/* Date stamp */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '3px',
        color: '#888888',
        textTransform: 'uppercase',
        marginBottom: '3rem',
        borderTop: '1px solid #1a1a1a',
        paddingTop: '0.75rem',
      }}>
        {today}
      </p>

      {/* ── Shuffled playlist lanes ────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#111' }}>
        {lanes.map((lane) => (
          <div
            key={lane.id}
            style={{
              backgroundColor: '#050505',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: `4px solid ${lane.accent}`,
            }}
          >
            <div>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                letterSpacing: '-0.5px',
                color: lane.accent,
                textTransform: 'uppercase',
                lineHeight: 0.9,
                marginBottom: '0.35rem',
              }}>
                {lane.label}
              </span>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: '#888888',
                letterSpacing: '1px',
              }}>
                {lane.desc}
              </p>
            </div>

            <iframe
              src={`https://open.spotify.com/embed/playlist/${lane.playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={`${lane.label} playlist`}
              style={{ border: 0 }}
            />
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        color: '#606060',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginTop: '3rem',
      }}>
        Played loud.
      </p>
    </RoomLayout>
  );
}
