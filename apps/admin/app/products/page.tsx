'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  stockAvailable: number;
  imageUrl: string;
  updatedAt: string;
}

interface ProductInput {
  name: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  stockAvailable: string;
  imageUrl: string;
}

type FeedbackState =
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }
  | null;

const emptyForm: ProductInput = {
  name: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  discountPercent: '0',
  stockAvailable: '0',
  imageUrl: '',
};

export default function ProductsPage() {
  const [role, setRole] = useState<Role>('viewer');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const canWrite = role === 'admin' || role === 'editor';
  const canDelete = role === 'admin';
  const title = useMemo(() => (editingId ? 'Edit product' : 'Create product'), [editingId]);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [meRes, productsRes] = await Promise.all([
        fetch('/api/auth/me', { cache: 'no-store' }),
        fetch(
          `/api/products?search=${encodeURIComponent(search)}&categoryId=${encodeURIComponent(
            categoryFilter
          )}`,
          { cache: 'no-store' }
        ),
      ]);
      if (!meRes.ok || !productsRes.ok) {
        throw new Error('Failed to load products.');
      }

      const me = (await meRes.json()) as { role: Role };
      const payload = (await productsRes.json()) as { data: Product[]; categories: Category[] };
      setRole(me.role);
      setProducts(payload.data);
      setCategories(payload.categories);
    } catch {
      setLoadError('Could not load products. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await load();
  }

  function normalizePayload() {
    return {
      name: form.name.trim(),
      categoryId: form.categoryId,
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
      discountPercent: Number(form.discountPercent),
      stockAvailable: Number(form.stockAvailable),
      imageUrl: form.imageUrl.trim(),
    };
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) {
      setFeedback({ kind: 'error', message: 'Your role is read-only.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizePayload()),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Save failed.');
      }
      setEditingId(null);
      setForm(emptyForm);
      await load();
      setFeedback({
        kind: 'success',
        message: editingId ? 'Product updated successfully.' : 'Product created successfully.',
      });
    } catch (saveError) {
      setFeedback({
        kind: 'error',
        message: saveError instanceof Error ? saveError.message : 'Unexpected save error.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!canDelete) {
      setFeedback({ kind: 'error', message: 'Only admins can delete products.' });
      return;
    }
    const target = products.find((item) => item.id === id);
    if (!window.confirm(`Delete product "${target?.name ?? 'this item'}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Delete failed.');
      }
      await load();
      setFeedback({ kind: 'success', message: 'Product deleted successfully.' });
    } catch (deleteError) {
      setFeedback({
        kind: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Unexpected delete error.',
      });
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(item: Product) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      price: String(item.price),
      originalPrice: item.originalPrice === null ? '' : String(item.originalPrice),
      discountPercent: String(item.discountPercent),
      stockAvailable: String(item.stockAvailable),
      imageUrl: item.imageUrl,
    });
  }

  return (
    <main style={{ maxWidth: 1180, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Products</h1>
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
          {feedback.message}
        </div>
      ) : null}

      <section
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#fff',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Filters</h2>
        <form onSubmit={applyFilters} style={{ display: 'grid', gap: 8, gridTemplateColumns: '2fr 1fr auto' }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name"
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              border: 0,
              borderRadius: 8,
              background: '#0f172a',
              color: '#fff',
              padding: '10px 14px',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </form>
      </section>

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
          <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1.2fr 1fr 1fr 1fr' }}>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Product name"
              required
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              required
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Price"
              required
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <input
              type="number"
              step="0.01"
              value={form.originalPrice}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, originalPrice: event.target.value }))
              }
              placeholder="Original price (optional)"
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <input
              type="number"
              value={form.discountPercent}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, discountPercent: event.target.value }))
              }
              placeholder="Discount %"
              required
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <input
              type="number"
              value={form.stockAvailable}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, stockAvailable: event.target.value }))
              }
              placeholder="Stock available"
              required
              disabled={saving}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            <input
              value={form.imageUrl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
              }
              placeholder="Image URL"
              required
              disabled={saving}
              style={{
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                gridColumn: 'span 2',
              }}
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
              {saving ? 'Saving...' : editingId ? 'Update product' : 'Create product'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  background: '#fff',
                  padding: '10px 14px',
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
          You have view-only access. Product create/edit actions are available for admin and editor roles.
        </section>
      )}

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
        <header style={{ padding: 14, borderBottom: '1px solid #e2e8f0' }}>
          <strong>All products</strong>
        </header>

        {loading ? (
          <p style={{ margin: 0, padding: 14, color: '#475569' }}>Loading...</p>
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
        ) : products.length === 0 ? (
          <p style={{ margin: 0, padding: 14, color: '#475569' }}>
            No products found for current filter.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Category</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Price</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Stock</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Updated</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12 }}>{item.name}</td>
                  <td style={{ padding: 12, color: '#475569' }}>{item.categoryName}</td>
                  <td style={{ padding: 12 }}>
                    {item.price} {item.originalPrice ? `(orig ${item.originalPrice})` : ''}
                  </td>
                  <td style={{ padding: 12 }}>{item.stockAvailable}</td>
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
