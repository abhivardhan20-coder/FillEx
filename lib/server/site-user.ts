import { cookies } from 'next/headers';

import { getDatabase } from '@/lib/server/database';
import {
  ensureAuthSchema,
  hashSessionToken,
  SESSION_COOKIE,
} from '@/lib/server/password-auth';

export type SiteUser = { id: string; email: string; name: string };

export async function getSiteUser(): Promise<SiteUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    await ensureAuthSchema();
    return await getDatabase()
      .prepare(`SELECT sessions.user_id AS id, accounts.email, accounts.display_name AS name
      FROM auth_sessions AS sessions
      INNER JOIN password_accounts AS accounts ON accounts.user_id = sessions.user_id
      WHERE sessions.id_hash = ? AND sessions.expires_at > datetime('now')`)
      .bind(await hashSessionToken(token))
      .first<SiteUser>();
  } catch {
    return null;
  }
}
