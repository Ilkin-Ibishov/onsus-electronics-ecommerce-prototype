import { validateCategoryInput } from '@/lib/categories-validation';
import { authorizeAdminMutation, authorizeAdminRead } from '@/lib/admin-authorization';
import { logApiError, sanitizeApiErrorMessage } from '@/lib/api-error';

export async function GET() {
  const authorization = await authorizeAdminRead('categories:read');
  if (!authorization.ok) {
    return authorization.response;
  }

  const supabase = authorization.supabase;
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_en, slug, sort_order, created_at')
    .order('sort_order', { ascending: true });

  if (error) {
    logApiError('categories:get', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json({
    data: (data ?? []).map((item) => ({
      id: String(item.id),
      name: item.name_en,
      slug: item.slug,
      sortOrder: item.sort_order,
      updatedAt: item.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const authorization = await authorizeAdminMutation('categories:create');
  if (!authorization.ok) {
    return authorization.response;
  }

  const payload = await request.json().catch(() => null);
  const validated = validateCategoryInput(payload);
  if (validated.error || !validated.data) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const supabase = authorization.supabase;
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name_en: validated.data.name,
      name_az: validated.data.name,
      name_ru: validated.data.name,
      slug: validated.data.slug,
      icon: 'tag',
      parent_id: null,
      sort_order: validated.data.sortOrder,
    })
    .select('id, name_en, slug, sort_order, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'Slug already exists.' }, { status: 409 });
    }
    logApiError('categories:post', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json(
    {
      data: {
        id: String(data.id),
        name: data.name_en,
        slug: data.slug,
        sortOrder: data.sort_order,
        updatedAt: data.created_at,
      },
    },
    { status: 201 }
  );
}
