import { getFallbackQuote } from '@/lib/market/yahoo-fallback';

export async function GET(request: Request) {
  const ticker = new URL(request.url).searchParams.get('ticker') ?? '';
  try {
    const quote = await getFallbackQuote(ticker);
    if (!quote) return Response.json({ error: 'No quote was returned for this NSE/BSE ticker.' }, { status: 404 });
    return Response.json({ quote }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'The fallback quote provider is temporarily unavailable.' }, { status: 502 });
  }
}
