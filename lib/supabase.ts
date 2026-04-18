import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name_en: string;
  name_az: string;
  name_ru: string;
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
  stock_available: number;
  stock_sold: number;
}

export interface Category {
  id: string;
  name_en: string;
  name_az: string;
  name_ru: string;
  slug: string;
  icon: string;
  parent_id: string | null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(8);
  return data || [];
}

export async function getTopRatedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_top_rated', true)
    .order('rating', { ascending: false })
    .limit(8);
  return data || [];
}

export async function getOnSaleProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('discount_percent', { ascending: false })
    .limit(8);
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
