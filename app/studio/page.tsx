import RoomLayout from '@/app/components/RoomLayout';
import ArtGallery from '@/app/components/ArtGallery';
import StudioActions from '@/app/components/StudioActions';
import { getArtworks } from '@/lib/db';

export const revalidate = 60;

export default async function StudioPage() {
  const { total, items } = await getArtworks(50, 0);

  return (
    <RoomLayout
      room="studio"
      label="The Studio"
      subtitle={`${total} works`}
      actions={<StudioActions />}
    >
      {items.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{ color: '#2a2a2a', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            No works yet
          </p>
        </div>
      ) : (
        <ArtGallery artworks={items} total={total} />
      )}
    </RoomLayout>
  );
}
