'use client';

import UploadModal from './UploadModal';

export default function StudioActions() {
  return (
    <UploadModal
      onSuccess={() => {
        window.location.reload();
      }}
    />
  );
}
