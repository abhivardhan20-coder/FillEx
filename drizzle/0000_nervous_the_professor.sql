CREATE TABLE `broker_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`broker` text NOT NULL,
	`provider_account_id` text,
	`encrypted_access_token` text NOT NULL,
	`encrypted_refresh_token` text,
	`token_expires_at` text,
	`status` text DEFAULT 'CONNECTED' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_sync_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_broker_accounts_user_broker_provider` ON `broker_accounts` (`user_id`,`broker`,`provider_account_id`);--> statement-breakpoint
CREATE INDEX `idx_broker_accounts_user_status` ON `broker_accounts` (`user_id`,`status`);--> statement-breakpoint
CREATE TABLE `broker_holdings` (
	`id` text PRIMARY KEY NOT NULL,
	`broker_account_id` text NOT NULL,
	`security_id` text NOT NULL,
	`isin` text,
	`trading_symbol` text NOT NULL,
	`company_name` text,
	`exchange` text NOT NULL,
	`quantity` real NOT NULL,
	`average_price` real,
	`last_price` real,
	`invested_value` real,
	`current_value` real,
	`unrealized_pnl` real,
	`unrealized_pnl_percent` real,
	`realized_pnl` real,
	`t1_quantity` real,
	`pledged_quantity` real,
	`product_type` text,
	`provider_instrument_id` text,
	`source` text NOT NULL,
	`source_timestamp` text,
	`retrieved_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`broker_account_id`) REFERENCES `broker_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`security_id`) REFERENCES `securities`(`security_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_broker_holdings_account_security_exchange_product` ON `broker_holdings` (`broker_account_id`,`security_id`,`exchange`,`product_type`);--> statement-breakpoint
CREATE INDEX `idx_broker_holdings_security` ON `broker_holdings` (`security_id`);--> statement-breakpoint
CREATE TABLE `ingestion_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`security_id` text,
	`broker_account_id` text,
	`job_type` text NOT NULL,
	`status` text DEFAULT 'DISCOVERED' NOT NULL,
	`priority` integer DEFAULT 100 NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`started_at` text,
	`completed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`security_id`) REFERENCES `securities`(`security_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`broker_account_id`) REFERENCES `broker_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ingestion_jobs_status_priority` ON `ingestion_jobs` (`status`,`priority`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_ingestion_jobs_user` ON `ingestion_jobs` (`user_id`);--> statement-breakpoint
CREATE TABLE `oauth_states` (
	`state` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`expires_at` text NOT NULL,
	`consumed_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_oauth_states_user_provider` ON `oauth_states` (`user_id`,`provider`);--> statement-breakpoint
CREATE TABLE `portfolio_positions` (
	`user_id` text NOT NULL,
	`security_id` text NOT NULL,
	`quantity` real NOT NULL,
	`weighted_average_price` real,
	`invested_value` real,
	`current_value` real,
	`unrealized_pnl` real,
	`last_calculated_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`user_id`, `security_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`security_id`) REFERENCES `securities`(`security_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_portfolio_positions_user` ON `portfolio_positions` (`user_id`);--> statement-breakpoint
CREATE TABLE `securities` (
	`security_id` text PRIMARY KEY NOT NULL,
	`isin` text,
	`company_name` text,
	`nse_symbol` text,
	`bse_symbol` text,
	`sector` text,
	`industry` text,
	`instrument_type` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_securities_isin` ON `securities` (`isin`);--> statement-breakpoint
CREATE INDEX `idx_securities_nse_symbol` ON `securities` (`nse_symbol`);--> statement-breakpoint
CREATE INDEX `idx_securities_bse_symbol` ON `securities` (`bse_symbol`);--> statement-breakpoint
CREATE TABLE `security_provider_mapping` (
	`security_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_instrument_id` text NOT NULL,
	`provider_symbol` text,
	`exchange` text,
	PRIMARY KEY(`security_id`, `provider`, `provider_instrument_id`),
	FOREIGN KEY (`security_id`) REFERENCES `securities`(`security_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_security_mapping_provider_instrument` ON `security_provider_mapping` (`provider`,`provider_instrument_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
PRAGMA optimize;
