import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/lib/server/database';
import {
  clearSessionCookie,
  ensureAuthSchema,
  hashSessionToken,
  SESSION_COOKIE,
  trustedMutation,
} from '@/lib/server/password-auth';

export async function POST(request: Request) {
  if (!trustedMutation(request))
    return NextResponse.json(
      { error: 'Request origin was not accepted.' },
      { status: 403 },
    );
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    await ensureAuthSchema();
    await getDatabase()
      .prepare('DELETE FROM auth_sessions WHERE id_hash = ?')
      .bind(await hashSessionToken(token))
      .run();
  }
  const response = NextResponse.json({ redirectTo: '/' });
  clearSessionCookie(response);
  return response;
}
