'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  updatedAt: string;
}

interface CategoryInput {
  name: string;
  slug: string;
  sortOrder: string;
}

type FeedbackState =
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }
  | null;

const emptyInput: CategoryInput = { name: '', slug: '', sortOrder: '0' };

export default function CategoriesPage() {
  const [role, setRole] = useState<Role>('viewer');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyInput);

  const canWrite = role === 'admin' || role === 'editor';
  const canDelete = role === 'admin';
  const title = useMemo(
    () => (editingId ? 'Edit category' : 'Create category'),
    [editingId]
  );

  async function load() {
    setLoading(true);
    setLoadError(null);
    setFeedback(null);
    try {
      const [meRes, categoriesRes] = await Promise.all([
        fetch('/api/auth/me', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);

      if (!meRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to load categories.');
      }

      const me = (await meRes.json()) as { role: Role };
      const list = (await categoriesRes.json()) as { data: Category[] };
      setRole(me.role);
      setCategories(list.data);
    } catch {
      setLoadError('Could not load categories. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) {
      setFeedback({ kind: 'error', message: 'Your role is read-only.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        sortOrder: Number(form.sortOrder),
      };

      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Save failed.');
      }

      setForm(emptyInput);
      setEditingId(null);
      await load();
      setFeedback({
        kind: 'success',
        message: editingId ? 'Category updated successfully.' : 'Category created successfully.',
      });
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Unexpected save error.';
      setFeedback({ kind: 'error', message });
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: Category) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      sortOrder: String(item.sortOrder),
    });
  }

  async function handleDelete(id: string) {
    if (!canDelete) {
      setFeedback({ kind: 'error', message: 'Only admins can delete categories.' });
      return;
    }

    const target = categories.find((item) => item.id === id);
    if (!window.confirm(`Delete category "${target?.name ?? 'this item'}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Delete failed.');
      }
      await load();
      setFeedback({ kind: 'success', message: 'Category deleted successfully.' });
    } catch (deleteError) {
      setFeedback({
        kind: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Unexpected delete error.',
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main style={{ maxWidth: 1080, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Categories</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Role: <strong>{role}</strong>
      </p>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <span>{feedback.message}</span>
          </div>
        </div>
      ) : null}

      {canWrite ? (
        <section
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            background: '#fff',
            padding: 16,
            marginBottom: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 140px' }}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                disabled={saving}
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
              />
              <input
                placeholder="slug-value"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                required
                disabled={saving}
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
              />
              <input
                type="number"
                min={0}
                placeholder="Sort order"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sortOrder: event.target.value }))
                }
                required
                disabled={saving}
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  border: 0,
                  borderRadius: 8,
                  background: '#0f172a',
                  color: '#fff',
                  padding: '10px 14px',
                  cursor: saving ? 'default' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyInput);
                  }}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    background: '#fff',
                    padding: '10px 14px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </section>
      ) : (
        <section
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            background: '#fff',
            padding: 16,
            marginBottom: 20,
            color: '#475569',
          }}
        >
          You have view-only access. Category edits are available for admin and editor roles.
        </section>
      )}

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
        <header style={{ padding: 14, borderBottom: '1px solid #e2e8f0' }}>
          <strong>All categories</strong>
        </header>

        {loading ? (
          <p style={{ padding: 14, margin: 0, color: '#475569' }}>Loading...</p>
        ) : loadError ? (
          <div style={{ padding: 14 }}>
            <p style={{ margin: 0, color: '#991b1b' }}>{loadError}</p>
            <button
              type="button"
              onClick={() => void load()}
              style={{
                marginTop: 8,
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
        ) : categories.length === 0 ? (
          <p style={{ padding: 14, margin: 0, color: '#475569' }}>
            No categories yet. Create your first category above.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Slug</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Sort</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Updated</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12 }}>{item.name}</td>
                  <td style={{ padding: 12, color: '#475569' }}>{item.slug}</td>
                  <td style={{ padding: 12 }}>{item.sortOrder}</td>
                  <td style={{ padding: 12, color: '#475569' }}>
                    {new Date(item.updatedAt).toLocaleString()}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {canWrite ? (
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            background: '#fff',
                            padding: '6px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => void handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          style={{
                            border: 0,
                            borderRadius: 8,
                            background: '#b91c1c',
                            color: '#fff',
                            padding: '6px 10px',
                            cursor: deletingId === item.id ? 'default' : 'pointer',
                            opacity: deletingId === item.id ? 0.6 : 1,
                          }}
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
