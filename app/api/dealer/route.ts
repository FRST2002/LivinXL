import { NextRequest, NextResponse } from "next/server";
import { sendToGhl } from "@/lib/server/ghl";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const body = data as Record<string, unknown>;

  const required = ["bedrijfsnaam", "contactpersoon", "email", "telefoon", "kvkNummer", "plaats"];
  const missing = required.filter((field) => !String(body[field] ?? "").trim());

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: `Ontbrekende velden: ${missing.join(", ")}` }, { status: 400 });
  }

  const dealerData = {
    bedrijfsnaam: String(body.bedrijfsnaam),
    contactpersoon: String(body.contactpersoon),
    email: String(body.email),
    telefoon: String(body.telefoon),
    kvkNummer: String(body.kvkNummer),
    plaats: String(body.plaats),
    website: String(body.website ?? ""),
    bericht: String(body.bericht ?? ""),
  };

  try {
    await sendToGhl("dealer", dealerData);
  } catch (error) {
    console.error("Kon dealeraanvraag niet doorsturen naar GoHighLevel:", error);
  }

  return NextResponse.json({ ok: true });
}
