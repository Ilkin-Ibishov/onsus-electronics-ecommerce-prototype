import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Onsus - Premium Electronics Store',
  description: 'Shop the latest electronics, cameras, smartphones, laptops and more at unbeatable prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
