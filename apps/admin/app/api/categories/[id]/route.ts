import { validateCategoryInput } from '@/lib/categories-validation';
import { authorizeAdminMutation } from '@/lib/admin-authorization';
import { logApiError, sanitizeApiErrorMessage } from '@/lib/api-error';

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const authorization = await authorizeAdminMutation('categories:update');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

  const payload = await request.json().catch(() => null);
  const validated = validateCategoryInput(payload);
  if (validated.error || !validated.data) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', context.params.id)
    .single();
  if (fetchError || !existing) {
    return Response.json({ error: 'Category not found.' }, { status: 404 });
  }

  const { data: updated, error } = await supabase
    .from('categories')
    .update({
      name_en: validated.data.name,
      name_az: validated.data.name,
      name_ru: validated.data.name,
      slug: validated.data.slug,
      sort_order: validated.data.sortOrder,
    })
    .eq('id', context.params.id)
    .select('id, name_en, slug, sort_order, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'Slug already exists.' }, { status: 409 });
    }
    logApiError('categories:patch', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json({
    data: {
      id: String(updated.id),
      name: updated.name_en,
      slug: updated.slug,
      sortOrder: updated.sort_order,
      updatedAt: updated.created_at,
    },
  });
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const authorization = await authorizeAdminMutation('categories:delete');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

  const { data: exists, error: existsError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', context.params.id)
    .single();
  if (existsError || !exists) {
    return Response.json({ error: 'Category not found.' }, { status: 404 });
  }

  const { error } = await supabase.from('categories').delete().eq('id', context.params.id);
  if (error) {
    logApiError('categories:delete', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }
  return Response.json({ ok: true });
}
