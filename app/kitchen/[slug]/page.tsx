import { notFound } from 'next/navigation';
import RoomLayout from '@/app/components/RoomLayout';
import { getEssayBySlug } from '@/lib/db';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);
  if (!essay) notFound();

  return (
    <RoomLayout room="kitchen" label="The Kitchen">
      <article style={{ maxWidth: '680px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '-2px',
            textTransform: 'uppercase',
            color: '#d0d0d0',
            lineHeight: 1,
            fontFamily: '"Courier New", monospace',
            marginBottom: '0.75rem',
          }}
        >
          {essay.title}
        </h1>

        {essay.published_at && (
          <p
            style={{
              fontSize: '0.65rem',
              color: '#303030',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}
          >
            {new Date(essay.published_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        )}

        {essay.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={essay.featured_image_url}
            alt=""
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              display: 'block',
              marginBottom: '2.5rem',
              filter: 'contrast(1.05)',
            }}
          />
        )}

        {/* Prose */}
        <div
          style={{
            fontSize: '0.9rem',
            color: '#a0a0a0',
            lineHeight: 1.85,
            fontFamily: '"Courier New", monospace',
          }}
          dangerouslySetInnerHTML={{ __html: essay.content }}
        />
      </article>
    </RoomLayout>
  );
}
