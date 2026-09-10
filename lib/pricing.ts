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
  { id: "antraciet", label: "Antraciet", ral: "RAL 7016", hex: "#26292E" },
  { id: "wit", label: "Signaalwit", ral: "RAL 9010", hex: "#F1EEE7" },
  { id: "koper-bruin", label: "Koperbruin", ral: "RAL 8019", hex: "#4A3A31" },
  { id: "zwart", label: "Dieprzwart", ral: "RAL 9005", hex: "#0B0C0E" },
];

export type SidePosition = "voorkant" | "links" | "rechts";
export type ZijwandPosition = "links" | "rechts";

export interface PositionOption<T extends string> {
  id: T;
  label: string;
}

export const SCHUIFWAND_POSITIONS: PositionOption<SidePosition>[] = [
  { id: "voorkant", label: "Voorkant" },
  { id: "links", label: "Linkerzijkant" },
  { id: "rechts", label: "Rechterzijkant" },
];

export const ZIJWAND_POSITIONS: PositionOption<ZijwandPosition>[] = [
  { id: "links", label: "Linkerzijwand" },
  { id: "rechts", label: "Rechterzijwand" },
];

export const SCREEN_POSITIONS: PositionOption<SidePosition>[] = [
  { id: "voorkant", label: "Voorkant" },
  { id: "links", label: "Linkerzijkant" },
  { id: "rechts", label: "Rechterzijkant" },
];

export interface ConfiguratorState {
  width: number; // cm, 300 - 700
  depth: number; // cm, 250 - 500
  roofMaterial: RoofMaterial;
  frameColor: string;
  schuifwanden: SidePosition[];
  zijwanden: ZijwandPosition[];
  ledverlichting: boolean;
  screens: SidePosition[];
}

export const CONFIGURATOR_DEFAULTS: ConfiguratorState = {
  width: 400,
  depth: 300,
  roofMaterial: "polycarbonaat-opaal",
  frameColor: "antraciet",
  schuifwanden: [],
  zijwanden: [],
  ledverlichting: true,
  screens: [],
};

export const LIMITS = {
  width: { min: 300, max: 700, step: 10 },
  depth: { min: 250, max: 500, step: 10 },
};

export function describeConfiguration(state: ConfiguratorState): string[] {
  const color = FRAME_COLORS.find((c) => c.id === state.frameColor);
  const roof = ROOF_MATERIALS.find((r) => r.id === state.roofMaterial);
  const lines: string[] = [
    `Afmetingen: ${state.width} x ${state.depth} cm`,
    `Dak: ${roof ? roof.label : state.roofMaterial}`,
    `Kleur frame: ${color ? `${color.label} (${color.ral})` : state.frameColor}`,
  ];
  if (state.schuifwanden.length > 0) {
    const labels = SCHUIFWAND_POSITIONS.filter((p) => state.schuifwanden.includes(p.id)).map((p) => p.label);
    lines.push(`Glazen schuifwanden: ${labels.join(", ")}`);
  }
  if (state.zijwanden.length > 0) {
    const labels = ZIJWAND_POSITIONS.filter((p) => state.zijwanden.includes(p.id)).map((p) => p.label);
    lines.push(`Zijwanden: ${labels.join(", ")}`);
  }
  if (state.screens.length > 0) {
    const labels = SCREEN_POSITIONS.filter((p) => state.screens.includes(p.id)).map((p) => p.label);
    lines.push(`Screens: ${labels.join(", ")}`);
  }
  if (state.ledverlichting) lines.push("Ledverlichting: ja");
  return lines;
}

export interface FinancingSelection {
  monthlyPayment: number;
  termMonths: number;
}

export function configuratorStateToQuery(
  state: ConfiguratorState,
  price: number,
  financing?: FinancingSelection
): string {
  const params = new URLSearchParams();
  params.set("prijs", String(price));
  params.set("samenvatting", describeConfiguration(state).join(" | "));
  if (financing) {
    params.set("maandbedrag", String(Math.round(financing.monthlyPayment)));
    params.set("looptijd", String(financing.termMonths));
  }
  return params.toString();
}
