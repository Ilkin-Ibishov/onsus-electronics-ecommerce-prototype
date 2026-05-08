import { NextResponse } from 'next/server';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_ROLE_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  isAdminLoginAllowed,
  normalizeAdminRole,
} from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { checkLoginAttempt } from '@/lib/login-rate-limit';
import { logApiError } from '@/lib/api-error';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for') ?? '';
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
  const rateLimit = checkLoginAttempt({
    ip,
    email,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth
    .signInWithPassword({
      email,
      password,
    })
    .catch((authError) => {
      logApiError('auth:login:signInWithPassword', authError);
      return {
        data: null,
        error: authError as Error,
      };
    });

  if (error || !data.session || !data.user) {
    checkLoginAttempt({
      ip,
      email,
      loginSucceeded: false,
    });
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
  }

  const metadataRole =
    typeof data.user.app_metadata?.role === 'string'
      ? data.user.app_metadata.role
      : typeof data.user.user_metadata?.role === 'string'
        ? data.user.user_metadata.role
        : undefined;
  const role = normalizeAdminRole(metadataRole);
  if (!isAdminLoginAllowed(role)) {
    checkLoginAttempt({
      ip,
      email,
      loginSucceeded: false,
    });
    return NextResponse.json({ error: 'User is not authorized for admin access.' }, { status: 403 });
  }

  checkLoginAttempt({
    ip,
    email,
    loginSucceeded: true,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_ACCESS_TOKEN_COOKIE,
    value: data.session.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  response.cookies.set({
    name: ADMIN_REFRESH_TOKEN_COOKIE,
    value: data.session.refresh_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  response.cookies.set({
    name: ADMIN_ROLE_COOKIE,
    value: role,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
