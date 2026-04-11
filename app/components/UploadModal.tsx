'use client';

import { useState, useRef } from 'react';

interface UploadModalProps {
  onSuccess: (blobUrl: string) => void;
}

export default function UploadModal({ onSuccess }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onSuccess(data.blob_url);
      setOpen(false);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: '1px solid #404040',
          color: '#d0d0d0',
          padding: '0.35rem 1rem',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.65rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        + Upload
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0f0f0f',
              border: '1px solid #222',
              padding: '2rem',
              width: '100%',
              maxWidth: '420px',
            }}
          >
            <h3
              style={{
                fontSize: '0.7rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#6B4C8A',
                marginBottom: '1.5rem',
              }}
            >
              Add to Studio
            </h3>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ display: 'none' }}
            />

            <button
              onClick={() => inputRef.current?.click()}
              style={{
                width: '100%',
                border: '1px dashed #333',
                backgroundColor: 'transparent',
                color: file ? '#d0d0d0' : '#404040',
                padding: '2rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                letterSpacing: '1px',
              }}
            >
              {file ? file.name : 'Click to select image'}
            </button>

            {error && (
              <p style={{ color: '#A85C5C', fontSize: '0.7rem', marginTop: '0.75rem', letterSpacing: '0.5px' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSubmit}
                disabled={!file || uploading}
                style={{
                  flex: 1,
                  background: file && !uploading ? '#6B4C8A' : '#222',
                  border: 'none',
                  color: file && !uploading ? '#d0d0d0' : '#444',
                  padding: '0.6rem',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: file && !uploading ? 'pointer' : 'default',
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => { setOpen(false); setFile(null); setError(null); }}
                style={{
                  background: 'none',
                  border: '1px solid #222',
                  color: '#404040',
                  padding: '0.6rem 1rem',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
