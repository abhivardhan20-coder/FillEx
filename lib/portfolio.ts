export const PORTFOLIO_STORAGE_KEY = 'fillex.portfolio.v1';
export const RISK_PROFILE_STORAGE_KEY = 'fillex.risk-profile.v1';

export type Holding = {
  id: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  quantity: number;
  averagePrice: number;
};

export function readStoredHoldings(): Holding[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PORTFOLIO_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Holding => item && typeof item.id === 'string' && typeof item.symbol === 'string' && (item.exchange === 'NSE' || item.exchange === 'BSE') && Number.isFinite(item.quantity) && item.quantity > 0 && Number.isFinite(item.averagePrice) && item.averagePrice >= 0);
  } catch { return []; }
}

export function saveHoldings(holdings: Holding[]) {
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings));
  window.dispatchEvent(new CustomEvent('fillex:portfolio-updated'));
}

export function parsePortfolioCsv(text: string): Omit<Holding, 'id'>[] {
  const rows = text.replace(/^\uFEFF/, '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (rows.length < 2) throw new Error('The CSV needs a header and at least one holding.');
  const headers = rows[0].split(',').map((value) => value.trim().toLowerCase().replace(/[ _-]/g, ''));
  const index = (names: string[]) => headers.findIndex((header) => names.includes(header));
  const symbolIndex = index(['symbol', 'ticker']);
  const exchangeIndex = index(['exchange']);
  const quantityIndex = index(['quantity', 'qty', 'units']);
  const priceIndex = index(['averageprice', 'avgprice', 'buyprice', 'costprice']);
  if ([symbolIndex, exchangeIndex, quantityIndex, priceIndex].some((value) => value < 0)) throw new Error('Use columns: symbol, exchange, quantity, averagePrice.');

  const holdings = rows.slice(1).map((row, rowIndex) => {
    const cells = row.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    const symbol = (cells[symbolIndex] ?? '').toUpperCase();
    const exchange = (cells[exchangeIndex] ?? '').toUpperCase();
    const quantity = Number(cells[quantityIndex]);
    const averagePrice = Number(cells[priceIndex]);
    if (!/^[A-Z0-9&.-]{1,24}$/.test(symbol) || !['NSE', 'BSE'].includes(exchange) || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(averagePrice) || averagePrice < 0) throw new Error(`Invalid values on CSV row ${rowIndex + 2}.`);
    return { symbol, exchange: exchange as 'NSE' | 'BSE', quantity, averagePrice };
  });
  if (holdings.length > 500) throw new Error('Import at most 500 holdings at a time.');
  return holdings;
}
