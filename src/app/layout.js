import { localFont } from 'next/font/local';
import './globals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import BootstrapClient from '@/components/common/BootstrapClient';
import AOSInit from '@/components/common/AOSInit';
import { AuthProvider } from '@/context/AuthContext';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import SessionProviderWrapper from '@/components/common/SessionProviderWrapper';
import { Toaster } from 'react-hot-toast';

const kantumruy = localFont({
  src: [
    {
      path: '../../public/fonts/Kantumruy_Pro/KantumruyPro-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata = {
  title: 'ស្ម័គ្រចិត្ត',
  description: 'Volunteer platform',
  icons: {
    icon: '/logos/logo.png',
    shortcut: '/logos/logo.png',
    apple: '/logos/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="km" data-theme="light" className={kantumruy.variable} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-kantumruy), sans-serif' }}>
        <SessionProviderWrapper>
          <AuthProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <BootstrapClient />
            <AOSInit />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}