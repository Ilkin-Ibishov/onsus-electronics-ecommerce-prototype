'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <main style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Admin dashboard scaffold</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Batch 1 is active: auth guard and shell are in place. CRUD modules come next.
      </p>

      <section
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 16,
          marginTop: 24,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Next batch targets</h2>
        <ul>
          <li>
            <Link href="/categories">Categories CRUD</Link>
          </li>
          <li>
            <Link href="/products">Products CRUD</Link>
          </li>
          <li>
            <Link href="/settings/social-links">Social links/settings CRUD</Link>
          </li>
        </ul>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void logout();
          }}
        >
          <button
            type="submit"
            style={{
              marginTop: 8,
              border: 0,
              borderRadius: 8,
              background: '#0f172a',
              color: '#fff',
              padding: '10px 14px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
