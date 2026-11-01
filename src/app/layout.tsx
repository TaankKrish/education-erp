import type { Metadata, Viewport } from 'next';
import './globals.css';
import { APP_CONFIG } from '@/config/app';

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} | Enterprise School Management Platform`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  authors: [{ name: 'Engineering Architecture Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full font-sans antialiased text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
