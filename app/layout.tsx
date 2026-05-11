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
  viewport: 'width=device-width, initial-scale=1, format-detection=telephone=no',
  icons: {
    icon: [
      { url: 'https://business.tickethour.com.cy/en/wp-content/uploads/sites/2/2024/11/t_logo.png' },
    ],
    shortcut: 'https://business.tickethour.com.cy/en/wp-content/uploads/sites/2/2024/11/t_logo.png',
    apple: 'https://business.tickethour.com.cy/en/wp-content/uploads/sites/2/2024/11/t_logo.png',
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
        <link rel="preconnect" href="https://ws.vggcdn.net/" />
        <link rel="dns-prefetch" href="https://ws.vggcdn.net/" />
        <link rel="preconnect" href="https://img.vggcdn.net/" />
        <link rel="dns-prefetch" href="https://img.vggcdn.net/" />
        <link rel="preconnect" href="https://wt.viagogo.net" />
        <link rel="dns-prefetch" href="https://wt.viagogo.net" />
        <link rel="preconnect" href="https://media.stubhubstatic.com" />
        <link rel="dns-prefetch" href="https://media.stubhubstatic.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700&display=swap" />
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