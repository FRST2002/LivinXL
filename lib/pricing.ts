export const PRICE_MIN = 7000;
export const PRICE_MAX = 12000;

export type RoofMaterial = "polycarbonaat-opaal" | "polycarbonaat-helder" | "glas-helder";

export interface RoofMaterialOption {
  id: RoofMaterial;
  label: string;
  description: string;
  image: string;
}

export const ROOF_MATERIALS: RoofMaterialOption[] = [
  {
    id: "polycarbonaat-opaal",
    label: "Polycarbonaat opaal",
    description: "Melkwit en lichtdempend, voor een zachte lichtinval en meer privacy",
    image: "/dakopties/polycarbonaat-opaal.png",
  },
  {
    id: "polycarbonaat-helder",
    label: "Polycarbonaat helder",
    description: "Transparant en lichtgewicht, met een gunstige prijs-kwaliteitverhouding",
    image: "/dakopties/polycarbonaat-helder.png",
  },
  {
    id: "glas-helder",
    label: "Glas helder",
    description: "Volledig transparant glazen dak voor maximale lichtinval",
    image: "/dakopties/glas-helder.png",
  },
];

export interface FrameColorOption {
  id: string;
  label: string;
  ral: string;
  hex: string;
}

export const FRAME_COLORS: FrameColorOption[] = [
  { id: "wit", label: "Wit", ral: "RAL 9016", hex: "#F1F0EA" },
  { id: "grijs-metallic", label: "Grijs metallic", ral: "RAL 9007", hex: "#8F8F8F" },
  { id: "antraciet", label: "Antraciet", ral: "RAL 7016", hex: "#383E42" },
  { id: "zwart", label: "Zwart", ral: "RAL 9005", hex: "#0A0A0A" },
];

export type SidePosition = "voorkant" | "links" | "rechts";

export interface PositionOption<T extends string> {
  id: T;
  label: string;
}

export const SCREEN_POSITIONS: PositionOption<SidePosition>[] = [
  { id: "voorkant", label: "Voorkant" },
  { id: "links", label: "Linkerzijkant" },
  { id: "rechts", label: "Rechterzijkant" },
];

export interface MateriaalOption<T extends string> {
  id: T;
  label: string;
  description: string;
  image: string;
}

/** Materiaalkeuze voor de voorkant: alleen open of (over de volle breedte) schuifwanden. */
export type VoorkantMateriaal = "geen" | "schuifwanden";

export const VOORKANT_MATERIALEN: MateriaalOption<VoorkantMateriaal>[] = [
  {
    id: "geen",
    label: "Open",
    description: "Volledig open voorzijde, geen wand",
    image: "/wandopties/voorkant-geen.jpg",
  },
  {
    id: "schuifwanden",
    label: "Glazen schuifwanden",
    description: "Schuifbare glazen wanden over de volledige breedte",
    image: "/wandopties/schuifwanden.png",
  },
];

/** Materiaalkeuze voor een zijwand (links of rechts). */
export type ZijwandMateriaal = "geen" | "polycarbonaat" | "aluminium" | "schuifwanden";

export const ZIJWAND_MATERIALEN: MateriaalOption<ZijwandMateriaal>[] = [
  {
    id: "geen",
    label: "Open",
    description: "Volledig open zijkant, geen wand",
    image: "/wandopties/geen.jpg",
  },
  {
    id: "polycarbonaat",
    label: "Polycarbonaat",
    description: "Lichtdoorlatend, dicht paneel",
    image: "/wandopties/polycarbonaat.jpg",
  },
  {
    id: "aluminium",
    label: "Aluminium",
    description: "Volledig dichte aluminium wand, zelfde kleur als het frame",
    image: "/wandopties/aluminium.jpg",
  },
  {
    id: "schuifwanden",
    label: "Glazen schuifwanden",
    description: "Schuifbare glazen wanden, volledig open te zetten",
    image: "/wandopties/zijwand-schuifwanden.jpg",
  },
];

/** Materiaalkeuze voor de spie: het gevelstuk boven een zijwand, onder het aflopende dak. */
export type SpieMateriaal = "geen" | "polycarbonaat" | "aluminium" | "glas";

export const SPIE_MATERIALEN: MateriaalOption<SpieMateriaal>[] = [
  {
    id: "geen",
    label: "Geen",
    description: "Geen invulling boven de zijwand",
    image: "/wandopties/geen.jpg",
  },
  {
    id: "polycarbonaat",
    label: "Polycarbonaat",
    description: "Lichtdoorlatend paneel in de gevelspie",
    image: "/wandopties/spie-polycarbonaat.jpg",
  },
  {
    id: "aluminium",
    label: "Aluminium",
    description: "Dichte aluminium spie, zelfde kleur als het frame",
    image: "/wandopties/aluminium.jpg",
  },
  {
    id: "glas",
    label: "Glas",
    description: "Heldere glazen spie voor maximale lichtinval",
    image: "/wandopties/spie-glas.jpg",
  },
];

export interface ZijwandKant {
  materiaal: ZijwandMateriaal;
  spie: SpieMateriaal;
}

export interface ConfiguratorState {
  width: number; // cm, 300 - 700
  depth: number; // cm, 250 - 500
  roofMaterial: RoofMaterial;
  frameColor: string;
  voorkant: VoorkantMateriaal;
  zijwandLinks: ZijwandKant;
  zijwandRechts: ZijwandKant;
  ledverlichting: boolean;
  screens: SidePosition[];
}

export const CONFIGURATOR_DEFAULTS: ConfiguratorState = {
  width: 400,
  depth: 300,
  roofMaterial: "polycarbonaat-opaal",
  frameColor: "antraciet",
  voorkant: "geen",
  zijwandLinks: { materiaal: "geen", spie: "geen" },
  zijwandRechts: { materiaal: "geen", spie: "geen" },
  ledverlichting: true,
  screens: [],
};

export const LIMITS = {
  width: { min: 300, max: 700, step: 10 },
  depth: { min: 250, max: 500, step: 10 },
};

function describeKant(kant: ZijwandKant): string | null {
  if (kant.materiaal === "geen" && kant.spie === "geen") return null;
  const parts: string[] = [];
  if (kant.materiaal !== "geen") {
    parts.push(ZIJWAND_MATERIALEN.find((m) => m.id === kant.materiaal)?.label ?? kant.materiaal);
  }
  if (kant.spie !== "geen") {
    parts.push(`spie: ${SPIE_MATERIALEN.find((m) => m.id === kant.spie)?.label ?? kant.spie}`);
  }
  return parts.join(", ");
}

export function describeConfiguration(state: ConfiguratorState): string[] {
  const color = FRAME_COLORS.find((c) => c.id === state.frameColor);
  const roof = ROOF_MATERIALS.find((r) => r.id === state.roofMaterial);
  const lines: string[] = [
    `Afmetingen: ${state.width} x ${state.depth} cm`,
    `Dak: ${roof ? roof.label : state.roofMaterial}`,
    `Kleur frame: ${color ? `${color.label} (${color.ral})` : state.frameColor}`,
  ];
  if (state.voorkant === "schuifwanden") {
    lines.push("Voorkant: glazen schuifwanden");
  }
  const linksLabel = describeKant(state.zijwandLinks);
  if (linksLabel) lines.push(`Linkerzijde: ${linksLabel}`);
  const rechtsLabel = describeKant(state.zijwandRechts);
  if (rechtsLabel) lines.push(`Rechterzijde: ${rechtsLabel}`);
  if (state.screens.length > 0) {
    const labels = SCREEN_POSITIONS.filter((p) => state.screens.includes(p.id)).map((p) => p.label);
    lines.push(`Screens: ${labels.join(", ")}`);
  }
  if (state.ledverlichting) lines.push("Ledverlichting: ja");
  return lines;
}

export function configuratorStateToQuery(state: ConfiguratorState, price: number): string {
  const params = new URLSearchParams();
  params.set("prijs", String(price));
  params.set("breedte", String(state.width));
  params.set("diepte", String(state.depth));
  params.set("samenvatting", describeConfiguration(state).join(" | "));
  return params.toString();
}
