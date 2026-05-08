import { getProductById, getFilteredProducts, supabase, type Product } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string };
}

// This is required for Next.js Static Export (output: 'export')
export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase.from('products').select('id');
    
    if (error || !products || products.length === 0) {
      console.warn('No products found for static params, using dummy ID for build stability');
      return [{ id: '1' }];
    }

    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ id: '1' }];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null;
  try {
    product = await getProductById(params.id);
  } catch (e) {
    console.error('[product]', e);
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  const currentProduct = product;

  let relatedProducts: Product[] = [];
  try {
    const categorySlug = (currentProduct as { categories?: { slug?: string } }).categories?.slug;
    if (categorySlug) {
      const list = await getFilteredProducts({
        category: categorySlug
      });
      relatedProducts = list.filter((p) => p.id !== currentProduct.id).slice(0, 4);
    }
  } catch (e) {
    console.error('[product/related]', e);
    relatedProducts = [];
  }

  return (
    <ProductDetail 
      product={currentProduct} 
      relatedProducts={relatedProducts} 
    />
  );
}
