import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  normalizeAdminRole,
  type AdminRole,
} from '@/lib/auth';

export type AdminMutationPermission =
  | 'categories:create'
  | 'categories:update'
  | 'categories:delete'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'settings:social-links:update';

export type AdminReadPermission =
  | 'categories:read'
  | 'products:read'
  | 'settings:social-links:read';

const PERMISSION_MATRIX: Record<AdminMutationPermission, AdminRole[]> = {
  'categories:create': ['admin', 'editor'],
  'categories:update': ['admin', 'editor'],
  'categories:delete': ['admin'],
  'products:create': ['admin', 'editor'],
  'products:update': ['admin', 'editor'],
  'products:delete': ['admin'],
  'settings:social-links:update': ['admin'],
};

const READ_PERMISSION_MATRIX: Record<AdminReadPermission, AdminRole[]> = {
  'categories:read': ['admin', 'editor', 'viewer'],
  'products:read': ['admin', 'editor', 'viewer'],
  'settings:social-links:read': ['admin'],
};

type SupabaseAuthUserLike = {
  app_metadata?: unknown;
};

export function isMutationAllowed(role: AdminRole, permission: AdminMutationPermission): boolean {
  return PERMISSION_MATRIX[permission].includes(role);
}

export function isReadAllowed(role: AdminRole, permission: AdminReadPermission): boolean {
  return READ_PERMISSION_MATRIX[permission].includes(role);
}

export function getAdminRoleFromAuthUser(user: SupabaseAuthUserLike | null | undefined): AdminRole {
  const role =
    user?.app_metadata &&
    typeof user.app_metadata === 'object' &&
    'role' in user.app_metadata &&
    typeof (user.app_metadata as { role?: unknown }).role === 'string'
      ? ((user.app_metadata as { role: string }).role as string)
      : undefined;
  return normalizeAdminRole(role);
}

export async function authorizeAdminMutation(permission: AdminMutationPermission): Promise<
  | {
      ok: true;
      role: AdminRole;
      accessToken: string;
      supabase: ReturnType<typeof createSupabaseServerClient>;
    }
  | {
      ok: false;
      response: Response;
    }
> {
  const accessToken = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const supabase = createSupabaseServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const role = getAdminRoleFromAuthUser(data.user);
  if (!isMutationAllowed(role, permission)) {
    return {
      ok: false,
      response: Response.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    role,
    accessToken,
    supabase,
  };
}

export async function authorizeAdminRead(permission: AdminReadPermission): Promise<
  | {
      ok: true;
      role: AdminRole;
      accessToken: string;
      supabase: ReturnType<typeof createSupabaseServerClient>;
    }
  | {
      ok: false;
      response: Response;
    }
> {
  const accessToken = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const supabase = createSupabaseServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const role = getAdminRoleFromAuthUser(data.user);
  if (!isReadAllowed(role, permission)) {
    return {
      ok: false,
      response: Response.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    role,
    accessToken,
    supabase,
  };
}
