import { NextRequest, NextResponse } from "next/server";
import { berekenVerkoopprijs, type VerandaPrijsInput } from "@/lib/server/verandaPrijzen";

const ROOF_MATERIALS = ["polycarbonaat-opaal", "polycarbonaat-helder", "glas-helder"];
const SIDE_POSITIONS = ["voorkant", "links", "rechts"];
const ZIJWAND_POSITIONS = ["links", "rechts"];

function isValidInput(data: unknown): data is VerandaPrijsInput {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  return (
    typeof d.width === "number" &&
    typeof d.depth === "number" &&
    typeof d.roofMaterial === "string" &&
    ROOF_MATERIALS.includes(d.roofMaterial) &&
    Array.isArray(d.schuifwanden) &&
    d.schuifwanden.every((p) => SIDE_POSITIONS.includes(p)) &&
    Array.isArray(d.zijwanden) &&
    d.zijwanden.every((p) => ZIJWAND_POSITIONS.includes(p)) &&
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

  const prijs = berekenVerkoopprijs(data);

  // Only the final sell price ever leaves the server — never the purchase prices.
  return NextResponse.json({ prijs });
}
