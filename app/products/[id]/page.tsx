'use client';

import { useState, useEffect } from 'react';
import { getProductById, getFilteredProducts, type Product } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getProductById(params.id);
        if (!p) {
          setLoading(false);
          return;
        }
        setProduct(p);
        
        // Fetch related products
        const categorySlug = (p as any).categories?.slug;
        const related = await getFilteredProducts({ 
          category: categorySlug 
        });
        
        setRelatedProducts(related.filter(item => item.id !== p.id).slice(0, 4));
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <ProductDetail 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
