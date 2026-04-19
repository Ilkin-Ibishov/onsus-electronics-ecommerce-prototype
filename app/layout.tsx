import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { ClientLayout } from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Ilk Electronics - Premium Elektronika Mağazası',
  description: 'Ən son elektronika, kameralar, smartfonlar, noutbuklar və daha çoxunu inanılmaz qiymətlərlə əldə edin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
