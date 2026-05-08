'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Login failed. Check credentials and role claim.');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('Unexpected network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Admin sign in</h1>
        <p style={{ marginTop: 0, color: '#475569' }}>
          Sign in with Supabase credentials. Role claim is verified server-side.
        </p>

        <label htmlFor="email" style={{ display: 'block', marginBottom: 8 }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{
            width: '100%',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 12,
          }}
        />

        <label htmlFor="password" style={{ display: 'block', marginBottom: 8 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{
            width: '100%',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 12,
          }}
        />

        {error ? (
          <p style={{ color: '#b91c1c', marginTop: 0, marginBottom: 12 }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          style={{
            border: 0,
            borderRadius: 8,
            background: '#0f172a',
            color: '#fff',
            padding: '10px 14px',
            cursor: submitting ? 'default' : 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
