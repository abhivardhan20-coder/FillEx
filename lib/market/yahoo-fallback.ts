// Adapted for FillEx from 0xramm/Indian-Stock-Market-API (MIT).
// This deliberately remains a labeled fallback. Yahoo Finance data is not an
// exchange-authoritative or guaranteed zero-delay market feed.

const USER_AGENT = 'Mozilla/5.0 (compatible; FillEx/1.0; +https://openai.com)';

export type MarketSearchResult = {
  ticker: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  name: string;
  type: string;
};

export type MarketQuote = {
  ticker: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  name: string;
  currency: string;
  price: number;
  previousClose: number | null;
  change: number | null;
  percentChange: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  marketTime: string | null;
  source: 'Yahoo Finance fallback';
  exchangeLive: false;
};

function cleanQuery(value: string) {
  return Array.from(value.trim()).filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127).join('').slice(0, 80);
}

const textValue = (value: unknown, fallback: string) => typeof value === 'string' && value ? value : fallback;

export async function searchIndianStocks(input: string): Promise<MarketSearchResult[]> {
  const query = cleanQuery(input);
  if (query.length < 2) return [];

  const response = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=20&newsCount=0`,
    { headers: { 'User-Agent': USER_AGENT }, cache: 'no-store' },
  );
  if (!response.ok) throw new Error('The fallback search provider is temporarily unavailable.');

  const payload = (await response.json()) as { quotes?: Array<Record<string, unknown>> };
  return (payload.quotes ?? [])
    .filter((item) => typeof item.symbol === 'string' && (item.symbol.endsWith('.NS') || item.symbol.endsWith('.BO')))
    .map((item) => {
      const ticker = String(item.symbol);
      return {
        ticker,
        symbol: ticker.replace(/\.(NS|BO)$/, ''),
        exchange: ticker.endsWith('.BO') ? 'BSE' as const : 'NSE' as const,
        name: textValue(item.longname, textValue(item.shortname, ticker)),
        type: textValue(item.quoteType, 'Equity'),
      };
    })
    .filter((item, index, all) => all.findIndex((candidate) => candidate.ticker === item.ticker) === index)
    .slice(0, 12);
}

export async function getFallbackQuote(input: string): Promise<MarketQuote | null> {
  const ticker = cleanQuery(input).toUpperCase();
  if (!/^[A-Z0-9&.-]+\.(NS|BO)$/.test(ticker)) return null;

  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`,
    { headers: { 'User-Agent': USER_AGENT }, cache: 'no-store' },
  );
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    chart?: { result?: Array<{ meta?: Record<string, unknown> }> };
  };
  const meta = payload.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== 'number') return null;

  const price = meta.regularMarketPrice;
  const previousClose = typeof meta.chartPreviousClose === 'number'
    ? meta.chartPreviousClose
    : typeof meta.previousClose === 'number' ? meta.previousClose : null;
  const change = previousClose === null ? null : price - previousClose;
  const percentChange = previousClose !== null && previousClose !== 0 ? ((price - previousClose) / previousClose) * 100 : null;

  return {
    ticker,
    symbol: ticker.replace(/\.(NS|BO)$/, ''),
    exchange: ticker.endsWith('.BO') ? 'BSE' : 'NSE',
    name: textValue(meta.longName, textValue(meta.shortName, textValue(meta.symbol, ticker))),
    currency: textValue(meta.currency, 'INR'),
    price,
    previousClose,
    change,
    percentChange,
    dayHigh: typeof meta.regularMarketDayHigh === 'number' ? meta.regularMarketDayHigh : null,
    dayLow: typeof meta.regularMarketDayLow === 'number' ? meta.regularMarketDayLow : null,
    marketTime: typeof meta.regularMarketTime === 'number' ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    source: 'Yahoo Finance fallback',
    exchangeLive: false,
  };
}
