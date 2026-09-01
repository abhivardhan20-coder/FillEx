# FillEx integration architecture

FillEx deliberately separates the hosted user interface from exchange-session workers.

## Source precedence

1. Official broker and licensed live-feed APIs: Upstox, Angel One, Zerodha, Groww, or Kun Data.
2. Authoritative filings: NSE, BSE, SEBI, and company investor-relations pages.
3. Licensed filing and news providers: FinancialFilings, NewsAPI, and GNews.
4. Open-source fallback and research tools.

## Open-source repositories used

- `0xramm/Indian-Stock-Market-API`: its Yahoo Finance search/quote approach is adapted into the hosted `/api/market/*` fallback and clearly labeled as non-authoritative.
- `bshada/nse-bse-api`: the Node integration scaffold is in `workers/node-market`.
- `BennyThadikaran/NseIndiaApi`: the NSE Python integration scaffold is in `workers/python-exchange` and must honor the documented three-requests-per-second ceiling.
- `BennyThadikaran/BseIndiaApi`: the BSE Python integration remains isolated in `workers/python-exchange` because it is GPL-3.0 licensed.
- `StockerAPI/india-stock-market-api`: the repository is a provider specification, not a redistributable SDK. Its runtime integration remains credential-gated by `STOCKER_API_TOKEN`.

Cloned upstream repositories live in the workspace-level `external` directory and are not bundled into the hosted site.

## Data rules

- Never synthesize portfolio holdings, prices, filings, news, or source citations.
- Never label Yahoo Finance fallback data as exchange-live.
- Keep API keys server-side.
- Show an unavailable state when a required source is not connected.
- Store manually entered holdings only in browser local storage until a real user account and encrypted backend are introduced.
