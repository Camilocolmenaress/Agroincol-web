import { NextRequest } from 'next/server';

const ALLOWED_DOMAINS = [
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'analytics.google.com',
  'stats.g.doubleclick.net',
];

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const url = new URL(targetUrl);

    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      return new Response('Domain not allowed', { status: 403 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response('Proxy error', { status: 502 });
  }
}
