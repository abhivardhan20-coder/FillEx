import type { BrokerId } from '@/lib/brokers/providers';

export type CanonicalBrokerHolding = {
  securityId: string;
  isin: string | null;
  tradingSymbol: string;
  companyName: string | null;
  exchange: string;
  quantity: number;
  averagePrice: number | null;
  lastPrice: number | null;
  investedValue: number | null;
  currentValue: number | null;
  unrealizedPnl: number | null;
  unrealizedPnlPercent: number | null;
  realizedPnl: number | null;
  t1Quantity: number | null;
  pledgedQuantity: number | null;
  productType: string | null;
  providerInstrumentId: string | null;
  source: BrokerId | 'manual';
  sourceTimestamp: string;
};

const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : typeof value === 'string' && value.trim() && Number.isFinite(Number(value)) ? Number(value) : null;
const calculate = (quantity: number, price: number | null) => price === null ? null : quantity * price;

export function normalizeBrokerHolding(provider: BrokerId, raw: Record<string, unknown>, retrievedAt = new Date().toISOString()): CanonicalBrokerHolding | null {
  const symbol = text(raw.trading_symbol) ?? text(raw.tradingsymbol) ?? text(raw.symbol);
  const exchange = text(raw.exchange) ?? 'NSE';
  const quantity = number(raw.quantity) ?? number(raw.net_quantity) ?? number(raw.netQuantity) ?? number(raw.netqty);
  if (!symbol || quantity === null) return null;

  const isin = text(raw.isin) ?? text(raw.symbol_isin);
  const averagePrice = number(raw.average_price) ?? number(raw.averageprice) ?? number(raw.averagePrice) ?? number(raw.net_price) ?? number(raw.buyavgprice);
  const lastPrice = number(raw.last_price) ?? number(raw.lastPrice) ?? number(raw.ltp) ?? number(raw.close);
  const investedValue = number(raw.invested_value) ?? calculate(quantity, averagePrice);
  const currentValue = number(raw.current_value) ?? calculate(quantity, lastPrice);
  const unrealizedPnl = number(raw.pnl) ?? number(raw.profitandloss) ?? (currentValue !== null && investedValue !== null ? currentValue - investedValue : null);
  const unrealizedPnlPercent = number(raw.pnl_percent) ?? number(raw.pnlpercentage) ?? (unrealizedPnl !== null && investedValue ? (unrealizedPnl / investedValue) * 100 : null);
  const providerInstrumentId = text(raw.instrument_token) ?? text(raw.instrumentToken) ?? text(raw.symboltoken) ?? text(raw.groww_contract_id);

  return {
    securityId: isin ? `isin:${isin}` : `${exchange.toLowerCase()}:${symbol.toLowerCase()}`,
    isin,
    tradingSymbol: symbol,
    companyName: text(raw.company_name) ?? text(raw.companyName),
    exchange,
    quantity,
    averagePrice,
    lastPrice,
    investedValue,
    currentValue,
    unrealizedPnl,
    unrealizedPnlPercent,
    realizedPnl: number(raw.realised_pnl) ?? number(raw.realized_pnl),
    t1Quantity: number(raw.t1_quantity) ?? number(raw.t1quantity),
    pledgedQuantity: number(raw.pledged_quantity) ?? number(raw.pledge_quantity) ?? number(raw.collateralquantity),
    productType: text(raw.product) ?? text(raw.product_type),
    providerInstrumentId,
    source: provider,
    sourceTimestamp: retrievedAt,
  };
}

export function normalizeBrokerPortfolio(provider: BrokerId, rows: unknown) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => row && typeof row === 'object' ? normalizeBrokerHolding(provider, row as Record<string, unknown>) : null).filter((holding): holding is CanonicalBrokerHolding => holding !== null);
}
