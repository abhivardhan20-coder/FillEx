import type { NextResponse } from 'next/server';

import { getDatabase } from '@/lib/server/database';

export const SESSION_COOKIE = 'fillex_session';
export const PASSWORD_ITERATIONS = 210_000;

let authSchemaPromise: Promise<void> | null = null;

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function sqliteDate(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) && email.length <= 254;
}

export function validPassword(password: string) {
  return (
    password.length >= 10 &&
    password.length <= 128 &&
    /[a-z]/u.test(password) &&
    /[A-Z]/u.test(password) &&
    /\d/u.test(password)
  );
}

export async function hashPassword(
  password: string,
  salt = toBase64Url(crypto.getRandomValues(new Uint8Array(16))),
  iterations = PASSWORD_ITERATIONS,
) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64Url(salt), iterations },
    key,
    256,
  );
  return { hash: toBase64Url(new Uint8Array(bits)), salt, iterations };
}

export async function verifyPassword(
  password: string,
  expectedHash: string,
  salt: string,
  iterations: number,
) {
  const actual = fromBase64Url(
    (await hashPassword(password, salt, iterations)).hash,
  );
  const expected = fromBase64Url(expectedHash);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1)
    difference |= actual[index] ^ expected[index];
  return difference === 0;
}

export async function hashSessionToken(token: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(token),
  );
  return toBase64Url(new Uint8Array(digest));
}

export function ensureAuthSchema() {
  if (!authSchemaPromise) {
    const database = getDatabase();
    authSchemaPromise = database
      .batch([
        database.prepare(`CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`),
        database.prepare(`CREATE TABLE IF NOT EXISTS password_accounts (
        user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        password_iterations INTEGER NOT NULL DEFAULT 210000,
        failed_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`),
        database.prepare(
          'CREATE UNIQUE INDEX IF NOT EXISTS idx_password_accounts_email ON password_accounts(email)',
        ),
        database.prepare(`CREATE TABLE IF NOT EXISTS auth_sessions (
        id_hash TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`),
        database.prepare(
          'CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id)',
        ),
        database.prepare(
          'CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at)',
        ),
        database.prepare('PRAGMA optimize'),
      ])
      .then(() => undefined)
      .catch((error) => {
        authSchemaPromise = null;
        throw error;
      });
  }
  return authSchemaPromise;
}

export async function createSession(userId: string, remember = true) {
  await ensureAuthSchema();
  const token = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  const idHash = await hashSessionToken(token);
  const expires = new Date(
    Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000,
  );
  const database = getDatabase();
  await database.batch([
    database.prepare(
      "DELETE FROM auth_sessions WHERE expires_at <= datetime('now')",
    ),
    database
      .prepare(
        'INSERT INTO auth_sessions (id_hash, user_id, expires_at) VALUES (?, ?, ?)',
      )
      .bind(idHash, userId, sqliteDate(expires)),
  ]);
  return { token, expires };
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expires: Date,
) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function trustedMutation(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
