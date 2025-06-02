import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { MessageCard } from '@/components/MessageCard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free-Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
              <Navbar/>
              {children}
      </body>
    </html>
  );
}
