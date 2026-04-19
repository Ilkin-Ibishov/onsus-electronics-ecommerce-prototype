import { getProductById, getFilteredProducts } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  // Casting to any for the relation check if needed, but getFilteredProducts handles it
  const relatedProducts = await getFilteredProducts({ 
    category: (product as any).categories?.slug 
  }).then(list => list.filter(p => p.id !== product.id).slice(0, 4));

  return (
    <ProductDetail 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
