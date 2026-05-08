# Admin app scaffold (Batch 1)

This is the standalone admin surface scaffold.

## Current batch scope

- Login page (`/login`)
- Server-side login endpoint (`/api/auth/login`)
- Middleware guard for protected routes
- Protected dashboard shell (`/`)
- Supabase-backed categories/products/settings CRUD APIs

## Environment

Set these vars in admin runtime environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Run locally

```bash
cd apps/admin
npm install
npm run dev
```

Open `http://localhost:3000/login` and sign in with a Supabase user that has `role` claim (`admin` or `editor`) in `app_metadata` or `user_metadata`.
