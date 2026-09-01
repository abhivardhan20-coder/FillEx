# FillEx research workers

These workers are intentionally separate from the Cloudflare-hosted UI.

- `node-market` uses `bshada/nse-bse-api` for Node-only NSE/BSE research calls.
- `python-exchange` uses `BennyThadikaran/NseIndiaApi` and `BennyThadikaran/BseIndiaApi` for rate-limited exchange research.

Do not expose either worker directly to the public internet. Put authentication, a request queue, caching, rate limits, and audit logging in front of them before production deployment. The BSE Python dependency is GPL-3.0 and must remain independently deployable.
