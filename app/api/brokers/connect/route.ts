import { brokerIds, brokerProviders, type BrokerId } from '@/lib/brokers/providers';
import { getDatabase } from '@/lib/server/database';
import { getSiteUser } from '@/lib/server/site-user';

function authorizationUrl(provider: BrokerId, state: string) {
  switch (provider) {
    case 'upstox': {
      const params = new URLSearchParams({ client_id: process.env.UPSTOX_API_KEY!, redirect_uri: process.env.UPSTOX_REDIRECT_URI!, response_type: 'code', state });
      return `https://api.upstox.com/v2/login/authorization/dialog?${params}`;
    }
    case 'zerodha': {
      const params = new URLSearchParams({ v: '3', api_key: process.env.ZERODHA_API_KEY!, state });
      return `https://kite.zerodha.com/connect/login?${params}`;
    }
    case 'angelone': {
      const params = new URLSearchParams({ api_key: process.env.ANGELONE_API_KEY!, redirect_url: process.env.ANGELONE_REDIRECT_URI!, state });
      return `https://smartapi.angelone.in/publisher-login?${params}`;
    }
    default: return null;
  }
}

export async function GET(request: Request) {
  const providerValue = new URL(request.url).searchParams.get('provider');
  if (!providerValue || !brokerIds.includes(providerValue as BrokerId)) return Response.json({ error: 'Unsupported broker.' }, { status: 400 });
  const provider = brokerProviders.find((item) => item.id === providerValue)!;
  const missing = provider.requiredEnvironment.filter((key) => !process.env[key]?.trim());
  if (missing.length) return Response.json({ error: `${provider.name} connection setup is not complete.`, code: 'PROVIDER_NOT_CONFIGURED' }, { status: 503 });

  const user = await getSiteUser();
  if (!user) return Response.json({ error: 'Sign in is required before connecting a broker.', code: 'SIGN_IN_REQUIRED' }, { status: 401 });
  if (provider.id === 'groww') return Response.json({ error: 'Use the secure Groww access-token connection form.', code: 'USE_TOKEN_FLOW' }, { status: 409 });

  const state = crypto.randomUUID().replaceAll('-', '');
  const database = getDatabase();
  await database.batch([
    database.prepare("INSERT INTO users (id, email) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET email = excluded.email, updated_at = datetime('now')").bind(user.id, user.email),
    database.prepare("INSERT INTO oauth_states (state, user_id, provider, expires_at) VALUES (?, ?, ?, datetime('now', '+10 minutes'))").bind(state, user.id, provider.id),
  ]);
  return Response.json({ authorizationUrl: authorizationUrl(provider.id, state) }, { headers: { 'Cache-Control': 'no-store' } });
}
