import { cookies } from 'next/headers';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_ROLE_COOKIE,
  normalizeAdminRole,
} from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return Response.json({
      authenticated: false,
      role: 'viewer',
    });
  }

  const supabase = createSupabaseServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return Response.json({
      authenticated: false,
      role: 'viewer',
    });
  }

  const role = normalizeAdminRole(
    typeof data.user.app_metadata?.role === 'string'
      ? data.user.app_metadata.role
      : typeof data.user.user_metadata?.role === 'string'
        ? data.user.user_metadata.role
        : cookieStore.get(ADMIN_ROLE_COOKIE)?.value
  );

  return Response.json({
    authenticated: true,
    role,
  });
}
