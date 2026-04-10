import RoomLayout from '@/app/components/RoomLayout';
import ArtGallery from '@/app/components/ArtGallery';
import { getArtworks } from '@/lib/db';
// Upload is admin-only — no public upload button

export const revalidate = 60;

export default async function StudioPage() {
  const { total, items } = await getArtworks(50, 0);

  return (
    <RoomLayout room="studio" label="The Studio" subtitle="Art">

      {/* ── Bleeding headline ──────────────────────────── */}
      <div style={{ overflow: 'visible', marginBottom: '0.25rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 13vw, 9rem)',
          lineHeight: 0.85,
          letterSpacing: '-3px',
          color: '#f0f0f0',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          marginLeft: '-3px',
        }}>
          The<br />
          <span style={{ color: '#e0ff00' }}>Visual</span><br />
          Noise.
        </h1>
      </div>

      {/* Body copy */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: '#404040',
        lineHeight: 1.8,
        maxWidth: 420,
        letterSpacing: '0.3px',
        marginBottom: '0.5rem',
      }}>
        Frantic linework and high-contrast expressionism.
        The ugly-cool archive. {total > 0 ? `${total}+` : '202+'} artifacts.
        Look, but don&apos;t touch.
      </p>

      {/* Count stamp */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '3px',
        color: '#2a2a2a',
        textTransform: 'uppercase',
        marginBottom: '3rem',
        borderTop: '1px solid #111',
        paddingTop: '0.75rem',
      }}>
        {total} works in the archive
      </p>

      {/* ── Gallery ───────────────────────────────────── */}
      {items.length === 0 ? (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: '#2a2a2a',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          padding: '4rem 0',
        }}>
          Nothing yet. The archive is loading.
        </p>
      ) : (
        <ArtGallery artworks={items} total={total} />
      )}
    </RoomLayout>
  );
}
