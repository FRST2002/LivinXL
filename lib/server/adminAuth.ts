/**
 * Admin login/session handling for the /admin overview.
 *
 * Credentials (ADMIN_USERNAME/ADMIN_PASSWORD) and the signing secret
 * (ADMIN_SESSION_SECRET) live only in environment variables — never in source, since
 * this file is committed to a public-ish GitHub repo. Uses the Web Crypto API (not
 * Node's `crypto` module) so the same code works both in API routes and in
 * `middleware.ts`, which runs on the Edge runtime.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dagen

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value + "===".slice((value.length + 3) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sign(payload: string): Promise<string | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(signature);
}

/** Checks a submitted username/password against ADMIN_USERNAME/ADMIN_PASSWORD. */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    console.error("ADMIN_USERNAME/ADMIN_PASSWORD ontbreekt — admin-login is uitgeschakeld.");
    return false;
  }
  return constantTimeEqual(username, expectedUser) && constantTimeEqual(password, expectedPass);
}

/** Creates a signed, expiring session token to store in the admin_session cookie. */
export async function createSessionToken(): Promise<string | null> {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS })));
  const signature = await sign(payload);
  if (!signature) return null;
  return `${payload}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await sign(payload);
  if (!expected || !constantTimeEqual(expected, signature)) return false;

  try {
    const json = JSON.parse(decoder.decode(fromBase64Url(payload))) as { exp?: number };
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}
