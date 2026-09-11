import { NextRequest, NextResponse } from "next/server";
import { sendOfferteEmail } from "@/lib/server/email";
import { saveOfferte } from "@/lib/server/db";

function genereerOfferteNummer(): string {
  const jaar = new Date().getFullYear();
  const volgnummer = Math.floor(1000 + Math.random() * 9000);
  return `LX-${jaar}-${volgnummer}`;
}

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const body = data as Record<string, unknown>;

  const required = ["naam", "email", "telefoon", "postcode", "plaats"];
  const missing = required.filter((field) => !String(body[field] ?? "").trim());

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: `Ontbrekende velden: ${missing.join(", ")}` }, { status: 400 });
  }

  const offerteNummer = genereerOfferteNummer();
  const datum = new Date().toLocaleDateString("nl-NL", { day: "2-digit", month: "long", year: "numeric" });

  const configuratieLines = Array.isArray(body.configuratieLines)
    ? body.configuratieLines.filter((line): line is string => typeof line === "string")
    : [];
  const prijs = typeof body.prijs === "number" ? body.prijs : null;

  const offerteData = {
    offerteNummer,
    datum,
    naam: String(body.naam),
    email: String(body.email),
    telefoon: String(body.telefoon),
    adres: String(body.adres ?? ""),
    postcode: String(body.postcode),
    plaats: String(body.plaats),
    model: String(body.model ?? ""),
    periode: String(body.periode ?? ""),
    opmerkingen: String(body.opmerkingen ?? ""),
    configuratieLines,
    prijs,
  };

  try {
    await sendOfferteEmail(offerteData);
  } catch (error) {
    // Never block the customer's offerte because the internal notification failed.
    console.error("Kon offerte-e-mail niet versturen:", error);
  }

  try {
    await saveOfferte(offerteData);
  } catch (error) {
    // Same principle: a broken admin-overview save should never fail the customer's request.
    console.error("Kon offerte niet opslaan voor het admin-overzicht:", error);
  }

  return NextResponse.json({ ok: true, offerteNummer, datum });
}
