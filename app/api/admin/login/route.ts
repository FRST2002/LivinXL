import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyCredentials } from "@/lib/server/adminAuth";
import { checkLoginRateLimit, clearLoginAttempts, recordFailedLogin } from "@/lib/server/loginRateLimit";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimit = await checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: `Te veel mislukte inlogpogingen. Probeer het over ${rateLimit.minutesRemaining} minuten opnieuw.`,
      },
      { status: 429 }
    );
  }

  const data = await request.json().catch(() => null);
  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const { username, password } = data as Record<string, unknown>;
  if (typeof username !== "string" || typeof password !== "string" || !verifyCredentials(username, password)) {
    await recordFailedLogin(ip);
    return NextResponse.json({ ok: false, error: "Onjuiste gebruikersnaam of wachtwoord" }, { status: 401 });
  }

  await clearLoginAttempts(ip);

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Server is niet correct geconfigureerd" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
  });
  return response;
}
