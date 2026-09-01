export type GrowwToken = { accessToken: string; expiresAt: string | null };

async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function generateGrowwAccessToken(): Promise<GrowwToken> {
  const apiKey = process.env.GROWW_API_KEY?.trim();
  const apiSecret = process.env.GROWW_API_SECRET?.trim();
  if (!apiKey || !apiSecret) throw new Error('Groww API credentials are not configured.');
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  const checksum = await sha256Hex(`${apiSecret}${timestamp}`);
  const response = await fetch('https://api.groww.in/v1/token/api/access', {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key_type: 'approval', checksum, timestamp }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Groww access-token generation failed.');
  const raw = await response.json() as { token?: unknown; expiry?: unknown; payload?: { token?: unknown; expiry?: unknown } };
  const accessToken = typeof raw.token === 'string' ? raw.token : typeof raw.payload?.token === 'string' ? raw.payload.token : null;
  const expiresAt = typeof raw.expiry === 'string' ? raw.expiry : typeof raw.payload?.expiry === 'string' ? raw.payload.expiry : null;
  if (!accessToken) throw new Error('Groww access token was not returned.');
  return { accessToken, expiresAt };
}
