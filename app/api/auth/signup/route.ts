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
  validPassword,
} from '@/lib/server/password-auth';

type SignupBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

async function signup(request: Request) {
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

  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json(
      { error: 'Enter your account details and try again.' },
      { status: 400 },
    );
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = normalizeEmail(
    typeof body.email === 'string' ? body.email : '',
  );
  const password = typeof body.password === 'string' ? body.password : '';
  const confirmPassword =
    typeof body.confirmPassword === 'string' ? body.confirmPassword : '';
  if (name.length < 2 || name.length > 80)
    return NextResponse.json(
      { error: 'Enter your full name.' },
      { status: 400 },
    );
  if (!validEmail(email))
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    );
  if (!validPassword(password))
    return NextResponse.json(
      {
        error: 'Use 10–128 characters with uppercase, lowercase, and a number.',
      },
      { status: 400 },
    );
  if (password !== confirmPassword)
    return NextResponse.json(
      { error: 'Passwords do not match.' },
      { status: 400 },
    );

  await ensureAuthSchema();
  const database = getDatabase();
  const existing = await database
    .prepare('SELECT user_id FROM password_accounts WHERE email = ?')
    .bind(email)
    .first();
  if (existing)
    return NextResponse.json(
      { error: 'An account already exists for this email. Sign in instead.' },
      { status: 409 },
    );

  const userId = `user_${crypto.randomUUID()}`;
  const passwordRecord = await hashPassword(password);
  try {
    await database.batch([
      database
        .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
        .bind(userId, email),
      database
        .prepare(
          'INSERT INTO password_accounts (user_id, email, display_name, password_hash, password_salt, password_iterations) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .bind(
          userId,
          email,
          name,
          passwordRecord.hash,
          passwordRecord.salt,
          passwordRecord.iterations,
        ),
    ]);
  } catch (error) {
    if (error instanceof Error && /unique/iu.test(error.message))
      return NextResponse.json(
        { error: 'An account already exists for this email. Sign in instead.' },
        { status: 409 },
      );
    throw error;
  }

  const session = await createSession(userId, true);
  const response = NextResponse.json(
    { redirectTo: '/brokers' },
    { status: 201 },
  );
  setSessionCookie(response, session.token, session.expires);
  return response;
}

export async function POST(request: Request) {
  try {
    return await signup(request);
  } catch (error) {
    console.error('FillEx signup failed.', error);
    return NextResponse.json(
      {
        error: 'Account creation is temporarily unavailable. Please try again.',
      },
      { status: 500 },
    );
  }
}
