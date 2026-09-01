import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const passwordAccounts = sqliteTable(
  'password_accounts',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    displayName: text('display_name').notNull(),
    passwordHash: text('password_hash').notNull(),
    passwordSalt: text('password_salt').notNull(),
    passwordIterations: integer('password_iterations')
      .notNull()
      .default(210000),
    failedAttempts: integer('failed_attempts').notNull().default(0),
    lockedUntil: text('locked_until'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [uniqueIndex('idx_password_accounts_email').on(table.email)],
);

export const authSessions = sqliteTable(
  'auth_sessions',
  {
    idHash: text('id_hash').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index('idx_auth_sessions_user').on(table.userId),
    index('idx_auth_sessions_expires').on(table.expiresAt),
  ],
);

export const brokerAccounts = sqliteTable(
  'broker_accounts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    broker: text('broker').notNull(),
    providerAccountId: text('provider_account_id'),
    encryptedAccessToken: text('encrypted_access_token').notNull(),
    encryptedRefreshToken: text('encrypted_refresh_token'),
    tokenExpiresAt: text('token_expires_at'),
    status: text('status').notNull().default('CONNECTED'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    lastSyncAt: text('last_sync_at'),
  },
  (table) => [
    uniqueIndex('idx_broker_accounts_user_broker_provider').on(
      table.userId,
      table.broker,
      table.providerAccountId,
    ),
    index('idx_broker_accounts_user_status').on(table.userId, table.status),
  ],
);

export const securities = sqliteTable(
  'securities',
  {
    securityId: text('security_id').primaryKey(),
    isin: text('isin'),
    companyName: text('company_name'),
    nseSymbol: text('nse_symbol'),
    bseSymbol: text('bse_symbol'),
    sector: text('sector'),
    industry: text('industry'),
    instrumentType: text('instrument_type'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex('idx_securities_isin').on(table.isin),
    index('idx_securities_nse_symbol').on(table.nseSymbol),
    index('idx_securities_bse_symbol').on(table.bseSymbol),
  ],
);

export const securityProviderMappings = sqliteTable(
  'security_provider_mapping',
  {
    securityId: text('security_id')
      .notNull()
      .references(() => securities.securityId, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    providerInstrumentId: text('provider_instrument_id').notNull(),
    providerSymbol: text('provider_symbol'),
    exchange: text('exchange'),
  },
  (table) => [
    primaryKey({
      columns: [table.securityId, table.provider, table.providerInstrumentId],
    }),
    uniqueIndex('idx_security_mapping_provider_instrument').on(
      table.provider,
      table.providerInstrumentId,
    ),
  ],
);

export const brokerHoldings = sqliteTable(
  'broker_holdings',
  {
    id: text('id').primaryKey(),
    brokerAccountId: text('broker_account_id')
      .notNull()
      .references(() => brokerAccounts.id, { onDelete: 'cascade' }),
    securityId: text('security_id')
      .notNull()
      .references(() => securities.securityId),
    isin: text('isin'),
    tradingSymbol: text('trading_symbol').notNull(),
    companyName: text('company_name'),
    exchange: text('exchange').notNull(),
    quantity: real('quantity').notNull(),
    averagePrice: real('average_price'),
    lastPrice: real('last_price'),
    investedValue: real('invested_value'),
    currentValue: real('current_value'),
    unrealizedPnl: real('unrealized_pnl'),
    unrealizedPnlPercent: real('unrealized_pnl_percent'),
    realizedPnl: real('realized_pnl'),
    t1Quantity: real('t1_quantity'),
    pledgedQuantity: real('pledged_quantity'),
    productType: text('product_type'),
    providerInstrumentId: text('provider_instrument_id'),
    source: text('source').notNull(),
    sourceTimestamp: text('source_timestamp'),
    retrievedAt: text('retrieved_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex('idx_broker_holdings_account_security_exchange_product').on(
      table.brokerAccountId,
      table.securityId,
      table.exchange,
      table.productType,
    ),
    index('idx_broker_holdings_security').on(table.securityId),
  ],
);

export const portfolioPositions = sqliteTable(
  'portfolio_positions',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    securityId: text('security_id')
      .notNull()
      .references(() => securities.securityId),
    quantity: real('quantity').notNull(),
    weightedAveragePrice: real('weighted_average_price'),
    investedValue: real('invested_value'),
    currentValue: real('current_value'),
    unrealizedPnl: real('unrealized_pnl'),
    lastCalculatedAt: text('last_calculated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.securityId] }),
    index('idx_portfolio_positions_user').on(table.userId),
  ],
);

export const ingestionJobs = sqliteTable(
  'ingestion_jobs',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    securityId: text('security_id').references(() => securities.securityId),
    brokerAccountId: text('broker_account_id').references(
      () => brokerAccounts.id,
      { onDelete: 'cascade' },
    ),
    jobType: text('job_type').notNull(),
    status: text('status').notNull().default('DISCOVERED'),
    priority: integer('priority').notNull().default(100),
    attempts: integer('attempts').notNull().default(0),
    lastError: text('last_error'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    startedAt: text('started_at'),
    completedAt: text('completed_at'),
  },
  (table) => [
    index('idx_ingestion_jobs_status_priority').on(
      table.status,
      table.priority,
      table.createdAt,
    ),
    index('idx_ingestion_jobs_user').on(table.userId),
  ],
);

export const oauthStates = sqliteTable(
  'oauth_states',
  {
    state: text('state').primaryKey(),
    userId: text('user_id').notNull(),
    provider: text('provider').notNull(),
    expiresAt: text('expires_at').notNull(),
    consumedAt: text('consumed_at'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index('idx_oauth_states_user_provider').on(table.userId, table.provider),
  ],
);
