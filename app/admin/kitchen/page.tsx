'use client';

import { useState, useEffect } from 'react';
import type { Essay } from '@/lib/types';

const INPUT = {
  backgroundColor: '#111',
  border: '1px solid #222',
  color: '#d0d0d0',
  padding: '0.65rem 0.85rem',
  fontSize: '0.8rem',
  fontFamily: '"Courier New", monospace',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const BTN_BASE = {
  fontSize: '0.6rem',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  border: '1px solid #333',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontFamily: '"Courier New", monospace',
};

const EMPTY_FORM = { title: '', slug: '', excerpt: '', content: '', published_at: '' };

export default function AdminKitchen() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  async function loadEssays() {
    setLoading(true);
    const res = await fetch('/api/content/kitchen');
    const data = await res.json();
    setEssays(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadEssays(); }, []);

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm((f) => ({ ...f, title: value, slug }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setSaving(true);
    setMsg('');

    const res = await fetch('/api/admin/essays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      setMsg('Essay published');
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadEssays();
    } else {
      const err = await res.json();
      setMsg(err.error ?? 'Failed to save');
    }
  }

  async function handleDelete(essay: Essay) {
    if (!confirm(`Delete "${essay.title}"?`)) return;
    setDeletingId(essay.id);
    await fetch(`/api/admin/essays/${essay.id}`, { method: 'DELETE' });
    setDeletingId(null);
    setMsg(`Deleted: ${essay.title}`);
    loadEssays();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '0.7rem', letterSpacing: '4px', color: '#A85C5C', textTransform: 'uppercase' }}>
            Kitchen
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#404040', marginTop: '4px' }}>
            {essays.length} essays
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {msg && <span style={{ fontSize: '0.6rem', color: '#505050', letterSpacing: '1px' }}>{msg}</span>}
          <button
            onClick={() => { setShowForm(!showForm); setMsg(''); }}
            style={{ ...BTN_BASE, backgroundColor: '#111', color: '#d0d0d0' }}
          >
            {showForm ? '× Cancel' : '+ New Essay'}
          </button>
        </div>
      </div>

      {/* New essay form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid #1a1a1a',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.6rem', letterSpacing: '3px', color: '#404040', textTransform: 'uppercase' }}>
            New Essay
          </p>

          <input
            style={INPUT}
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <input
            style={INPUT}
            placeholder="Slug (auto-generated)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />

          <input
            style={INPUT}
            placeholder="Excerpt (optional — shown in grid)"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />

          <input
            style={INPUT}
            type="date"
            value={form.published_at}
            onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
            title="Publish date (leave blank to publish now)"
          />

          <textarea
            style={{ ...INPUT, minHeight: 280, resize: 'vertical', lineHeight: 1.6 }}
            placeholder={`Content — write plain text or HTML.\n\nDouble line breaks become paragraphs.\n\nOr use HTML: <p>, <strong>, <em>, <ul>, <li> etc.`}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ ...BTN_BASE, backgroundColor: '#1a1a1a', color: saving ? '#333' : '#d0d0d0' }}
            >
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </form>
      )}

      {/* Essays list */}
      {loading ? (
        <p style={{ fontSize: '0.65rem', color: '#303030', letterSpacing: '2px' }}>Loading...</p>
      ) : essays.length === 0 ? (
        <p style={{ fontSize: '0.65rem', color: '#303030', letterSpacing: '2px' }}>No essays yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#111' }}>
          {essays.map((essay) => (
            <div
              key={essay.id}
              style={{
                backgroundColor: '#0a0a0a',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.85rem', color: '#d0d0d0', fontFamily: '"Courier New", monospace', fontWeight: 700 }}>
                  {essay.title}
                </p>
                <p style={{ fontSize: '0.6rem', color: '#404040', marginTop: '4px', letterSpacing: '1px' }}>
                  /{essay.slug}
                  {essay.published_at && (
                    <> · {new Date(essay.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                  )}
                </p>
                {essay.excerpt && (
                  <p style={{ fontSize: '0.7rem', color: '#303030', marginTop: '6px', lineHeight: 1.5 }}>
                    {essay.excerpt}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(essay)}
                disabled={deletingId === essay.id}
                style={{
                  ...BTN_BASE,
                  backgroundColor: 'transparent',
                  color: deletingId === essay.id ? '#333' : '#8B5A6B',
                  flexShrink: 0,
                  padding: '0.35rem 0.65rem',
                }}
              >
                {deletingId === essay.id ? '...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
