export type IntegrationState = 'connected' | 'credential-required' | 'worker-ready' | 'active-fallback';

export type Integration = {
  name: string;
  role: string;
  state: IntegrationState;
  detail: string;
  href: string;
  env?: string[];
};

function hasAll(names: string[]) { return names.every((name) => Boolean(process.env[name]?.trim())); }

export function getProductionIntegrations(): Integration[] {
  const items = [
    { name: 'Upstox', role: 'Primary broker data', href: 'https://github.com/upstox/upstox-nodejs', env: ['UPSTOX_API_KEY', 'UPSTOX_API_SECRET', 'UPSTOX_REDIRECT_URI', 'BROKER_TOKEN_ENCRYPTION_KEY', 'INGESTION_WORKER_SECRET'] },
    { name: 'Angel One SmartAPI', role: 'Primary broker data', href: 'https://github.com/angel-one/smartapi-javascript', env: ['ANGELONE_API_KEY', 'ANGELONE_REDIRECT_URI', 'ANGELONE_CLIENT_LOCAL_IP', 'ANGELONE_CLIENT_PUBLIC_IP', 'ANGELONE_MAC_ADDRESS', 'BROKER_TOKEN_ENCRYPTION_KEY', 'INGESTION_WORKER_SECRET'] },
    { name: 'Zerodha Kite Connect', role: 'Primary broker data', href: 'https://github.com/zerodha/kiteconnectjs', env: ['ZERODHA_API_KEY', 'ZERODHA_API_SECRET', 'ZERODHA_REDIRECT_URI', 'BROKER_TOKEN_ENCRYPTION_KEY', 'INGESTION_WORKER_SECRET'] },
    { name: 'Groww', role: 'User-authorized portfolio data', href: 'https://groww.in/trade-api', env: ['GROWW_API_KEY', 'GROWW_API_SECRET', 'BROKER_TOKEN_ENCRYPTION_KEY', 'INGESTION_WORKER_SECRET'] },
    { name: 'Marketaux', role: 'Verified financial news', href: 'https://www.marketaux.com/documentation', env: ['MARKETAUX_API_KEY'] },
    { name: 'FinancialFilings', role: 'Licensed filing data', href: 'https://financialfilings.com/developers/reference/', env: ['FINANCIALFILINGS_API_KEY'] },
    { name: 'NewsAPI', role: 'Verified news feed', href: 'https://newsapi.org/docs', env: ['NEWSAPI_KEY'] },
    { name: 'GNews', role: 'Verified news feed', href: 'https://docs.gnews.io/', env: ['GNEWS_API_KEY'] },
    { name: 'Kun Data / StockerAPI', role: 'Streaming market data', href: 'https://github.com/StockerAPI/india-stock-market-api', env: ['STOCKER_API_TOKEN'] },
  ];
  return items.map((item) => ({ ...item, state: hasAll(item.env) ? 'connected' as const : 'credential-required' as const, detail: hasAll(item.env) ? 'Required server credentials detected.' : 'Waiting for server-side credentials.' }));
}

export const openSourceIntegrations: Integration[] = [
  { name: 'Indian-Stock-Market-API', role: 'Hosted no-key fallback', state: 'active-fallback', detail: 'Its Yahoo Finance search/quote pattern powers the labeled Markets fallback.', href: 'https://github.com/0xramm/Indian-Stock-Market-API' },
  { name: 'nse-bse-api', role: 'Node research worker', state: 'worker-ready', detail: 'Kept outside the edge-hosted UI because it uses Node-specific networking and exchange sessions.', href: 'https://github.com/bshada/nse-bse-api' },
  { name: 'NseIndiaApi', role: 'Python NSE worker', state: 'worker-ready', detail: 'Isolated for throttled NSE research and report ingestion at no more than the documented rate.', href: 'https://github.com/BennyThadikaran/NseIndiaApi' },
  { name: 'BseIndiaApi', role: 'Python BSE worker', state: 'worker-ready', detail: 'Isolated as a separate GPL-3.0 worker for BSE research, actions, and announcements.', href: 'https://github.com/BennyThadikaran/BseIndiaApi' },
  { name: 'StockerAPI repository', role: 'Provider specification', state: 'credential-required', detail: 'The repository documents a token-authenticated service; no redistributable server SDK is included.', href: 'https://github.com/StockerAPI/india-stock-market-api' },
];
