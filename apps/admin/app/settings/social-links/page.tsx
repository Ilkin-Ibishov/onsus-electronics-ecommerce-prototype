'use client';

import { FormEvent, useEffect, useState } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
}

type FeedbackState =
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }
  | null;

const emptyLinks: SocialLinks = {
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
};

export default function SocialLinksSettingsPage() {
  const [role, setRole] = useState<Role>('viewer');
  const [links, setLinks] = useState<SocialLinks>(emptyLinks);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const canWrite = role === 'admin';

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [meRes, settingsRes] = await Promise.all([
        fetch('/api/auth/me', { cache: 'no-store' }),
        fetch('/api/settings/social-links', { cache: 'no-store' }),
      ]);
      if (!meRes.ok || !settingsRes.ok) {
        throw new Error('Failed to load settings.');
      }

      const me = (await meRes.json()) as { role: Role };
      const settings = (await settingsRes.json()) as {
        data: { socialLinks: SocialLinks; updatedAt: string };
      };
      setRole(me.role);
      setLinks(settings.data.socialLinks);
      setUpdatedAt(settings.data.updatedAt);
    } catch {
      setLoadError('Could not load social links settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) {
      setFeedback({ kind: 'error', message: 'Only admin can update settings.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/settings/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(links),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Save failed.');
      }

      const payload = (await response.json()) as { data: { updatedAt: string } };
      setUpdatedAt(payload.data.updatedAt);
      setFeedback({ kind: 'success', message: 'Social links updated successfully.' });
    } catch (saveError) {
      setFeedback({
        kind: 'error',
        message: saveError instanceof Error ? saveError.message : 'Unexpected save error.',
      });
    } finally {
      setSaving(false);
    }
  }

  const fields: (keyof SocialLinks)[] = [
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'youtube',
    'tiktok',
  ];

  return (
    <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Social links settings</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Role: <strong>{role}</strong>
      </p>
      {updatedAt ? (
        <p style={{ marginTop: 0, color: '#64748b' }}>
          Last updated: {new Date(updatedAt).toLocaleString()}
        </p>
      ) : null}

      {feedback ? (
        <div
          style={{
            border: feedback.kind === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
            background: feedback.kind === 'error' ? '#fef2f2' : '#f0fdf4',
            color: feedback.kind === 'error' ? '#991b1b' : '#166534',
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
          }}
        >
          {feedback.message}
        </div>
      ) : null}

      {loading ? (
        <p style={{ color: '#475569' }}>Loading settings...</p>
      ) : loadError ? (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', padding: 16 }}>
          <p style={{ margin: 0, color: '#991b1b' }}>{loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            style={{
              marginTop: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              background: '#fff',
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      ) : !canWrite ? (
        <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', padding: 16 }}>
          <p style={{ marginTop: 0, color: '#475569' }}>
            You have view-only access. Social link updates are restricted to admin role.
          </p>
          <ul style={{ margin: 0, paddingInlineStart: 20, color: '#334155' }}>
            {fields.map((key) => (
              <li key={key}>
                <strong style={{ textTransform: 'capitalize' }}>{key}:</strong>{' '}
                {links[key] || 'Not configured'}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <form
          onSubmit={handleSave}
          style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', padding: 16 }}
        >
          <div style={{ display: 'grid', gap: 10 }}>
            {fields.map((key) => (
              <label key={key} style={{ display: 'grid', gap: 6 }}>
                <span style={{ textTransform: 'capitalize' }}>{key}</span>
                <input
                  value={links[key]}
                  onChange={(event) =>
                    setLinks((prev) => ({ ...prev, [key]: event.target.value }))
                  }
                  placeholder={`https://${key}.com/your-page`}
                  disabled={saving}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                  }}
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 14,
              border: 0,
              borderRadius: 8,
              background: '#0f172a',
              color: '#fff',
              padding: '10px 14px',
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save social links'}
          </button>
        </form>
      )}
    </main>
  );
}
