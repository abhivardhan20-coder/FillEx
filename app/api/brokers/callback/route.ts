import { encryptBrokerSecret } from '@/lib/server/secret-crypto';
import { brokerIds, type BrokerId } from '@/lib/brokers/providers';
import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';
import { kickPortfolioWorker } from '@/lib/server/portfolio-worker';

type TokenResult = { accessToken: string; refreshToken: string | null; expiresAt: string | null; providerAccountId: string | null };

async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function exchangeToken(provider: BrokerId, params: URLSearchParams): Promise<TokenResult> {
  if (provider === 'upstox') {
    const code = params.get('code'); if (!code) throw new Error('Authorization code missing.');
    const body = new URLSearchParams({ code, client_id: process.env.UPSTOX_API_KEY!, client_secret: process.env.UPSTOX_API_SECRET!, redirect_uri: process.env.UPSTOX_REDIRECT_URI!, grant_type: 'authorization_code' });
    const response = await fetch('https://api.upstox.com/v2/login/authorization/token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    if (!response.ok) throw new Error('Broker token exchange failed.');
    const data = await response.json() as Record<string, unknown>;
    if (typeof data.access_token !== 'string') throw new Error('Broker access token missing.');
    return { accessToken: data.access_token, refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : null, expiresAt: typeof data.expires_at === 'string' ? data.expires_at : null, providerAccountId: typeof data.user_id === 'string' ? data.user_id : null };
  }
  if (provider === 'zerodha') {
    const requestToken = params.get('request_token'); if (!requestToken) throw new Error('Request token missing.');
    const checksum = await sha256Hex(`${process.env.ZERODHA_API_KEY}${requestToken}${process.env.ZERODHA_API_SECRET}`);
    const body = new URLSearchParams({ api_key: process.env.ZERODHA_API_KEY!, request_token: requestToken, checksum });
    const response = await fetch('https://api.kite.trade/session/token', { method: 'POST', headers: { 'X-Kite-Version': '3', 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    if (!response.ok) throw new Error('Broker token exchange failed.');
    const payload = await response.json() as { data?: Record<string, unknown> };
    const data = payload.data ?? {}; if (typeof data.access_token !== 'string') throw new Error('Broker access token missing.');
    return { accessToken: data.access_token, refreshToken: null, expiresAt: null, providerAccountId: typeof data.user_id === 'string' ? data.user_id : null };
  }
  if (provider === 'angelone') {
    const token = params.get('auth_token'); if (!token) throw new Error('SmartAPI authorization token missing.');
    return { accessToken: token, refreshToken: params.get('refresh_token'), expiresAt: null, providerAccountId: params.get('clientcode') };
  }
  throw new Error('This broker flow is not enabled.');
}

export async function GET(request: Request) {
  const url = new URL(request.url); const providerValue = url.searchParams.get('provider'); const state = url.searchParams.get('state');
  const failure = () => Response.redirect(new URL('/brokers?error=authorization', url.origin), 303);
  if (!providerValue || !brokerIds.includes(providerValue as BrokerId) || !state) return failure();
  const user = await getSiteUser(); if (!user) return failure();

  try {
    const database = getDatabase();
    const saved = await database.prepare("SELECT state FROM oauth_states WHERE state = ? AND user_id = ? AND provider = ? AND consumed_at IS NULL AND expires_at > datetime('now')").bind(state, user.id, providerValue).first();
    if (!saved) return failure();
    const token = await exchangeToken(providerValue as BrokerId, url.searchParams);
    const encryptedAccess = await encryptBrokerSecret(token.accessToken);
    const encryptedRefresh = token.refreshToken ? await encryptBrokerSecret(token.refreshToken) : null;
    const existing = await database.prepare('SELECT id FROM broker_accounts WHERE user_id = ? AND broker = ? ORDER BY created_at LIMIT 1').bind(user.id, providerValue).first<{ id: string }>();
    const accountId = existing?.id ?? crypto.randomUUID();
    const statements = [database.prepare("UPDATE oauth_states SET consumed_at = datetime('now') WHERE state = ?").bind(state)];
    if (existing) statements.push(database.prepare("UPDATE broker_accounts SET provider_account_id = ?, encrypted_access_token = ?, encrypted_refresh_token = ?, token_expires_at = ?, status = 'CONNECTED', updated_at = datetime('now') WHERE id = ?").bind(token.providerAccountId, encryptedAccess, encryptedRefresh, token.expiresAt, accountId));
    else statements.push(database.prepare('INSERT INTO broker_accounts (id, user_id, broker, provider_account_id, encrypted_access_token, encrypted_refresh_token, token_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(accountId, user.id, providerValue, token.providerAccountId, encryptedAccess, encryptedRefresh, token.expiresAt));
    statements.push(database.prepare("INSERT INTO ingestion_jobs (id, user_id, broker_account_id, job_type, status, priority) VALUES (?, ?, ?, 'PORTFOLIO_SYNC', 'DISCOVERED', 10)").bind(crypto.randomUUID(), user.id, accountId));
    await database.batch(statements);
    kickPortfolioWorker(url.origin);
    return Response.redirect(new URL(`/portfolio?connection=success&broker=${providerValue}`, url.origin), 303);
  } catch { return failure(); }
}
