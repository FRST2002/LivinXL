import { NextRequest, NextResponse } from "next/server";
import { berekenVerkoopprijs, type VerandaPrijsInput, type ZijwandKantInput } from "@/lib/server/verandaPrijzen";

const ROOF_MATERIALS = ["polycarbonaat-opaal", "polycarbonaat-helder", "glas-helder"];
const SIDE_POSITIONS = ["voorkant", "links", "rechts"];
const VOORKANT_MATERIALEN = ["geen", "schuifwanden"];
const ZIJWAND_MATERIALEN = ["geen", "polycarbonaat", "aluminium", "schuifwanden"];
const SPIE_MATERIALEN = ["geen", "polycarbonaat", "aluminium", "glas"];

function isValidKant(kant: unknown): kant is ZijwandKantInput {
  if (!kant || typeof kant !== "object") return false;
  const k = kant as Record<string, unknown>;
  return (
    typeof k.materiaal === "string" &&
    ZIJWAND_MATERIALEN.includes(k.materiaal) &&
    typeof k.spie === "string" &&
    SPIE_MATERIALEN.includes(k.spie)
  );
}

function isValidInput(data: unknown): data is VerandaPrijsInput {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  return (
    typeof d.width === "number" &&
    typeof d.depth === "number" &&
    typeof d.roofMaterial === "string" &&
    ROOF_MATERIALS.includes(d.roofMaterial) &&
    typeof d.voorkant === "string" &&
    VOORKANT_MATERIALEN.includes(d.voorkant) &&
    isValidKant(d.zijwandLinks) &&
    isValidKant(d.zijwandRechts) &&
    Array.isArray(d.screens) &&
    d.screens.every((p) => SIDE_POSITIONS.includes(p)) &&
    typeof d.ledverlichting === "boolean"
  );
}

export async function POST(request: NextRequest) {
  const data = await request.json().catch(() => null);

  if (!isValidInput(data)) {
    return NextResponse.json({ error: "Ongeldige configuratie" }, { status: 400 });
  }

  const { prijs, onvolledigeOnderdelen } = berekenVerkoopprijs(data);

  // Only the final sell price ever leaves the server — never the purchase prices.
  return NextResponse.json({ prijs, onvolledigeOnderdelen });
}
