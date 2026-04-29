import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AzureShop — E-Ticaret Platformu',
  description: 'Microsoft Azure üzerinde çalışan e-ticaret ve satıcı analitik platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
