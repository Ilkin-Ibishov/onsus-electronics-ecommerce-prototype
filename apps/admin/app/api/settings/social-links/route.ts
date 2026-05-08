import { authorizeAdminMutation, authorizeAdminRead } from '@/lib/admin-authorization';
import { logApiError, sanitizeApiErrorMessage } from '@/lib/api-error';
import { validateSocialLinks } from '@/lib/settings-validation';

export async function GET() {
  const authorization = await authorizeAdminRead('settings:social-links:read');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, updated_at')
    .like('key', 'social.%');

  if (error) {
    logApiError('settings:social-links:get', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  const socialLinks = {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  };

  let updatedAt = new Date(0).toISOString();
  for (const row of data ?? []) {
    const key = String(row.key).replace('social.', '');
    if (key in socialLinks) {
      (socialLinks as Record<string, string>)[key] = String(row.value ?? '');
    }
    const rowUpdatedAt = String(row.updated_at ?? '');
    if (rowUpdatedAt > updatedAt) {
      updatedAt = rowUpdatedAt;
    }
  }

  return Response.json({ data: { socialLinks, updatedAt } });
}

export async function PUT(request: Request) {
  const authorization = await authorizeAdminMutation('settings:social-links:update');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

  const payload = await request.json().catch(() => null);
  const validated = validateSocialLinks(payload);
  if (validated.error || !validated.data) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const entries = Object.entries(validated.data).map(([key, value]) => ({
    key: `social.${key}`,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('site_settings').upsert(entries, {
    onConflict: 'key',
  });
  if (error) {
    logApiError('settings:social-links:put', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json({
    data: {
      socialLinks: validated.data,
      updatedAt: new Date().toISOString(),
    },
  });
}
