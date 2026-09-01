import type { BrokerId } from '@/lib/brokers/providers';

type RawPortfolioRow = Record<string, unknown>;

export class BrokerAdapterError extends Error {
  constructor(
    public readonly kind: 'AUTH' | 'RATE_LIMIT' | 'UPSTREAM',
    message: string,
  ) {
    super(message);
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function findRows(payload: unknown, names: string[]) {
  if (Array.isArray(payload)) return payload.filter((row): row is RawPortfolioRow => Boolean(asRecord(row)));
  const root = asRecord(payload);
  if (!root) return [];
  for (const name of names) {
    const value = root[name];
    if (Array.isArray(value)) return value.filter((row): row is RawPortfolioRow => Boolean(asRecord(row)));
  }
  const data = asRecord(root.data);
  if (data) {
    for (const name of names) {
      const value = data[name];
      if (Array.isArray(value)) return value.filter((row): row is RawPortfolioRow => Boolean(asRecord(row)));
    }
  }
  if (Array.isArray(root.data)) return root.data.filter((row): row is RawPortfolioRow => Boolean(asRecord(row)));
  return [];
}

async function brokerRequest(url: string, headers: HeadersInit) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { headers, cache: 'no-store' });
    if (response.ok) return response.json() as Promise<unknown>;
    if (response.status === 401 || response.status === 403) throw new BrokerAdapterError('AUTH', 'Broker authorization must be renewed.');
    if (response.status === 429) {
      if (attempt < 2) {
        const retryAfter = Math.min(Number(response.headers.get('retry-after') ?? '1') || 1, 5);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1_000));
        continue;
      }
      throw new BrokerAdapterError('RATE_LIMIT', 'Broker rate limit reached.');
    }
    if (response.status >= 500 && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 500));
      continue;
    }
    throw new BrokerAdapterError('UPSTREAM', 'Broker portfolio request failed.');
  }
  throw new BrokerAdapterError('UPSTREAM', 'Broker portfolio request failed.');
}

const markRows = (rows: RawPortfolioRow[], kind: 'HOLDING' | 'POSITION') => rows.map((row) => {
  const product = typeof row.product_type === 'string' || typeof row.product_type === 'number'
    ? String(row.product_type)
    : typeof row.product === 'string' || typeof row.product === 'number'
      ? String(row.product)
      : '';
  return { ...row, product_type: `${kind}:${product.trim() || 'DEFAULT'}` };
});

async function fetchUpstox(accessToken: string) {
  const headers = { Accept: 'application/json', Authorization: `Bearer ${accessToken}` };
  const [holdings, positions] = await Promise.all([
    brokerRequest('https://api.upstox.com/v2/portfolio/long-term-holdings', headers),
    brokerRequest('https://api.upstox.com/v2/portfolio/short-term-positions', headers),
  ]);
  return [...markRows(findRows(holdings, ['holdings']), 'HOLDING'), ...markRows(findRows(positions, ['positions']), 'POSITION')];
}

async function fetchZerodha(accessToken: string) {
  const apiKey = process.env.ZERODHA_API_KEY;
  if (!apiKey) throw new BrokerAdapterError('UPSTREAM', 'Zerodha is not configured.');
  const headers = { 'X-Kite-Version': '3', Authorization: `token ${apiKey}:${accessToken}` };
  const [holdings, positions] = await Promise.all([
    brokerRequest('https://api.kite.trade/portfolio/holdings', headers),
    brokerRequest('https://api.kite.trade/portfolio/positions', headers),
  ]);
  return [...markRows(findRows(holdings, ['holdings']), 'HOLDING'), ...markRows(findRows(positions, ['net', 'positions']), 'POSITION')];
}

async function fetchGroww(accessToken: string) {
  const headers = { Accept: 'application/json', Authorization: `Bearer ${accessToken}`, 'X-API-VERSION': '1.0' };
  const [holdings, positions] = await Promise.all([
    brokerRequest('https://api.groww.in/v1/holdings/user', headers),
    brokerRequest('https://api.groww.in/v1/positions/user', headers),
  ]);
  return [...markRows(findRows(holdings, ['holdings']), 'HOLDING'), ...markRows(findRows(positions, ['positions']), 'POSITION')];
}

async function fetchAngelOne(accessToken: string) {
  const apiKey = process.env.ANGELONE_API_KEY;
  const localIp = process.env.ANGELONE_CLIENT_LOCAL_IP;
  const publicIp = process.env.ANGELONE_CLIENT_PUBLIC_IP;
  const macAddress = process.env.ANGELONE_MAC_ADDRESS;
  if (!apiKey || !localIp || !publicIp || !macAddress) throw new BrokerAdapterError('UPSTREAM', 'Angel One is not configured.');
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-ClientLocalIP': localIp,
    'X-ClientPublicIP': publicIp,
    'X-MACAddress': macAddress,
    'X-PrivateKey': apiKey,
    'X-SourceID': 'WEB',
    'X-UserType': 'USER',
  };
  const [holdings, positions] = await Promise.all([
    brokerRequest('https://apiconnect.angelone.in/rest/secure/angelbroking/portfolio/v1/getAllHolding', headers),
    brokerRequest('https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getPosition', headers),
  ]);
  return [...markRows(findRows(holdings, ['holdings', 'holding']), 'HOLDING'), ...markRows(findRows(positions, ['positions', 'position']), 'POSITION')];
}

export function fetchBrokerPortfolio(provider: BrokerId, accessToken: string) {
  if (provider === 'upstox') return fetchUpstox(accessToken);
  if (provider === 'zerodha') return fetchZerodha(accessToken);
  if (provider === 'groww') return fetchGroww(accessToken);
  return fetchAngelOne(accessToken);
}
