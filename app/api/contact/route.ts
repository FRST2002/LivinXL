import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const required = ["naam", "email", "bericht"];
  const missing = required.filter((field) => !String((data as Record<string, unknown>)[field] ?? "").trim());

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: `Ontbrekende velden: ${missing.join(", ")}` }, { status: 400 });
  }

  // In een productieomgeving zou het bericht hier worden doorgezet naar het contactteam.
  return NextResponse.json({ ok: true });
}
