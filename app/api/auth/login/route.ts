import { NextResponse } from 'next/server';

import { getDatabase } from '@/lib/server/database';
import {
  createSession,
  ensureAuthSchema,
  hashPassword,
  normalizeEmail,
  setSessionCookie,
  trustedMutation,
  validEmail,
  verifyPassword,
} from '@/lib/server/password-auth';

type LoginBody = { email?: unknown; password?: unknown; remember?: unknown };
type PasswordAccount = {
  userId: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  failedAttempts: number;
  lockedUntil: string | null;
};

export async function POST(request: Request) {
  if (!trustedMutation(request))
    return NextResponse.json(
      { error: 'Request origin was not accepted.' },
      { status: 403 },
    );
  if (Number(request.headers.get('content-length') ?? 0) > 8_192)
    return NextResponse.json(
      { error: 'Request is too large.' },
      { status: 413 },
    );

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { error: 'Enter your email and password.' },
      { status: 400 },
    );
  }
  const email = normalizeEmail(
    typeof body.email === 'string' ? body.email : '',
  );
  const password = typeof body.password === 'string' ? body.password : '';
  if (!validEmail(email) || !password)
    return NextResponse.json(
      { error: 'Enter your email and password.' },
      { status: 400 },
    );

  await ensureAuthSchema();
  const database = getDatabase();
  const account = await database
    .prepare(`SELECT user_id AS userId, email, password_hash AS passwordHash, password_salt AS passwordSalt,
    password_iterations AS passwordIterations, failed_attempts AS failedAttempts, locked_until AS lockedUntil
    FROM password_accounts WHERE email = ?`)
    .bind(email)
    .first<PasswordAccount>();

  if (
    account?.lockedUntil &&
    new Date(`${account.lockedUntil.replace(' ', 'T')}Z`).getTime() > Date.now()
  )
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 },
    );

  let passwordMatches = false;
  if (account) {
    passwordMatches = await verifyPassword(
      password,
      account.passwordHash,
      account.passwordSalt,
      account.passwordIterations,
    );
  } else {
    await hashPassword(password, 'RmlsbEV4QXV0aER1bW15U2FsdA', 210_000);
  }

  if (!account || !passwordMatches) {
    if (account) {
      const attempts = account.failedAttempts + 1;
      const lockedUntil =
        attempts >= 5
          ? new Date(Date.now() + 15 * 60 * 1000)
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ')
          : null;
      await database
        .prepare(
          "UPDATE password_accounts SET failed_attempts = ?, locked_until = ?, updated_at = datetime('now') WHERE user_id = ?",
        )
        .bind(attempts >= 5 ? 0 : attempts, lockedUntil, account.userId)
        .run();
    }
    return NextResponse.json(
      { error: 'Email or password is incorrect.' },
      { status: 401 },
    );
  }

  await database
    .prepare(
      "UPDATE password_accounts SET failed_attempts = 0, locked_until = NULL, updated_at = datetime('now') WHERE user_id = ?",
    )
    .bind(account.userId)
    .run();
  const session = await createSession(account.userId, body.remember !== false);
  const response = NextResponse.json({ redirectTo: '/brokers' });
  setSessionCookie(response, session.token, session.expires);
  return response;
}
