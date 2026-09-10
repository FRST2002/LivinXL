/**
 * Inkoopprijzen (MB Aluminium Partners, in EUR, incl. maatwerk, excl. BTW).
 *
 * IMPORTANT: this file must NEVER be imported from a "use client" component —
 * doing so would ship these purchase prices straight into the browser's JS
 * bundle. Only `app/api/prijs/route.ts` (a server-side route handler) may
 * import this module. (The `server-only` npm package would normally enforce
 * this at build time, but it isn't installed in this project and `npm
 * install` can't be run in this environment — so this boundary is enforced
 * by discipline only. Consider adding the `server-only` package later.)
 *
 * Transcribed by hand from supplier price-list screenshots. Spot-check the
 * figures below against the original PDF before relying on this in production —
 * a transcription slip here directly affects real margin.
 */

const MARGE_FACTOR = 2.2; // verkoopprijs = 220% van de inkoopprijs (inkoop x 2,2)

/** Rounds a value to the nearest available breakpoint in a sorted list. */
function nearest(value: number, options: number[]): number {
  return options.reduce((closest, option) =>
    Math.abs(option - value) < Math.abs(closest - value) ? option : closest
  );
}

type Matrix = Record<number, Record<number, number>>;

function lookup(matrix: Matrix, depth: number, width: number): number {
  const depths = Object.keys(matrix).map(Number);
  const nearestDepth = nearest(depth, depths);
  const row = matrix[nearestDepth];
  const widths = Object.keys(row).map(Number);
  const nearestWidth = nearest(width, widths);
  return row[nearestWidth];
}

// --- Frame + dak: MB SOLID, muurbevestiging (breedte in cm als kolom, diepte als rij) ---
const FRAME_DAK_POLYCARBONAAT: Matrix = {
  200: { 306: 725, 406: 890, 506: 1003, 606: 1125, 706: 1395, 806: 1612, 906: 1856, 1006: 2010, 1106: 2198, 1206: 2425 },
  250: { 306: 853, 406: 1050, 506: 1200, 606: 1349, 706: 1584, 806: 1741, 906: 2073, 1006: 2189, 1106: 2446, 1206: 2634 },
  300: { 306: 942, 406: 1151, 506: 1247, 606: 1453, 706: 1624, 806: 1879, 906: 2079, 1006: 2408, 1106: 2687, 1206: 2895 },
  350: { 306: 1103, 406: 1247, 506: 1453, 606: 1624, 706: 1879, 806: 2079, 906: 2459, 1006: 2615, 1106: 2913, 1206: 3140 },
  400: { 306: 1249, 406: 1542, 506: 1590, 606: 1732, 706: 2021, 806: 2240, 906: 2674, 1006: 3067, 1106: 3411, 1206: 3679 },
  450: { 306: 1418, 406: 1677, 506: 2012, 606: 2268, 706: 2646, 806: 2936, 906: 3163, 1006: 3559, 1106: 3954, 1206: 4267 },
  500: { 306: 1569, 406: 1843, 506: 2211, 606: 2501, 706: 2914, 806: 3236, 906: 3669, 1006: 3927, 1106: 4360, 1206: 4707 },
};

const FRAME_DAK_GLAS_HELDER: Matrix = {
  200: { 306: 1117, 406: 1374, 506: 1633, 606: 1845, 706: 2139, 806: 2352, 906: 2671, 1006: 2833, 1106: 3148, 1206: 3386 },
  250: { 306: 1266, 406: 1563, 506: 1713, 606: 1940, 706: 2183, 806: 2508, 906: 2981, 1006: 3245, 1106: 3595, 1206: 3871 },
  300: { 306: 1448, 406: 1752, 506: 2014, 606: 2183, 706: 2559, 806: 2822, 906: 3347, 1006: 3655, 1106: 4044, 1206: 4356 },
  350: { 306: 1789, 406: 2107, 506: 2426, 606: 2744, 706: 3029, 806: 3355, 906: 3778, 1006: 4200, 1106: 4641, 1206: 5002 },
  400: { 306: 2105, 406: 2524, 506: 2830, 606: 3148, 706: 3614, 806: 3824, 906: 4494, 1006: 5012, 1106: 5520, 1206: 5949 },
  450: { 306: 2529, 406: 3127, 506: 3530, 606: 4026, 706: 4850, 806: 5383, 906: 6021, 1006: 6494, 1106: 7135, 1206: 7692 },
  500: { 306: 2843, 406: 3529, 506: 4233, 606: 4847, 706: 5830, 806: 6483, 906: 7248, 1006: 7838, 1106: 8300, 1206: 9127 },
};

// --- Glazen schuifwanden: paneel incl. railsysteem, helder (all-in prijs per paneel) ---
const SCHUIFWAND_PANEEL_PRIJS_PER_STUK = 150;
const SCHUIFWAND_PANEEL_BREEDTE_CM = 100; // rekenvoorbeeld leverancier: 300cm = 3 panelen

// --- Zijwanden: aluminium (dichte panelen), variant 192cm hoogte (12 staanders) ---
const ZIJWAND_ALUMINIUM: Record<number, number> = {
  250: 352,
  300: 420,
  350: 488,
  400: 557,
  500: 693,
};

// --- Screens: zip-screens, kast 11x11 (rij = hoogte cm, kolom = breedte cm) ---
const ZIPSCREEN_11X11: Matrix = {
  150: { 100: 511, 150: 586, 200: 628, 250: 698, 300: 745, 350: 811, 400: 853, 450: 911, 500: 950, 550: 986, 600: 1403 },
  200: { 100: 539, 150: 614, 200: 668, 250: 746, 300: 798, 350: 874, 400: 928, 450: 1005, 500: 1047, 550: 1086, 600: 1510 },
  250: { 100: 570, 150: 673, 200: 739, 250: 833, 300: 898, 350: 995, 400: 1061, 450: 1133, 500: 1175, 550: 1219, 600: 1710 },
  270: { 100: 620, 150: 687, 200: 756, 250: 857, 300: 925, 350: 1020, 400: 1086, 450: 1156, 500: 1199, 550: 1243, 600: 1764 },
  300: { 100: 675, 150: 713, 200: 802, 250: 900, 300: 963, 350: 1049, 400: 1141, 450: 1216, 500: 1284, 550: 1317, 600: 1841 },
};
const ZIPSCREEN_STANDAARD_HOOGTE_CM = 200; // veranda's hebben geen apart hoogte-veld; 200cm is een redelijke aanname

// --- Ledverlichting: LED-strip in de ligger + 1 transformator ---
const LED_STRIP_PRIJS_PER_METER = 36;
const LED_TRANSFORMATOR_PRIJS = 57;
const LED_MINIMALE_LENGTE_M = 4;

export type RoofMaterialKey = "polycarbonaat-opaal" | "polycarbonaat-helder" | "glas-helder";
export type SidePositionKey = "voorkant" | "links" | "rechts";
export type ZijwandPositionKey = "links" | "rechts";

export interface VerandaPrijsInput {
  width: number; // cm
  depth: number; // cm
  roofMaterial: RoofMaterialKey;
  schuifwanden: SidePositionKey[];
  zijwanden: ZijwandPositionKey[];
  screens: SidePositionKey[];
  ledverlichting: boolean;
}

/** Span (in cm) that a side element covers, depending on which side it's on. */
function spanForPosition(position: SidePositionKey | ZijwandPositionKey, width: number, depth: number): number {
  return position === "voorkant" ? width : depth;
}

/**
 * Calculates the sell price (220% van de inkoopprijs) for a veranda configuration.
 * This is the only function that should ever touch the raw purchase prices above.
 */
export function berekenVerkoopprijs(input: VerandaPrijsInput): number {
  let inkoop = 0;

  // Frame + dak. De leverancier prijst polycarbonaat helder/opaal gelijk; om toch
  // enig visueel prijsverschil te tonen (helder = iets duurder materiaal) rekenen
  // we een kleine, indicatieve 5% opslag voor de heldere variant.
  const frameDakMatrix = input.roofMaterial === "glas-helder" ? FRAME_DAK_GLAS_HELDER : FRAME_DAK_POLYCARBONAAT;
  let frameDakPrijs = lookup(frameDakMatrix, input.depth, input.width);
  if (input.roofMaterial === "polycarbonaat-helder") frameDakPrijs *= 1.05;
  inkoop += frameDakPrijs;

  // Glazen schuifwanden: aantal panelen van ~1m breed, per gekozen positie.
  for (const positie of input.schuifwanden) {
    const span = spanForPosition(positie, input.width, input.depth);
    const panelen = Math.max(1, Math.ceil(span / SCHUIFWAND_PANEEL_BREEDTE_CM));
    inkoop += panelen * SCHUIFWAND_PANEEL_PRIJS_PER_STUK;
  }

  // Zijwanden: dichte aluminium panelen, geprijsd op de diepte die ze overspannen.
  for (const positie of input.zijwanden) {
    const span = spanForPosition(positie, input.width, input.depth);
    const depths = Object.keys(ZIJWAND_ALUMINIUM).map(Number);
    inkoop += ZIJWAND_ALUMINIUM[nearest(span, depths)];
  }

  // Screens: zip-screens, vaste (aangenomen) hoogte van 200cm.
  for (const positie of input.screens) {
    const span = spanForPosition(positie, input.width, input.depth);
    inkoop += lookup(ZIPSCREEN_11X11, ZIPSCREEN_STANDAARD_HOOGTE_CM, span);
  }

  // Ledverlichting: strip over de voorligger (= breedte) + 1 transformator.
  if (input.ledverlichting) {
    const lengteM = Math.max(LED_MINIMALE_LENGTE_M, input.width / 100);
    inkoop += lengteM * LED_STRIP_PRIJS_PER_METER + LED_TRANSFORMATOR_PRIJS;
  }

  const verkoop = inkoop * MARGE_FACTOR;
  return Math.round(verkoop / 50) * 50;
}
