import type { ProductInput } from '@/lib/products-validation';

type ProductMutationPayload = {
  name_en: string;
  name_az: string;
  name_ru: string;
  description_en?: string;
  category_id: string;
  price: number;
  original_price: number | null;
  discount_percent: number;
  image_url: string;
  is_on_sale: boolean;
  stock_available: number;
  image_gallery?: string[];
  description_az?: string;
  description_ru?: string;
};

const DESCRIPTION_COLUMNS = ['description_en', 'description_az', 'description_ru'] as const;
const IMAGE_GALLERY_COLUMN = 'image_gallery';

export function buildProductMutationPayload(
  input: ProductInput,
  includeDescriptions: boolean,
  includeImageGallery = true
): ProductMutationPayload {
  return {
    name_en: input.name,
    name_az: input.name,
    name_ru: input.name,
    ...(includeDescriptions
      ? {
          description_en: input.name,
          description_az: input.name,
          description_ru: input.name,
        }
      : {}),
    category_id: input.categoryId,
    price: input.price,
    original_price: input.originalPrice,
    discount_percent: input.discountPercent,
    image_url: input.imageUrl,
    is_on_sale: input.discountPercent > 0,
    stock_available: input.stockAvailable,
    ...(includeImageGallery ? { image_gallery: [input.imageUrl] } : {}),
  };
}

function errorMentionsColumn(error: unknown, column: string): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const maybeMessage = 'message' in error ? (error as { message?: unknown }).message : null;
  if (typeof maybeMessage !== 'string') {
    return false;
  }
  return maybeMessage.includes(`'${column}'`);
}

export function isMissingProductOptionalColumnError(error: unknown): boolean {
  return DESCRIPTION_COLUMNS.some((column) => errorMentionsColumn(error, column));
}

export function isMissingProductImageGalleryColumnError(error: unknown): boolean {
  return errorMentionsColumn(error, IMAGE_GALLERY_COLUMN);
}
