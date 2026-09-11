import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/server/email";
import { sendToGhl } from "@/lib/server/ghl";

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const body = data as Record<string, unknown>;

  const required = ["naam", "email", "telefoon", "bericht"];
  const missing = required.filter((field) => !String(body[field] ?? "").trim());

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: `Ontbrekende velden: ${missing.join(", ")}` }, { status: 400 });
  }

  const contactData = {
    naam: String(body.naam),
    email: String(body.email),
    telefoon: String(body.telefoon ?? ""),
    onderwerp: String(body.onderwerp ?? "Algemene vraag"),
    bericht: String(body.bericht),
  };

  try {
    await sendContactEmail(contactData);
  } catch (error) {
    console.error("Kon contact-e-mail niet versturen:", error);
  }

  try {
    await sendToGhl("contact", contactData);
  } catch (error) {
    console.error("Kon contactaanvraag niet doorsturen naar GoHighLevel:", error);
  }

  return NextResponse.json({ ok: true });
}
