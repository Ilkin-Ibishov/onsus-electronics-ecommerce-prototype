import { authorizeAdminMutation, authorizeAdminRead } from '@/lib/admin-authorization';
import { logApiError, sanitizeApiErrorMessage } from '@/lib/api-error';
import { validateProductInput } from '@/lib/products-validation';
import {
  buildProductMutationPayload,
  isMissingProductImageGalleryColumnError,
  isMissingProductOptionalColumnError,
} from '@/lib/products-write-contract';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const categoryId = searchParams.get('categoryId') ?? undefined;
  const authorization = await authorizeAdminRead('products:read');
  if (!authorization.ok) {
    return authorization.response;
  }

  const supabase = authorization.supabase;

  let query = supabase
    .from('products')
    .select(
      'id, name_en, category_id, price, original_price, discount_percent, stock_available, image_url, created_at, categories(name_en)'
    )
    .order('name_en', { ascending: true });

  if (search) {
    query = query.ilike('name_en', `%${search}%`);
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const [{ data, error }, categoriesResult] = await Promise.all([
    query,
    supabase.from('categories').select('id, name_en').order('sort_order', { ascending: true }),
  ]);

  if (error) {
    logApiError('products:get', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }
  if (categoriesResult.error) {
    logApiError('products:get-categories', categoriesResult.error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json({
    data: (data ?? []).map((item) => {
      const categoryName = Array.isArray(item.categories)
        ? (item.categories[0] as { name_en?: string } | undefined)?.name_en
        : (item.categories as { name_en?: string } | null | undefined)?.name_en;
      return {
        id: String(item.id),
        name: item.name_en,
        categoryId: String(item.category_id),
        categoryName: categoryName ?? 'Unknown',
        price: item.price,
        originalPrice: item.original_price,
        discountPercent: item.discount_percent,
        stockAvailable: item.stock_available,
        imageUrl: item.image_url,
        updatedAt: item.created_at,
      };
    }),
    categories: (categoriesResult.data ?? []).map((item) => ({
      id: String(item.id),
      name: item.name_en,
    })),
  });
}

export async function POST(request: Request) {
  const authorization = await authorizeAdminMutation('products:create');
  if (!authorization.ok) {
    return authorization.response;
  }
  const supabase = authorization.supabase;

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

  const writeDefaults = {
    rating: 0,
    review_count: 0,
    is_featured: false,
    is_top_rated: false,
    is_deal_of_day: false,
    stock_sold: 0,
  };

  const insertAndSelect = (includeDescriptions: boolean, includeImageGallery: boolean) =>
    supabase
      .from('products')
      .insert({
        ...buildProductMutationPayload(input, includeDescriptions, includeImageGallery),
        ...writeDefaults,
      })
      .select(
        'id, name_en, category_id, price, original_price, discount_percent, stock_available, image_url, created_at'
      )
      .single();

  let includeDescriptions = true;
  let includeImageGallery = true;
  let { data, error } = await insertAndSelect(includeDescriptions, includeImageGallery);
  if (error && isMissingProductOptionalColumnError(error)) {
    includeDescriptions = false;
    ({ data, error } = await insertAndSelect(includeDescriptions, includeImageGallery));
  }
  if (error && isMissingProductImageGalleryColumnError(error)) {
    includeImageGallery = false;
    ({ data, error } = await insertAndSelect(includeDescriptions, includeImageGallery));
  }

  if (error) {
    logApiError('products:post', error);
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: sanitizeApiErrorMessage() }, { status: 500 });
  }

  return Response.json(
    {
      data: {
        id: String(data.id),
        name: data.name_en,
        categoryId: String(data.category_id),
        price: data.price,
        originalPrice: data.original_price,
        discountPercent: data.discount_percent,
        stockAvailable: data.stock_available,
        imageUrl: data.image_url,
        updatedAt: data.created_at,
      },
    },
    { status: 201 }
  );
}
