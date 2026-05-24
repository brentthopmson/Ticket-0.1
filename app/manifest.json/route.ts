import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const startUrl = token ? `/login?token=${encodeURIComponent(token)}` : '/login';

  const manifest = {
    name: 'Ticketmaster',
    short_name: 'Ticketmaster',
    description: 'Buy and sell concert, sports and theatre tickets',
    start_url: startUrl,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#026CDF',
    icons: [
      { src: '/tm-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/tm-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/tm-icon-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      { src: '/tm-screenshot-540.png', sizes: '540x720', type: 'image/png', form_factor: 'narrow' },
    ],
  };

  return NextResponse.json(manifest);
}
