type MarketauxEntity = {
  symbol?: unknown;
  name?: unknown;
  sentiment_score?: unknown;
  match_score?: unknown;
};

type MarketauxArticle = {
  uuid?: unknown;
  title?: unknown;
  description?: unknown;
  snippet?: unknown;
  url?: unknown;
  image_url?: unknown;
  published_at?: unknown;
  source?: unknown;
  entities?: unknown;
};

const cleanText = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
const cleanNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : null;

function safeArticleUrl(value: unknown) {
  const text = cleanText(value);
  if (!text) return null;
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch { return null; }
}

function normalizeArticle(raw: MarketauxArticle) {
  const title = cleanText(raw.title);
  const url = safeArticleUrl(raw.url);
  if (!title || !url) return null;
  const entities = Array.isArray(raw.entities) ? raw.entities.map((item) => item && typeof item === 'object' ? item as MarketauxEntity : null).filter((item): item is MarketauxEntity => Boolean(item)) : [];
  const sentiments = entities.map((entity) => cleanNumber(entity.sentiment_score)).filter((score): score is number => score !== null);
  const sentiment = sentiments.length ? sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length : null;
  return {
    id: cleanText(raw.uuid) ?? url,
    title,
    summary: cleanText(raw.description) ?? cleanText(raw.snippet),
    url,
    imageUrl: safeArticleUrl(raw.image_url),
    publishedAt: cleanText(raw.published_at),
    source: cleanText(raw.source),
    sentiment,
    entities: entities.slice(0, 5).map((entity) => ({
      symbol: cleanText(entity.symbol),
      name: cleanText(entity.name),
      matchScore: cleanNumber(entity.match_score),
      sentiment: cleanNumber(entity.sentiment_score),
    })),
  };
}

export async function GET(request: Request) {
  const apiToken = process.env.MARKETAUX_API_KEY;
  if (!apiToken) return Response.json({ error: 'Verified news is not configured.' }, { status: 503 });
  const requestUrl = new URL(request.url);
  const requestedSymbols = (requestUrl.searchParams.get('symbols') ?? '').toUpperCase().split(',').map((item) => item.trim()).filter(Boolean);
  if (requestedSymbols.some((symbol) => !/^[A-Z0-9.^&-]{1,24}$/.test(symbol)) || requestedSymbols.length > 5) {
    return Response.json({ error: 'Enter up to five valid ticker symbols.' }, { status: 400 });
  }

  const endpoint = new URL('https://api.marketaux.com/v1/news/all');
  endpoint.searchParams.set('api_token', apiToken);
  endpoint.searchParams.set('language', 'en');
  endpoint.searchParams.set('filter_entities', 'true');
  endpoint.searchParams.set('must_have_entities', 'true');
  endpoint.searchParams.set('limit', '10');
  endpoint.searchParams.set('sort', 'published_at');
  if (requestedSymbols.length) {
    endpoint.searchParams.set('symbols', requestedSymbols.map((symbol) => symbol.includes('.') ? symbol : `${symbol}.NS`).join(','));
  } else {
    endpoint.searchParams.set('countries', 'in');
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) return Response.json({ error: response.status === 429 ? 'The verified news source is rate limited. Try again shortly.' : 'Verified news is temporarily unavailable.' }, { status: response.status === 429 ? 429 : 502 });
    const payload = await response.json() as { data?: unknown; meta?: unknown };
    const articles = Array.isArray(payload.data) ? payload.data.map((item) => item && typeof item === 'object' ? normalizeArticle(item as MarketauxArticle) : null).filter((article): article is NonNullable<ReturnType<typeof normalizeArticle>> => article !== null) : [];
    return Response.json({ articles, provider: 'Marketaux', query: requestedSymbols, meta: payload.meta ?? null }, { headers: { 'Cache-Control': 'private, max-age=60' } });
  } catch {
    return Response.json({ error: 'Verified news is temporarily unavailable.' }, { status: 502 });
  }
}
