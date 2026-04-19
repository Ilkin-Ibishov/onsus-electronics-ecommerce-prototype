import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(10);
  return data || [];
}

export async function getTopRatedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_top_rated', true)
    .order('rating', { ascending: false })
    .limit(10);
  return data || [];
}

export async function getOnSaleProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('discount_percent', { ascending: false })
    .limit(10);
  return data || [];
}

export async function getDealOfDay(): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_deal_of_day', true)
    .maybeSingle();
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
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
    // First, find the category ID by slug
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.category)
      .maybeSingle();
    
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
    // Search across EN, AZ, RU names
    query = query.or(`name_en.ilike.%${options.query}%,name_az.ilike.%${options.query}%,name_ru.ilike.%${options.query}%`);
  }

  // Handle Sorting
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

  const { data } = await query;
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .maybeSingle();
  return data;
}

export async function getProductsByCategory(categorySlug: string, limit = 8): Promise<Product[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();

  if (!category) return [];

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .limit(limit);
  
  return data || [];
}
