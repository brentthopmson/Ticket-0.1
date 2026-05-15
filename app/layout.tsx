import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import RootLayoutWrapper from './RootLayout';
import { Inter } from 'next/font/google';

import { UserProvider } from './UserContext';

config.autoAddCss = false;
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tickets - Buy and Sell Concert, Sports & Theatre Tickets | Ticketmaster',
  description: 'Search and buy tickets for your favorite artists, teams, and shows at Ticketmaster.',
  keywords: 'ticketmaster, buy tickets, sell tickets, concert, sport, theater',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  icons: {
    icon: [
      { url: 'https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png' },
    ],
    shortcut: 'https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png',
    apple: 'https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png',
  },
  openGraph: {
    url: 'https://www.ticketmaster.com/',
    title: 'Tickets - Buy and Sell Concert, Sports & Theatre Tickets | Ticketmaster',
    description: 'Search and buy tickets for your favorite artists, teams, and shows at Ticketmaster.',
    siteName: 'ticketmaster.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#026CDF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ticketmaster" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png" />
        <link rel="shortcut icon" href="https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png" />
        <link rel="apple-touch-icon" href="https://business.ticketmaster.be/nl/wp-content/uploads/sites/2/2025/05/logo.png" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <RootLayoutWrapper inter={inter}>
            {children}
          </RootLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}