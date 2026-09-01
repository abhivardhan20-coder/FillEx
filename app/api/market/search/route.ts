import { searchIndianStocks } from '@/lib/market/yahoo-fallback';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  if (query.trim().length < 2) {
    return Response.json({ error: 'Enter at least two characters.' }, { status: 400 });
  }

  try {
    const results = await searchIndianStocks(query);
    return Response.json({ results, source: 'Yahoo Finance fallback', exchangeLive: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Market search failed.' }, { status: 502 });
  }
}
