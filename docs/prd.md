# Product Requirements Document
## AI-Powered Personal Financial Intelligence Platform

**Version:** 1.0  
**Status:** Product Architecture / Development PRD  
**Primary Market:** India  
**Primary Assets:** Indian equities, with extensibility for other securities  
**Architecture:** Portfolio-driven, event-driven, multi-source financial intelligence

---

# 1. Product Vision

Build an AI-powered financial intelligence platform that connects to a user's investment portfolio, continuously gathers relevant market, financial, regulatory, news, macroeconomic and company information, and converts that information into personalized investment intelligence.

The platform should not require users to manually search for every company.

Instead:

> **The user's portfolio determines what information the system needs to collect.**

If a user adds a new stock, the system discovers the stock, checks whether intelligence already exists for it, and automatically queues the missing data.

The user should immediately be able to see:

> "We're preparing intelligence for this company. Some information will become available shortly."

Once ingestion finishes, the stock automatically becomes available to the intelligence and analysis system.

---

# 2. Core Product Principle

## Portfolio-driven intelligence

The system must NOT be restricted to a predefined list of 100 stocks.

Example:

User connects a broker and owns:

- INFY
- TCS
- RELIANCE
- DIXON
- ZOMATO

The system checks its global data store.

```text
INFY       → READY
TCS        → READY
RELIANCE   → READY
DIXON      → NEW
ZOMATO     → PARTIALLY_READY
```

The system only fetches missing data.

The data is stored globally rather than separately for every user.

If another user later adds DIXON:

```text
User A → DIXON → fetched → stored

User B → DIXON → already available → reuse
```

This makes the platform scalable.

---

# 3. Product Goals

## Primary goals

1. Connect users' brokerage accounts securely.
2. Import holdings and positions.
3. Allow manual portfolio creation/import.
4. Identify every security in the portfolio.
5. Maintain a canonical security master.
6. Fetch live market data.
7. Fetch historical market data.
8. Fetch company financial documents.
9. Fetch regulatory documents.
10. Fetch corporate announcements.
11. Fetch corporate actions.
12. Fetch financial news.
13. Fetch general/company news.
14. Fetch macroeconomic information.
15. Store all relevant information.
16. Process documents into machine-readable data.
17. Build a financial RAG layer.
18. Generate personalized portfolio intelligence.
19. Continuously refresh changing information.
20. Show evidence/source for AI-generated claims.

---

# 4. Non-Goals

The initial version will NOT:

- guarantee investment returns;
- automatically place trades;
- provide personalized regulated investment advice;
- blindly execute AI-generated trades;
- depend on a fixed 100-stock universe;
- depend on a GitHub repository as the source of truth;
- require manually downloading thousands of PDFs;
- scrape arbitrary websites as the primary source when an official source exists.

The system is an intelligence and analysis platform.

---

# 5. Target User Journey

## First-time user

```text
Sign up
   ↓
Dashboard
   ↓
Connect broker
   ↓
Broker authentication
   ↓
Portfolio imported
   ↓
Security mapping
   ↓
Data availability check
   ↓
Missing stocks queued
   ↓
Initial portfolio intelligence generated
```

---

# 6. Portfolio Connection

The platform should support two methods.

## Method A — Broker connection

User selects:

- Groww
- Upstox
- Angel One
- Zerodha
- Dhan
- FYERS
- Additional brokers added through adapters

The platform redirects the user to the broker's official authentication page.

The platform NEVER asks users for broker passwords, PINs or TOTP codes inside our application.

---

# 7. Broker OAuth Architecture

Each broker is implemented as an independent adapter.

```text
BrokerConnection
       │
       ├── authorization_url()
       ├── callback()
       ├── exchange_token()
       ├── refresh_token()
       ├── get_profile()
       ├── get_holdings()
       ├── get_positions()
       ├── get_orders()
       ├── get_trades()
       ├── get_funds()
       └── disconnect()
```

The core application never contains broker-specific logic.

---

# 8. Upstox Integration

Upstox uses OAuth 2.0 authorization-code authentication.

Flow:

```text
Our App
   ↓
Upstox authorization URL
   ↓
User logs into Upstox
   ↓
User authorizes application
   ↓
Upstox redirects to callback
   ↓
Authorization code
   ↓
Backend exchanges code
   ↓
Access token
   ↓
Fetch portfolio
```

Upstox's current documentation explicitly describes this OAuth 2.0 authorization-code flow and requires a registered redirect URI. citeturn0search4

Portfolio endpoints include long-term holdings and short-term positions. citeturn2search0turn2search10

---

# 9. Groww Integration

Groww's current Trading API supports portfolio APIs including holdings and positions. Its holdings API returns information such as:

- ISIN
- trading symbol
- quantity
- average price
- pledge quantity
- locked quantities
- T1 quantity
- corporate-action additional quantity citeturn1search1


Groww currently documents multiple authentication approaches, including OAuth 2.0 as well as access-token/API-key/TOTP mechanisms. The exact flow should therefore be implemented according to the broker application credentials available to us. citeturn1search2turn1search5

Groww's current API offering requires an active Trading API subscription. citeturn1search3

---

# 10. Angel One Integration

Angel One SmartAPI provides a publisher login flow and also documents credential/TOTP-based authentication.

Publisher flow:

```text
Our App
   ↓
Angel One publisher login
   ↓
User authentication
   ↓
Redirect
   ↓
auth token / feed token
   ↓
Backend
   ↓
Portfolio + market APIs
```

SmartAPI documents a publisher-login endpoint and a separate login-by-password/TOTP flow. citeturn2search6

The implementation must use the currently approved authentication method for the application rather than assuming generic OAuth.

---

# 11. Zerodha Integration

Zerodha Kite Connect uses an OAuth-style login flow.

```text
Our App
   ↓
Kite login
   ↓
User authenticates
   ↓
request_token
   ↓
Backend token exchange
   ↓
access_token
```

The access token normally expires at 6 AM the following day unless other approved long-lived arrangements apply. citeturn2search1turn2search2

The API supports portfolio, market quotes, instruments, historical data and WebSocket streaming. citeturn2search8

---

# 12. Dhan Integration

Dhan supports an OAuth-based flow for individual users and provides portfolio APIs.

Its holdings API exposes:

- exchange
- trading symbol
- security ID
- ISIN
- quantity
- available quantity
- average cost

Its positions API exposes open positions and derivatives-related information. citeturn1search0

Dhan API credentials have a documented validity period and OAuth-based authentication is supported. citeturn1search10

---

# 13. Manual Portfolio

Users who don't want to connect a broker can:

### Option 1 — Add holding manually

Fields:

```text
Company
ISIN / Symbol
Exchange
Quantity
Average Buy Price
Purchase Date
```

### Option 2 — CSV import

Supported columns:

```text
symbol
isin
exchange
quantity
average_price
purchase_date
```

### Option 3 — Future

Import broker contract notes/statements.

---

# 14. Portfolio Data Model

Each holding should contain:

```text
user_id
broker_connection_id
security_id
isin
exchange
symbol
quantity
average_cost
current_price
market_value
unrealized_pnl
realized_pnl
portfolio_weight
currency
source
last_synced_at
```

---

# 15. Canonical Security Master

This is one of the most important components.

Every external identifier must map to one internal security.

Example:

```text
Internal Security ID
        │
        ├── ISIN
        ├── NSE symbol
        ├── BSE code
        ├── Angel token
        ├── Upstox instrument key
        ├── Groww symbol
        ├── Dhan security ID
        └── Zerodha instrument token
```

ISIN should be used as the preferred cross-provider identity when available.

---

# 16. Dynamic Stock Discovery

When a new holding is detected:

```text
Portfolio Sync
      ↓
Extract securities
      ↓
Canonical mapping
      ↓
Check Global Data Store
      ↓
 ┌───────────────┐
 │ Data exists?  │
 └───────┬───────┘
       YES │ NO
           │
           ▼
        Queue
```

---

# 17. Stock Data Lifecycle

Every security should have a state:

```text
DISCOVERED
   ↓
MAPPED
   ↓
QUEUED
   ↓
FETCHING
   ↓
PARTIALLY_READY
   ↓
READY
   ↓
STALE
   ↓
REFRESHING
```

---

# 18. User Experience During Ingestion

When a new stock is discovered:

```text
DIXON

🟡 Preparing intelligence

Market data       ✓
Company identity  ✓
News              ✓
Financial filings ⏳
Corporate actions ⏳
Fundamentals      ⏳

We'll notify you when the remaining intelligence is ready.
```

The user should not see an empty/broken page.

---

# 19. Market Data Layer

The platform requires:

## Real-time

- LTP
- bid
- ask
- OHLC
- volume
- traded value
- market depth where available
- exchange timestamp
- provider timestamp

## Historical

- 1-minute candles
- 5-minute candles
- 15-minute candles
- hourly
- daily
- weekly
- monthly

Availability depends on provider.

---

# 20. Multi-Provider Market Architecture

Use multiple broker/data providers rather than depending on one.

```text
Angel One
    │
Upstox
    │
FYERS
    │
Groww / others
    │
    ▼
Market Data Normalizer
    ↓
Canonical Market Store
```

Provider adapters should expose:

```text
get_ltp()
get_quote()
get_ohlc()
get_historical()
subscribe_ticks()
unsubscribe_ticks()
```

---

# 21. Live Data Selection

The system should select the best available provider.

Example:

```text
Primary: Angel One
Secondary: Upstox
Tertiary: FYERS
```

If primary feed becomes unavailable:

```text
Provider health check
        ↓
Failover
        ↓
Secondary feed
```

The UI should retain:

```text
Data source
Exchange timestamp
Received timestamp
Data freshness
```

---

# 22. Market Data Freshness

Every market-data record must have:

```text
event_time
received_at
provider
instrument_id
price
volume
```

The system must calculate:

```text
data_age = received_at - event_time
```

UI states:

```text
LIVE
RECENT
STALE
UNAVAILABLE
```

Never claim "live" when the source is delayed.

---

# 23. Financial Document Layer

The platform needs:

- Annual reports
- Quarterly results
- Financial statements
- Investor presentations
- Earnings-related documents
- Corporate governance documents
- Shareholding patterns
- BRSR
- Related-party transactions
- Insider trading disclosures
- Voting results
- Other material filings

SEBI's corporate-filings reference explicitly points to NSE/BSE categories for governance, shareholding patterns, BRSR, financial results, investor complaints, voting results, related-party transactions, secretarial compliance, insider trading and other filings. citeturn0search1

---

# 24. Official Document Sources

The source hierarchy should be:

```text
1. NSE
2. BSE
3. SEBI
4. Company Investor Relations
5. Optional commercial provider
```

We should NOT make an arbitrary GitHub repository the source of truth.

---

# 25. NSE Document Ingestion

For every security:

```text
Search company
   ↓
Identify filings
   ↓
Fetch metadata
   ↓
Fetch attachment
   ↓
Store original
   ↓
Extract text
   ↓
Normalize
```

NSE provides a corporate-announcements interface that supports company/symbol and keyword searches and CSV download. citeturn0search11

---

# 26. BSE Document Ingestion

Use BSE company/filing interfaces for:

- financial results
- announcements
- annual reports
- corporate filings
- corporate actions

The ingestion service should preserve:

```text
source = BSE
source_url
document_id
company
filing_type
filing_date
downloaded_at
```

---

# 27. SEBI Ingestion

SEBI should be treated as a regulatory source.

The current SEBI filing portal supports searches by:

- title
- keywords
- entity name
- date
- subsection

and currently exposes over 15,000 records. citeturn0search3

Use it for:

- DRHP
- RHP
- prospectus
- regulatory filings
- public issue material
- takeovers
- schemes
- regulatory documents
- other applicable filings

---

# 28. Company IR Fallback

If an important document cannot be found through NSE/BSE/SEBI:

```text
Company
   ↓
Investor Relations
   ↓
Annual Reports
Financial Results
Presentations
Transcripts
```

The original URL must be retained.

---

# 29. Document Storage

Use object storage for originals.

Example:

```text
documents/
  security_id/
    annual_reports/
    quarterly_results/
    presentations/
    announcements/
    regulatory/
```

Database stores metadata.

Object storage stores files.

Vector database stores embeddings.

---

# 30. Document Processing Pipeline

```text
PDF/HTML/XLS
     ↓
File validation
     ↓
Text extraction
     ↓
OCR if required
     ↓
Page segmentation
     ↓
Table extraction
     ↓
Metadata extraction
     ↓
Document classification
     ↓
Chunking
     ↓
Embedding
     ↓
Vector database
```

---

# 31. Evidence Preservation

Every RAG chunk must retain:

```text
document_id
security_id
source
source_url
page_number
section
filing_date
document_date
chunk_id
```

AI responses should be able to say:

> "According to Infosys Q4 FY26 results..."

and provide the source.

---

# 32. News Layer

Use multiple sources.

## Primary financial news

**Marketaux**

Current free plan:

- 100 requests/day
- 3 articles per request
- instant news
- 200,000+ entities
- 5,000+ sources
- 80+ markets
- 30+ languages citeturn0search0turn0search6


Marketaux supports filtering by:

- entity
- symbol
- exchange
- industry
- country

which fits portfolio-specific news ingestion. citeturn0search6

---

# 33. General News

Use GNews as a secondary source.

Current free tier:

- 100 requests/day
- up to 10 articles/request
- 30-day history
- 12-hour delay
- development/testing use

The free tier is therefore NOT the source for real-time production news. citeturn0search2

---

# 34. News Pipeline

```text
Marketaux
    +
GNews
    +
NSE/BSE announcements
    +
Company IR
       ↓
News Collector
       ↓
Entity Resolver
       ↓
Deduplication
       ↓
Event Classification
       ↓
Sentiment
       ↓
News Store
```

---

# 35. News Entity Resolution

Every article should map to:

```text
security_id
company
ticker
ISIN
sector
industry
```

Example:

```text
"Infosys wins major contract..."

→ INFY
→ INE009A01021
→ Information Technology
```

---

# 36. News Deduplication

Same event can appear through:

- Reuters
- Economic Times
- Moneycontrol
- Marketaux
- GNews
- exchange announcement

The system must group duplicates.

Use:

```text
normalized headline
source
publication timestamp
company
semantic similarity
URL
```

---

# 37. Sentiment

Do NOT store only:

```text
positive / negative
```

Extract:

```text
sentiment
confidence
event_type
affected_company
direction
impact
time_horizon
evidence
```

Example:

```text
Company: INFY
Event: Large contract
Sentiment: Positive
Confidence: 0.91
Expected impact: Medium
Horizon: Near-term
```

---

# 38. Corporate Actions

Collect:

- dividends
- splits
- bonuses
- rights issues
- buybacks
- mergers
- demergers
- record dates
- ex dates

Primary sources:

```text
NSE
BSE
Company filings
```

---

# 39. Corporate Action Adjustment

Never overwrite raw market data.

Store:

```text
RAW PRICE
     +
CORPORATE ACTION
     +
ADJUSTMENT FACTOR
```

This allows historical returns to be reconstructed correctly.

---

# 40. Macro Data

## India

Primary:

**RBI DBIE**

Collect:

- repo rate
- CPI
- GDP
- interest rates
- exchange rates
- banking indicators
- money/credit
- external sector
- financial market indicators

## Global

Optional:

**FRED**

Collect:

- Fed funds rate
- US CPI
- US GDP
- US 10Y yield
- global macro indicators

---

# 41. Macro Refresh

Macro data is not real-time tick data.

Use scheduled ingestion:

```text
Daily
Weekly
Monthly
Quarterly
Event-driven
```

depending on the series.

---

# 42. Global Data Store

The most important architectural principle:

> **Data belongs to the platform, not to an individual user.**

Example:

```text
users
  │
  ├── User A → INFY
  ├── User B → INFY
  └── User C → INFY
                │
                ▼
          Shared INFY dataset
```

---

# 43. Data Availability Service

Every security gets a data readiness object.

```text
security_id

market_data: READY
documents: READY
news: READY
corporate_actions: READY
macro_context: READY
fundamentals: PARTIAL
```

---

# 44. Data Readiness API

Example:

```http
GET /api/securities/{security_id}/readiness
```

Response:

```json
{
  "security": "DIXON",
  "overall_status": "PARTIALLY_READY",
  "market_data": "READY",
  "news": "READY",
  "documents": "FETCHING",
  "corporate_actions": "READY",
  "fundamentals": "FETCHING"
}
```

---

# 45. Ingestion Queue

Use background workers.

```text
Stock discovered
      ↓
Create ingestion jobs
      ↓
Queue
      ↓
Workers
```

Job types:

```text
FETCH_REFERENCE
FETCH_MARKET_HISTORY
FETCH_DOCUMENTS
FETCH_NEWS
FETCH_CORPORATE_ACTIONS
FETCH_MACRO
PROCESS_DOCUMENT
EMBED_DOCUMENT
REFRESH_NEWS
```

---

# 46. Priority System

Not all jobs have equal priority.

```text
P0 — User's newly added stock
P1 — Existing portfolio stock
P2 — Watchlist stock
P3 — Background universe
```

New portfolio additions should be processed immediately.

---

# 47. Retry Strategy

Every external integration must support:

```text
timeout
retry
exponential backoff
rate-limit handling
circuit breaker
dead-letter queue
```

Example:

```text
Attempt 1
   ↓
429
   ↓
Wait
   ↓
Attempt 2
   ↓
Success
```

---

# 48. Provider Rate Limiting

Each provider gets its own rate limiter.

```text
Marketaux
100/day

GNews
100/day free

Broker APIs
provider-specific

NSE
provider-specific

SEBI
provider-specific
```

Never let one provider's rate limit block the entire ingestion system.

---

# 49. Provider Abstraction

All external providers should implement interfaces.

Example:

```text
MarketDataProvider
NewsProvider
DocumentProvider
PortfolioProvider
CorporateActionProvider
MacroProvider
```

Then:

```text
MarketDataProvider
 ├── AngelOne
 ├── Upstox
 └── FYERS
```

and:

```text
NewsProvider
 ├── Marketaux
 └── GNews
```

---

# 50. Authentication Security

Broker credentials and tokens must NEVER be stored in plaintext.

Use:

```text
KMS / Vault
Encrypted DB fields
Secrets manager
```

Store:

```text
encrypted_access_token
encrypted_refresh_token
provider
user_id
expires_at
scope
created_at
updated_at
```

Never store:

- broker password
- PIN
- TOTP secret
- raw API secret in frontend

---

# 51. OAuth State Protection

Every OAuth request must include:

```text
state
```

The state must be:

- random
- single-use
- short-lived
- tied to user/session
- validated during callback

Prevent:

- CSRF
- callback injection
- account-linking attacks

---

# 52. OAuth Callback

Example:

```text
GET /api/integrations/upstox/callback
```

Flow:

```text
validate state
     ↓
validate code
     ↓
exchange token
     ↓
encrypt token
     ↓
store connection
     ↓
queue portfolio sync
     ↓
redirect dashboard
```

---

# 53. Broker Disconnect

User clicks:

> Disconnect Upstox

System:

```text
revoke/logout if supported
       ↓
delete encrypted credentials
       ↓
mark connection disconnected
       ↓
retain historical portfolio snapshots
       ↓
stop broker sync jobs
```

Historical intelligence should not disappear just because a broker is disconnected.

---

# 54. Portfolio Sync

Initial:

```text
Connect
 ↓
Fetch holdings
 ↓
Fetch positions
 ↓
Normalize
 ↓
Persist snapshot
```

Ongoing:

```text
Scheduled sync
 +
User refresh
 +
Broker events where supported
```

---

# 55. Portfolio Snapshot

Store snapshots rather than overwriting everything.

```text
portfolio_snapshot
timestamp
total_value
cash
invested_value
unrealized_pnl
realized_pnl
```

Holding snapshot:

```text
security_id
quantity
average_cost
market_price
market_value
pnl
timestamp
```

This enables historical portfolio analytics.

---

# 56. Manual Data Reconciliation

If broker says:

```text
INFY = 50 shares
```

and user manually says:

```text
INFY = 60 shares
```

the system must not silently merge them.

Show:

> Broker: 50  
> Manual: 60

Allow user to select the authoritative source.

---

# 57. Dashboard

Main dashboard:

```text
Portfolio Value
Today's P&L
Total P&L
Portfolio allocation
Top gainers
Top losers
Risk indicators
News alerts
Important events
AI insights
```

---

# 58. Stock Detail Page

For every portfolio security:

```text
Price
Chart
Position
P&L
Financial health
Valuation
Recent news
Corporate actions
Financial documents
Management commentary
Institutional holding
Risk signals
AI summary
```

---

# 59. AI Intelligence Layer

The intelligence layer combines:

```text
Portfolio
+
Market data
+
Financial documents
+
News
+
Corporate actions
+
Macro
+
Company metadata
```

---

# 60. RAG Architecture

```text
Documents
   ↓
Parser
   ↓
Chunker
   ↓
Embeddings
   ↓
Vector DB
   ↓
Retriever
   ↓
Reranker
   ↓
LLM
   ↓
Answer + evidence
```

---

# 61. Financial RAG Requirements

The retriever must understand:

- company
- fiscal year
- quarter
- document type
- filing date
- financial metric
- section
- page
- source

Example query:

> "Why did Infosys margins decline?"

Retriever should prioritize:

```text
INFY
Quarterly results
Management commentary
Annual report
Earnings presentation
```

rather than generic web articles.

---

# 62. Intelligence Agents

Recommended agents:

### Portfolio Agent

Understands:

- holdings
- allocation
- concentration
- P&L
- exposure

### Fundamental Agent

Analyzes:

- revenue
- EBITDA
- PAT
- margins
- ROE
- ROCE
- debt
- cash flow

### News/Sentiment Agent

Analyzes:

- news
- events
- sentiment
- material developments

### Risk Agent

Identifies:

- concentration
- volatility
- drawdown
- corporate risks
- governance signals
- leverage

### Macro Agent

Connects:

```text
RBI
interest rates
inflation
currency
global macro
```

to portfolio exposure.

### Research Agent

Answers questions using the RAG corpus.

---

# 63. AI Answer Requirements

Every material factual answer should contain:

```text
Claim
Evidence
Source
Date
Confidence
```

Example:

> Infosys' operating margin declined because of...

Then:

```text
Source: Infosys Q4 FY26 results
Page: 12
Filed: ...
```

---

# 64. Alerts

The system should detect:

- major price movement
- major news
- earnings release
- dividend
- split
- buyback
- management change
- major regulatory event
- unusual volume
- portfolio concentration
- material negative event

---

# 65. Alert Pipeline

```text
External Event
     ↓
Normalizer
     ↓
Security Mapping
     ↓
Materiality Model
     ↓
User Portfolio Matching
     ↓
Alert
```

Only alert users holding the affected security unless the event is broad market/macro relevant.

---

# 66. Watchlist

Users can add securities not currently held.

Watchlist stocks should have lower ingestion priority than portfolio stocks.

```text
Portfolio → P0
Watchlist → P2
```

---

# 67. Data Freshness

Every dataset must show:

```text
last_updated_at
source
provider
freshness
```

Example:

```text
Market price
LIVE — Angel One — 0.8 sec ago

News
2 min ago — Marketaux

Financial result
Filed 2 days ago — NSE
```

---

# 68. Data Quality

Implement validation rules.

Examples:

```text
Price >= 0
Quantity >= 0
ISIN format valid
Currency valid
Exchange valid
Timestamp valid
```

For financial statements:

```text
Assets ≈ Liabilities + Equity
```

where applicable.

---

# 69. Source Reliability

Every source gets a reliability level:

```text
TIER 1
Official exchange/regulator/company

TIER 2
Licensed financial provider

TIER 3
General news provider

TIER 4
Unverified web content
```

RAG should prioritize higher-tier evidence.

---

# 70. External Data Source Matrix

## Market

```text
Angel One
Upstox
FYERS
Groww
```

## Portfolio

```text
Groww
Upstox
Angel One
Zerodha
Dhan
FYERS
Manual
```

## Documents

```text
NSE
BSE
SEBI
Company IR
FinancialFilings optional
```

## News

```text
Marketaux
GNews
NSE/BSE announcements
Company IR
```

## Corporate Actions

```text
NSE
BSE
Company filings
```

## Reference Data

```text
NSE
BSE
Broker instrument masters
```

## Macro

```text
RBI DBIE
FRED optional
```

---

# 71. No Manual Bulk Dataset Requirement

The system should NOT require downloading a static 100-stock dataset.

Initial configuration may contain only:

```text
Supported exchanges
Provider credentials
Source configuration
```

The stock universe is dynamically generated from user portfolios.

---

# 72. Dynamic Ingestion Example

User adds:

```text
DIXON
```

System:

```text
1. Resolve ISIN
2. Resolve NSE/BSE identifiers
3. Check market data
4. Check documents
5. Check news
6. Check corporate actions
7. Check fundamentals
8. Queue missing data
```

User sees:

> DIXON detected. We're preparing its financial intelligence.

---

# 73. Shared Cache

All normalized company data should be reusable.

```text
Global Security
       │
       ├── Documents
       ├── News
       ├── Market history
       ├── Corporate actions
       ├── Fundamentals
       └── Metadata
```

User-specific data remains isolated:

```text
User
 ├── holdings
 ├── transactions
 ├── portfolio metrics
 └── preferences
```

---

# 74. Database Architecture

Recommended logical databases:

### PostgreSQL

For:

- users
- broker connections
- securities
- holdings
- portfolio snapshots
- documents metadata
- news metadata
- corporate actions
- ingestion jobs

### Object Storage

For:

- PDFs
- original documents
- raw API payloads
- extracted artifacts

### Redis

For:

- queues
- caching
- locks
- rate limits
- live state

### Vector Database

For:

- document embeddings
- semantic retrieval

---

# 75. Core Tables

```text
users

broker_connections

securities

security_identifiers

holdings

positions

portfolio_snapshots

market_ticks

market_candles

documents

document_chunks

news_articles

news_entities

corporate_actions

macro_series

macro_observations

ingestion_jobs

provider_health

alerts

watchlists

ai_insights
```

---

# 76. Security Identifier Table

```text
security_id
identifier_type
identifier_value
provider
exchange
valid_from
valid_to
```

Examples:

```text
ISIN
NSE_SYMBOL
BSE_CODE
ANGEL_TOKEN
UPSTOX_KEY
GROWW_SYMBOL
DHAN_SECURITY_ID
ZERODHA_TOKEN
```

---

# 77. Ingestion Job Table

```text
job_id
security_id
job_type
priority
status
provider
attempt_count
scheduled_at
started_at
completed_at
error
```

---

# 78. Provider Health

Track:

```text
provider
status
latency
last_success
last_error
rate_limit_remaining
```

This allows automatic provider failover.

---

# 79. API Layer

Example endpoints:

```text
POST /auth/register

GET /portfolio
POST /portfolio/manual
POST /portfolio/import

GET /brokers
POST /brokers/{broker}/connect
GET /brokers/{broker}/callback
DELETE /brokers/{broker}

POST /portfolio/sync

GET /securities/{id}
GET /securities/{id}/readiness

GET /market/{id}
GET /market/{id}/history

GET /news
GET /documents
GET /corporate-actions

GET /portfolio/insights
POST /ai/query

GET /alerts
POST /alerts/{id}/read
```

---

# 80. Broker Adapter API

Each adapter must expose:

```text
connect()
callback()
disconnect()

get_profile()

get_holdings()
get_positions()
get_orders()
get_trades()
get_funds()

subscribe_market_data()
get_quote()
get_historical_data()
```

Not every broker must support every operation.

The adapter returns:

```text
SUPPORTED
UNSUPPORTED
TEMPORARILY_UNAVAILABLE
```

rather than pretending all brokers have identical capabilities.

---

# 81. Background Worker Architecture

Workers:

```text
PortfolioSyncWorker

MarketDataWorker

NewsWorker

DocumentDiscoveryWorker

DocumentDownloadWorker

DocumentProcessingWorker

EmbeddingWorker

CorporateActionWorker

MacroWorker

AlertWorker
```

---

# 82. Scheduler

Suggested schedule:

```text
Live market:
WebSocket

Portfolio:
periodic sync + user refresh

News:
frequent polling within provider limits

Corporate announcements:
frequent polling

Corporate actions:
daily / event-driven

Documents:
daily discovery

Macro:
according to release frequency

Embeddings:
event-driven after document processing
```

---

# 83. Failure Handling

If a provider fails:

```text
Provider failure
     ↓
Retry
     ↓
Circuit breaker
     ↓
Fallback provider
     ↓
Mark stale if all fail
```

Never delete valid previous data because a provider temporarily failed.

---

# 84. User Privacy

Portfolio data is highly sensitive.

Requirements:

- encryption at rest
- TLS in transit
- strict tenant isolation
- no broker credentials in frontend
- token encryption
- audit logs
- access control
- secure deletion
- provider disconnect handling

---

# 85. Audit Log

Track:

```text
user
action
timestamp
provider
resource
result
IP/session metadata where appropriate
```

Especially:

- broker connection
- broker disconnection
- token refresh
- portfolio sync
- manual portfolio modification
- AI query
- data export

---

# 86. Data Retention

### User data

Retain according to product/legal policy.

### Market data

Retain according to provider licensing.

### Documents

Retain source files and metadata according to source/license terms.

### News

Store metadata/snippet/link as permitted by provider licensing.

Do not assume that "publicly accessible" means "free to redistribute."

---

# 87. AI Safety

The AI must distinguish:

```text
FACT
INFERENCE
OPINION
UNCERTAINTY
```

Example:

> "Revenue increased 18%."

FACT.

> "This may support stronger sentiment."

INFERENCE.

Never present an inference as a confirmed company fact.

---

# 88. Investment Disclaimer

The product should clearly state:

> The platform provides informational and analytical insights and does not guarantee investment outcomes or constitute personalized regulated investment advice.

---

# 89. MVP

The first working version should include:

### Authentication

- user signup/login

### Broker

- Upstox
- Groww
- Angel One
- Manual portfolio

### Market

- live LTP
- historical daily data

### Data

- dynamic stock discovery
- NSE/BSE documents
- SEBI regulatory documents
- Marketaux news
- corporate actions

### AI

- document RAG
- company summary
- portfolio summary
- news sentiment
- basic risk analysis

---

# 90. Phase 2

Add:

- Zerodha
- Dhan
- FYERS
- additional brokers
- WebSocket failover
- deeper historical market data
- more document categories
- macro intelligence
- advanced alerts
- portfolio attribution
- sector analysis

---

# 91. Phase 3

Add:

- advanced financial modeling
- automated earnings analysis
- institutional ownership analysis
- scenario analysis
- portfolio optimization
- advanced event detection
- research reports
- multi-asset support

---

# 92. Definition of Done — Broker Integration

A broker is considered complete when:

- user can connect;
- authentication occurs on broker domain;
- callback is secure;
- tokens are encrypted;
- holdings can be fetched;
- positions can be fetched where supported;
- identifiers are normalized;
- sync works;
- disconnect works;
- errors are handled;
- no credentials are stored;
- provider limitations are represented accurately.

---

# 93. Definition of Done — New Stock

When a new stock is added:

```text
Within ingestion pipeline:

✓ Identify security
✓ Map ISIN
✓ Map exchange IDs
✓ Queue data
✓ Fetch market metadata
✓ Fetch relevant documents
✓ Fetch news
✓ Fetch corporate actions
✓ Process documents
✓ Generate embeddings
✓ Mark readiness
```

The user must never have to manually trigger all of these steps.

---

# 94. Definition of Done — AI Answer

Every financial answer must:

```text
✓ identify relevant company
✓ retrieve relevant evidence
✓ prefer official documents
✓ distinguish facts from inference
✓ include dates
✓ include source
✓ avoid fabricated numbers
✓ handle missing data explicitly
```

---

# 95. Final Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
                          Broker / Manual
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ PORTFOLIO SERVICE    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ SECURITY MASTER      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ STOCK DISCOVERY      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                 EXISTING                           NEW
                    │                                │
                    ▼                                ▼
                  REUSE                       INGESTION QUEUE
                                                     │
             ┌───────────────────────────────────────┼─────────────────┐
             │                 │                     │                 │
             ▼                 ▼                     ▼                 ▼
         MARKET            DOCUMENTS              NEWS            CORPORATE
         DATA              NSE/BSE/SEBI        Marketaux          ACTIONS
         │                 Company IR           GNews             NSE/BSE
         │
         ▼
     NORMALIZATION
             │
             ▼
       GLOBAL DATA STORE
             │
      ┌──────┼─────────────┐
      ▼      ▼             ▼
    SQL    Object        Vector
           Storage        DB
      │      │             │
      └──────┼─────────────┘
             ▼
       INTELLIGENCE LAYER
             │
   ┌─────────┼──────────┬──────────┐
   ▼         ▼          ▼          ▼
Portfolio Fundamental News       Risk
Agent      Agent       Agent      Agent
             │
             ▼
          AI/RAG
             │
             ▼
          USER UI
```

# 96. Final External-Source Decisions

## Market

**Primary:**
- Angel One
- Upstox
- FYERS

## Portfolio

**Primary:**
- Groww
- Upstox
- Angel One
- Zerodha
- Dhan
- FYERS
- Manual

## Documents

**Primary:**
- NSE
- BSE
- SEBI
- Company IR

**Optional paid acceleration:**
- FinancialFilings

## News

**Primary:**
- Marketaux

**Secondary:**
- GNews

## Corporate Actions

**Primary:**
- NSE
- BSE
- Company filings

## Reference

**Primary:**
- NSE
- BSE
- broker instrument masters

## Macro

**Primary:**
- RBI DBIE

**Optional:**
- FRED

---

# 97. Most Important Product Decision

The platform is NOT:

> "An application with 100 preloaded stocks."

It is:

> **"A portfolio-aware financial intelligence engine that dynamically builds the required knowledge base around every security a user owns or watches."**

That means the platform can start with:

```text
1 user
5 stocks
```

and eventually support:

```text
100,000 users
thousands of unique securities
```

without changing the fundamental ingestion architecture.

---

# 98. First Development Milestone

The first end-to-end vertical slice should be:

```text
User
 ↓
Connect Upstox
 ↓
OAuth
 ↓
Fetch holdings
 ↓
Resolve ISIN
 ↓
Check security store
 ↓
Discover new stock
 ↓
Fetch NSE/BSE/SEBI documents
 ↓
Fetch Marketaux news
 ↓
Store data
 ↓
Process document
 ↓
Embed
 ↓
RAG
 ↓
Ask:
"Tell me about my portfolio"
 ↓
AI response with evidence
```

Once this works for **one broker + one stock**, the rest of the system should be implemented through adapters rather than creating separate architectures for each provider.

---

# 99. Final Product Principle

**Broker APIs tell us WHAT the user owns.**

**Market APIs tell us WHAT IS HAPPENING NOW.**

**NSE/BSE/SEBI tell us WHAT THE COMPANY/REGULATOR DISCLOSED.**

**News APIs tell us WHAT THE MARKET IS SAYING.**

**RBI/FRED tell us WHAT THE MACRO ENVIRONMENT IS DOING.**

**RAG + AI tells us WHAT IT MEANS FOR THE USER'S PORTFOLIO.**

That is the complete product.