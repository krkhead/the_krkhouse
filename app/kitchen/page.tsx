import RoomLayout from '@/app/components/RoomLayout';
import Link from 'next/link';
import { getEssays } from '@/lib/db';

export const revalidate = 300;

export default async function KitchenPage() {
  const essays = await getEssays();

  return (
    <RoomLayout room="kitchen" label="The Kitchen" subtitle="Culinary archive">
      {essays.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{ color: '#2a2a2a', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Essays forthcoming
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            backgroundColor: '#111',
          }}
        >
          {essays.map((essay) => (
            <Link key={essay.slug} href={`/kitchen/${essay.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#0a0a0a',
                  padding: '1.75rem 1.5rem',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                {essay.featured_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={essay.featured_image_url}
                    alt=""
                    style={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                      display: 'block',
                      marginBottom: '1rem',
                      filter: 'grayscale(10%)',
                    }}
                  />
                )}
                <div>
                  <h2
                    style={{
                      fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                      fontWeight: 700,
                      letterSpacing: '-1px',
                      color: '#d0d0d0',
                      lineHeight: 1.1,
                      fontFamily: '"Courier New", monospace',
                      textTransform: 'uppercase',
                    }}
                  >
                    {essay.title}
                  </h2>
                  {essay.excerpt && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#404040',
                        marginTop: '0.5rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {essay.excerpt}
                    </p>
                  )}
                </div>
                {essay.published_at && (
                  <p
                    style={{
                      fontSize: '0.6rem',
                      color: '#2a2a2a',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginTop: '1rem',
                    }}
                  >
                    {new Date(essay.published_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </RoomLayout>
  );
}
