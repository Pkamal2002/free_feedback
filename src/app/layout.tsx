import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


import AuthProvider from '@/context/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import { ThemeProviderWrapper } from '@/components/ThemeProviderWrapper';
import Navbar from '@/components/Navbar';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <Providers>
            <AuthProvider>
              {/* <Navbar/> */}
              {children}
              <Toaster />
            </AuthProvider>
          </Providers>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
