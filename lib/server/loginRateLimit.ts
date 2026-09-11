import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Simple brute-force protection for /api/admin/login: after MAX_ATTEMPTS failed
 * logins from the same IP within WINDOW_MINUTES, further attempts are rejected
 * (429) without even checking the password. Backed by Postgres (not in-memory)
 * because serverless function instances don't reliably share memory across
 * invocations. Fails open (allows the login attempt) if the database is
 * unreachable — an infra hiccup should never permanently lock out the admin,
 * and the actual credential check still stands regardless.
 */
const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

let sql: NeonQueryFunction<false, false> | null = null;
function getSql(): NeonQueryFunction<false, false> | null {
  if (!CONNECTION_STRING) return null;
  if (!sql) sql = neon(CONNECTION_STRING);
  return sql;
}

let schemaReady: Promise<unknown> | null = null;
function ensureSchema(client: NeonQueryFunction<false, false>): Promise<unknown> {
  if (!schemaReady) {
    schemaReady = client`
      CREATE TABLE IF NOT EXISTS login_attempts (
        ip TEXT PRIMARY KEY,
        failed_count INTEGER NOT NULL DEFAULT 0,
        last_attempt TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  }
  return schemaReady;
}

export interface RateLimitResult {
  allowed: boolean;
  minutesRemaining?: number;
}

export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  const client = getSql();
  if (!client) return { allowed: true };
  await ensureSchema(client);

  const rows = await client`SELECT failed_count, last_attempt FROM login_attempts WHERE ip = ${ip}`;
  if (rows.length === 0) return { allowed: true };

  const row = rows[0] as { failed_count: number; last_attempt: string | Date };
  const lastAttemptMs = new Date(row.last_attempt).getTime();
  const minutesSince = (Date.now() - lastAttemptMs) / 60000;

  if (minutesSince > WINDOW_MINUTES) {
    await client`DELETE FROM login_attempts WHERE ip = ${ip}`;
    return { allowed: true };
  }

  if (Number(row.failed_count) >= MAX_ATTEMPTS) {
    return { allowed: false, minutesRemaining: Math.max(1, Math.ceil(WINDOW_MINUTES - minutesSince)) };
  }

  return { allowed: true };
}

export async function recordFailedLogin(ip: string): Promise<void> {
  const client = getSql();
  if (!client) return;
  await ensureSchema(client);
  await client`
    INSERT INTO login_attempts (ip, failed_count, last_attempt)
    VALUES (${ip}, 1, now())
    ON CONFLICT (ip) DO UPDATE SET
      failed_count = login_attempts.failed_count + 1,
      last_attempt = now()
  `;
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const client = getSql();
  if (!client) return;
  await ensureSchema(client);
  await client`DELETE FROM login_attempts WHERE ip = ${ip}`;
}
