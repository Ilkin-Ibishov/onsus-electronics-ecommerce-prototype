import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ecommerce Admin',
  description: 'Admin panel scaffold for ecommerce maintenance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
