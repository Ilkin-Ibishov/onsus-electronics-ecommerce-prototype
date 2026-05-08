export interface ProductInput {
  name: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  stockAvailable: number;
  imageUrl: string;
}

const MAX_PRODUCT_NAME_LENGTH = 200;
const MAX_IMAGE_URL_LENGTH = 2048;

export function validateProductInput(payload: unknown): {
  data: ProductInput | null;
  error: string | null;
} {
  if (!payload || typeof payload !== 'object') {
    return { data: null, error: 'Invalid request payload.' };
  }

  const raw = payload as Record<string, unknown>;
  const name = String(raw.name ?? '').trim();
  const categoryId = String(raw.categoryId ?? '').trim();
  const price = Number(raw.price);
  const originalPriceRaw = raw.originalPrice;
  const originalPrice =
    originalPriceRaw === null || originalPriceRaw === '' ? null : Number(originalPriceRaw);
  const discountPercent = Number(raw.discountPercent);
  const stockAvailable = Number(raw.stockAvailable);
  const imageUrl = String(raw.imageUrl ?? '').trim();

  if (name.length < 2) {
    return { data: null, error: 'Name must be at least 2 characters.' };
  }
  if (name.length > MAX_PRODUCT_NAME_LENGTH) {
    return { data: null, error: `Name must be at most ${MAX_PRODUCT_NAME_LENGTH} characters.` };
  }
  if (!categoryId) {
    return { data: null, error: 'Category is required.' };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { data: null, error: 'Price must be greater than 0.' };
  }
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < price)) {
    return { data: null, error: 'Original price must be null or >= price.' };
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    return { data: null, error: 'Discount percent must be between 0 and 100.' };
  }
  if (!Number.isInteger(stockAvailable) || stockAvailable < 0) {
    return { data: null, error: 'Stock available must be an integer >= 0.' };
  }

  if (imageUrl.length > MAX_IMAGE_URL_LENGTH) {
    return {
      data: null,
      error: `Image URL must be at most ${MAX_IMAGE_URL_LENGTH} characters.`,
    };
  }

  try {
    const parsedImageUrl = new URL(imageUrl);
    if (parsedImageUrl.protocol !== 'http:' && parsedImageUrl.protocol !== 'https:') {
      return { data: null, error: 'Image URL must use http or https.' };
    }
  } catch {
    return { data: null, error: 'Image URL must be a valid URL.' };
  }

  return {
    data: {
      name,
      categoryId,
      price,
      originalPrice,
      discountPercent,
      stockAvailable,
      imageUrl,
    },
    error: null,
  };
}
