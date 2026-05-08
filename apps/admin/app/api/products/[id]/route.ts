import { authorizeAdminMutation } from '@/lib/admin-authorization';
import { validateProductInput } from '@/lib/products-validation';
import { logApiError, sanitizeApiErrorMessage } from '@/lib/api-error';
import {
  buildProductMutationPayload,
  isMissingProductImageGalleryColumnError,
  isMissingProductOptionalColumnError,
} from '@/lib/products-write-contract';

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const authorization = await authorizeAdminMutation('products:update');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

  const { data: existing, error: existingError } = await supabase
    .from('products')
    .select('id')
    .eq('id', context.params.id)
    .single();
  if (existingError || !existing) {
    return Response.json({ error: 'Product not found.' }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const validated = validateProductInput(payload);
  if (validated.error || !validated.data) {
    return Response.json({ error: validated.error }, { status: 400 });
  }
  const input = validated.data;

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', input.categoryId)
    .single();
  if (categoryError || !category) {
    return Response.json({ error: 'Selected category does not exist.' }, { status: 400 });
  }

  const updateAndSelect = (includeDescriptions: boolean, includeImageGallery: boolean) =>
    supabase
      .from('products')
      .update(buildProductMutationPayload(input, includeDescriptions, includeImageGallery))
      .eq('id', context.params.id)
      .select(
        'id, name_en, category_id, price, original_price, discount_percent, stock_available, image_url, created_at'
      )
      .single();

  let includeDescriptions = true;
  let includeImageGallery = true;
  let { data: updated, error } = await updateAndSelect(includeDescriptions, includeImageGallery);
  if (error && isMissingProductOptionalColumnError(error)) {
    includeDescriptions = false;
    ({ data: updated, error } = await updateAndSelect(includeDescriptions, includeImageGallery));
  }
  if (error && isMissingProductImageGalleryColumnError(error)) {
    includeImageGallery = false;
    ({ data: updated, error } = await updateAndSelect(includeDescriptions, includeImageGallery));
  }

  if (error) {
    logApiError('products:patch', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }
  if (!updated) {
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json({
    data: {
      id: String(updated.id),
      name: updated.name_en,
      categoryId: String(updated.category_id),
      price: updated.price,
      originalPrice: updated.original_price,
      discountPercent: updated.discount_percent,
      stockAvailable: updated.stock_available,
      imageUrl: updated.image_url,
      updatedAt: updated.created_at,
    },
  });
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const authorization = await authorizeAdminMutation('products:delete');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

  const { data: existing, error: existingError } = await supabase
    .from('products')
    .select('id')
    .eq('id', context.params.id)
    .single();
  if (existingError || !existing) {
    return Response.json({ error: 'Product not found.' }, { status: 404 });
  }

  const { error } = await supabase.from('products').delete().eq('id', context.params.id);
  if (error) {
    logApiError('products:delete', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }
  return Response.json({ ok: true });
}
