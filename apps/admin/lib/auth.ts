export const ADMIN_ACCESS_TOKEN_COOKIE = 'admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'admin_refresh_token';
export const ADMIN_ROLE_COOKIE = 'admin_role';
export type AdminRole = 'admin' | 'editor' | 'viewer';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

export function normalizeAdminRole(value: string | undefined): AdminRole {
  if (value === 'admin' || value === 'editor' || value === 'viewer') {
    return value;
  }
  return 'viewer';
}

export function isAdminLoginAllowed(role: AdminRole): boolean {
  return role === 'admin' || role === 'editor' || role === 'viewer';
}
