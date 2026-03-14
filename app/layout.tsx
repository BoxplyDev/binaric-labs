import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CosmicPreloader from '@/components/CosmicPreloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Binaric Labs - Digital Presence Perfected',
  description: 'Engineering digital gravity for brands seeking escape velocity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <CosmicPreloader />
        {children}
      </body>
    </html>
  );
}