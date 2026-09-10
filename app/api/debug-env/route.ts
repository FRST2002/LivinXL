import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — reveals only presence/prefix, never the real
// key, to confirm whether RESEND_API_KEY actually reaches the runtime.
// Remove this file once the Resend issue is resolved.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  return NextResponse.json({
    hasResendKey: Boolean(key),
    keyLength: key?.length ?? 0,
    keyPrefix: key ? key.slice(0, 6) : null,
    fromEmail: process.env.RESEND_FROM_EMAIL ?? null,
    toEmail: process.env.RESEND_TO_EMAIL ?? null,
    testDebugVar: process.env.TEST_DEBUG_VAR ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
