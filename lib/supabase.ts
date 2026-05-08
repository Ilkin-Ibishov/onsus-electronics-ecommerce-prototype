import { createClient, type PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function assertNoSupabaseError(error: PostgrestError | null, context: string): void {
  if (error) {
    console.error(`[supabase:${context}]`, error.message, error.code, error.details);
    throw new Error(`Supabase ${context}: ${error.message}`);
  }
}

export interface Product {
  id: string;
  name_en: string;
  name_az: string;
  name_ru: string;
  description_en: string;
  description_az: string;
  description_ru: string;
  category_id: string;
  price: number;
  original_price: number | null;
  discount_percent: number;
  rating: number;
  review_count: number;
  image_url: string;
  is_featured: boolean;
  is_top_rated: boolean;
  is_on_sale: boolean;
  is_deal_of_day: boolean;
  is_new?: boolean;
  category_name?: string;
  stock_available: number;
  stock_sold: number;
  image_gallery: string[];
}

export interface Category {
  id: string;
  name_en: string;
  name_az: string;
  name_ru: string;
  slug: string;
  icon: string;
  parent_id: string | null;
  sort_order: number;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(10);
  assertNoSupabaseError(error, 'getFeaturedProducts');
  return data ?? [];
}

export async function getTopRatedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_top_rated', true)
    .order('rating', { ascending: false })
    .limit(10);
  assertNoSupabaseError(error, 'getTopRatedProducts');
  return data ?? [];
}

export async function getOnSaleProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('discount_percent', { ascending: false })
    .limit(10);
  assertNoSupabaseError(error, 'getOnSaleProducts');
  return data ?? [];
}

export async function getDealOfDay(): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_deal_of_day', true)
    .maybeSingle();
  assertNoSupabaseError(error, 'getDealOfDay');
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  assertNoSupabaseError(error, 'getCategories');
  return data ?? [];
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  query?: string;
}

export async function getFilteredProducts(options: FilterOptions): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (options.category) {
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.category)
      .maybeSingle();

    assertNoSupabaseError(catError, 'getFilteredProducts(categoryLookup)');
    if (catData) {
      query = query.eq('category_id', catData.id);
    }
  }

  if (options.minPrice !== undefined) {
    query = query.gte('price', options.minPrice);
  }

  if (options.maxPrice !== undefined) {
    query = query.lte('price', options.maxPrice);
  }

  if (options.query) {
    query = query.or(`name_en.ilike.%${options.query}%,name_az.ilike.%${options.query}%,name_ru.ilike.%${options.query}%`);
  }

  switch (options.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  assertNoSupabaseError(error, 'getFilteredProducts');
  return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .maybeSingle();
  assertNoSupabaseError(error, 'getProductById');
  return data;
}

export async function getProductsByCategory(categorySlug: string, limit = 8): Promise<Product[]> {
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();

  assertNoSupabaseError(catError, 'getProductsByCategory(categoryLookup)');
  if (!category) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .limit(limit);

  assertNoSupabaseError(error, 'getProductsByCategory');
  return data ?? [];
}
