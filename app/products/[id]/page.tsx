import { getProductById, getFilteredProducts, supabase, type Product } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string };
}

// This is required for Next.js Static Export (output: 'export')
export async function generateStaticParams() {
  try {
    const { data: products } = await supabase.from('products').select('id');
    
    if (!products) return [];

    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  // Fetch related products (same category, excluding current)
  const categorySlug = (product as any).categories?.slug;
  const relatedProducts = await getFilteredProducts({ 
    category: categorySlug 
  }).then(list => list.filter(p => p.id !== product.id).slice(0, 4));

  return (
    <ProductDetail 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
