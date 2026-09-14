"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CONFIGURATOR_DEFAULTS,
  ConfiguratorState,
  FRAME_COLORS,
  LIMITS,
  MateriaalOption,
  PositionOption,
  ROOF_MATERIALS,
  SCREEN_POSITIONS,
  SPIE_MATERIALEN,
  SpieMateriaal,
  VOORKANT_MATERIALEN,
  ZIJWAND_MATERIALEN,
  ZijwandKant,
  ZijwandMateriaal,
  configuratorStateToQuery,
  describeConfiguration,
} from "@/lib/pricing";

/** Bij het kiezen van een zijwandmateriaal is "geen" spie geen optie meer; dit is het
 * sensibele startpunt (zelfde materiaal als de wand, of aluminium bij schuifwanden). */
const DEFAULT_SPIE_VOOR_MATERIAAL: Record<Exclude<ZijwandMateriaal, "geen">, SpieMateriaal> = {
  polycarbonaat: "polycarbonaat",
  aluminium: "aluminium",
  schuifwanden: "aluminium",
};

/** "Geen" is geen geldige spie-keuze zodra er een zijwandmateriaal gekozen is. */
function spieOpties(zijwandMateriaal: ZijwandMateriaal): MateriaalOption<SpieMateriaal>[] {
  if (zijwandMateriaal === "geen") return SPIE_MATERIALEN;
  return SPIE_MATERIALEN.filter((optie) => optie.id !== "geen");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
import { formatCurrency } from "@/lib/finance";
import { IconBulb, IconLayers, IconLock, IconRoof, IconRuler, IconScreen, IconWall } from "@/components/icons";

/** Debounced price lookup: the actual purchase-price data lives server-side only (see app/api/prijs). */
function usePrijs(state: ConfiguratorState) {
  const [prijs, setPrijs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [onvolledigeOnderdelen, setOnvolledigeOnderdelen] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Intentional: show "recalculating" immediately on every config change, before
    // the debounced fetch below even starts — not a derivable/external sync case.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const timeout = setTimeout(() => {
      fetch("/api/prijs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          width: state.width,
          depth: state.depth,
          roofMaterial: state.roofMaterial,
          voorkant: state.voorkant,
          zijwandLinks: state.zijwandLinks,
          zijwandRechts: state.zijwandRechts,
          screens: state.screens,
          ledverlichting: state.ledverlichting,
        }),
      })
        .then((res) => res.json())
        .then((data: { prijs?: number; onvolledigeOnderdelen?: string[] }) => {
          if (!cancelled && typeof data.prijs === "number") {
            setPrijs(data.prijs);
            setOnvolledigeOnderdelen(data.onvolledigeOnderdelen ?? []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [
    state.width,
    state.depth,
    state.roofMaterial,
    state.voorkant,
    state.zijwandLinks,
    state.zijwandRechts,
    state.screens,
    state.ledverlichting,
  ]);

  return { prijs, loading, onvolledigeOnderdelen };
}

/** Visuele materiaalkeuze: foto + label per optie, zoals bij het dakmateriaal hierboven. */
function MateriaalPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: MateriaalOption<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`overflow-hidden rounded-xl border text-left transition-colors ${
              active ? "border-copper bg-copper-50" : "border-anthracite-700/12 hover:border-anthracite-700/30"
            }`}
          >
            <div className="relative h-20 w-full">
              <Image src={option.image} alt={option.label} fill className="object-cover" />
            </div>
            <div className="p-2.5">
              <span className="block text-xs font-semibold text-anthracite-700">{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PositionToggles<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T[];
  options: PositionOption<T>[];
  onChange: (value: T[]) => void;
}) {
  function toggle(id: T) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "border-copper bg-copper-50 text-copper-600"
                : "border-anthracite-700/15 text-anthracite-500 hover:border-anthracite-700/30"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// One decision per step (instead of one long scrolling page) so step-level
// drop-off is visible in analytics later — same reasoning as the offerte
// wizard. Every field already has a sensible default (CONFIGURATOR_DEFAULTS),
// so there's nothing to validate before advancing — "Volgende" always works.
const CONFIGURATOR_STEPS: { title: string; description?: string; icon: typeof IconRuler | null }[] = [
  { title: "Afmetingen", icon: IconRuler },
  { title: "Dakmateriaal", icon: IconRoof },
  { title: "Kleur aluminium frame", icon: null },
  { title: "Voorkant", description: "Open, of glazen schuifwanden over de volledige breedte", icon: IconLayers },
  { title: "Linkerzijde — zijwand", icon: IconWall },
  { title: "Linkerzijde — spie", description: "Het gevelstuk onder het dak, boven de zijwand", icon: IconWall },
  { title: "Rechterzijde — zijwand", icon: IconWall },
  { title: "Rechterzijde — spie", description: "Het gevelstuk onder het dak, boven de zijwand", icon: IconWall },
  { title: "Screens", description: "Elektrische zonwering / windvast doek", icon: IconScreen },
  { title: "Ledverlichting", description: "Sfeerverlichting geïntegreerd in het dakprofiel", icon: IconBulb },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 overflow-hidden rounded-full transition-colors ${
        checked ? "bg-copper" : "bg-anthracite-700/15"
      }`}
    >
      <span
        className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Configurator() {
  const [state, setState] = useState<ConfiguratorState>(CONFIGURATOR_DEFAULTS);
  const [step, setStep] = useState(0);
  const { prijs, loading: prijsLoading, onvolledigeOnderdelen } = usePrijs(state);

  const summaryLines = useMemo(() => describeConfiguration(state), [state]);
  const offerteHref = useMemo(
    () => `/offerte?${configuratorStateToQuery(state, prijs ?? 0)}`,
    [state, prijs]
  );

  function update<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function updateKant(kant: "zijwandLinks" | "zijwandRechts", patch: Partial<ZijwandKant>) {
    setState((prev) => {
      const huidig = prev[kant];
      const volgende = { ...huidig, ...patch };
      // Een gekozen zijwand vraagt altijd om een spie-keuze (nooit "geen" spie op een
      // echte wand); andersom hoort bij "geen" zijwand ook geen spie.
      if (patch.materiaal !== undefined) {
        if (patch.materiaal === "geen") {
          volgende.spie = "geen";
        } else if (volgende.spie === "geen") {
          volgende.spie = DEFAULT_SPIE_VOOR_MATERIAAL[patch.materiaal];
        }
      }
      return { ...prev, [kant]: volgende };
    });
  }

  function goNext() {
    setStep((s) => Math.min(CONFIGURATOR_STEPS.length - 1, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  const currentStepMeta = CONFIGURATOR_STEPS[step];
  const CurrentStepIcon = currentStepMeta.icon;
  const isLastStep = step === CONFIGURATOR_STEPS.length - 1;

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
      {/* Left: options */}
      <div className="flex flex-col gap-10">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-anthracite-700/8 bg-white shadow-card">
          <Image
            src="/hero/veranda-voorkant.jpg"
            alt="LivinXL veranda van voren, aluminium frame met glazen wanden tegen een woning"
            fill
            sizes="(min-width: 1280px) 60vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Stap-voor-stap configuratie: één beslissing per stap i.p.v. alles
            onder elkaar, zodat straks per stap het afhaakpercentage meetbaar is. */}
        <div className="card p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-anthracite-400">
              <span>
                Vraag {step + 1} van {CONFIGURATOR_STEPS.length}
              </span>
              <span>{Math.round(((step + 1) / CONFIGURATOR_STEPS.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-anthracite-700/8">
              <div
                className="h-full rounded-full bg-copper transition-all duration-300"
                style={{ width: `${((step + 1) / CONFIGURATOR_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {CurrentStepIcon && <CurrentStepIcon className="h-6 w-6 shrink-0 text-copper" />}
            <div>
              <h3 className="text-lg font-bold text-anthracite-700">{currentStepMeta.title}</h3>
              {currentStepMeta.description && (
                <p className="text-xs text-anthracite-400">{currentStepMeta.description}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="field-label mb-0" htmlFor="breedte-getal">Breedte</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="breedte-getal"
                        type="number"
                        inputMode="numeric"
                        min={LIMITS.width.min}
                        max={LIMITS.width.max}
                        step={LIMITS.width.step}
                        value={state.width}
                        onChange={(e) => {
                          if (e.target.value === "") return;
                          const parsed = Number(e.target.value);
                          if (!Number.isNaN(parsed)) update("width", parsed);
                        }}
                        onBlur={() => update("width", clamp(state.width, LIMITS.width.min, LIMITS.width.max))}
                        className="w-20 rounded-lg border border-anthracite-700/15 px-2 py-1 text-right text-sm font-semibold text-anthracite-700 focus:border-copper focus:outline-none"
                      />
                      <span className="text-sm font-semibold text-anthracite-700">cm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={LIMITS.width.min}
                    max={LIMITS.width.max}
                    step={LIMITS.width.step}
                    value={state.width}
                    onChange={(e) => update("width", Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-anthracite-700/10 accent-copper"
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <label className="field-label mb-0" htmlFor="diepte-getal">Diepte</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="diepte-getal"
                        type="number"
                        inputMode="numeric"
                        min={LIMITS.depth.min}
                        max={LIMITS.depth.max}
                        step={LIMITS.depth.step}
                        value={state.depth}
                        onChange={(e) => {
                          if (e.target.value === "") return;
                          const parsed = Number(e.target.value);
                          if (!Number.isNaN(parsed)) update("depth", parsed);
                        }}
                        onBlur={() => update("depth", clamp(state.depth, LIMITS.depth.min, LIMITS.depth.max))}
                        className="w-20 rounded-lg border border-anthracite-700/15 px-2 py-1 text-right text-sm font-semibold text-anthracite-700 focus:border-copper focus:outline-none"
                      />
                      <span className="text-sm font-semibold text-anthracite-700">cm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={LIMITS.depth.min}
                    max={LIMITS.depth.max}
                    step={LIMITS.depth.step}
                    value={state.depth}
                    onChange={(e) => update("depth", Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-anthracite-700/10 accent-copper"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ROOF_MATERIALS.map((option) => {
                  const active = state.roofMaterial === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => update("roofMaterial", option.id)}
                      className={`overflow-hidden rounded-xl border text-left transition-colors ${
                        active
                          ? "border-copper bg-copper-50"
                          : "border-anthracite-700/12 hover:border-anthracite-700/30"
                      }`}
                    >
                      <div className="relative h-28 w-full">
                        <Image src={option.image} alt={option.label} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <span className="block text-sm font-semibold text-anthracite-700">{option.label}</span>
                        <span className="mt-1 block text-xs text-anthracite-400">{option.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FRAME_COLORS.map((color) => {
                  const active = state.frameColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => update("frameColor", color.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                        active ? "border-copper bg-copper-50" : "border-anthracite-700/12 hover:border-anthracite-700/30"
                      }`}
                    >
                      <span
                        className="h-9 w-9 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-center text-xs font-semibold text-anthracite-700">{color.label}</span>
                      <span className="text-[10px] text-anthracite-400">{color.ral}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <MateriaalPicker
                options={VOORKANT_MATERIALEN}
                value={state.voorkant}
                onChange={(v) => update("voorkant", v)}
              />
            )}

            {step === 4 && (
              <MateriaalPicker
                options={ZIJWAND_MATERIALEN}
                value={state.zijwandLinks.materiaal}
                onChange={(v) => updateKant("zijwandLinks", { materiaal: v })}
              />
            )}

            {step === 5 && (
              <div>
                <MateriaalPicker
                  options={spieOpties(state.zijwandLinks.materiaal)}
                  value={state.zijwandLinks.spie}
                  onChange={(v) => updateKant("zijwandLinks", { spie: v })}
                />
                {state.zijwandLinks.materiaal !== "geen" && (
                  <p className="mt-2 text-xs text-anthracite-400">Verplicht zodra u een zijwand kiest.</p>
                )}
              </div>
            )}

            {step === 6 && (
              <MateriaalPicker
                options={ZIJWAND_MATERIALEN}
                value={state.zijwandRechts.materiaal}
                onChange={(v) => updateKant("zijwandRechts", { materiaal: v })}
              />
            )}

            {step === 7 && (
              <div>
                <MateriaalPicker
                  options={spieOpties(state.zijwandRechts.materiaal)}
                  value={state.zijwandRechts.spie}
                  onChange={(v) => updateKant("zijwandRechts", { spie: v })}
                />
                {state.zijwandRechts.materiaal !== "geen" && (
                  <p className="mt-2 text-xs text-anthracite-400">Verplicht zodra u een zijwand kiest.</p>
                )}
              </div>
            )}

            {step === 8 && (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => update("screens", [])}
                    className={`overflow-hidden rounded-xl border text-left transition-colors ${
                      state.screens.length === 0
                        ? "border-copper bg-copper-50"
                        : "border-anthracite-700/12 hover:border-anthracite-700/30"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full">
                      <Image src="/wandopties/voorkant-geen.jpg" alt="Geen screens" fill className="object-cover" />
                    </div>
                    <div className="p-2.5">
                      <span className="block text-xs font-semibold text-anthracite-700">Geen</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      update("screens", state.screens.length > 0 ? state.screens : SCREEN_POSITIONS.map((p) => p.id))
                    }
                    className={`overflow-hidden rounded-xl border text-left transition-colors ${
                      state.screens.length > 0
                        ? "border-copper bg-copper-50"
                        : "border-anthracite-700/12 hover:border-anthracite-700/30"
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src="/wandopties/screens.png"
                        alt="Screen (zip-screen) neergelaten aan de voorkant van een veranda"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <span className="block text-xs font-semibold text-anthracite-700">Screens</span>
                    </div>
                  </button>
                </div>

                {state.screens.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-anthracite-400">Kies de zijden</p>
                    <PositionToggles value={state.screens} options={SCREEN_POSITIONS} onChange={(v) => update("screens", v)} />
                    <p className="mt-2 text-xs text-anthracite-400">
                      Standaard antraciet doek. Wilt u een andere kleur? Geef dit aan bij uw offerteaanvraag.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 9 && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-anthracite-600">Sfeervolle ledverlichting inbegrepen bij uw veranda?</p>
                <Toggle checked={state.ledverlichting} onChange={(v) => update("ledverlichting", v)} />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-anthracite-700/8 pt-6">
            <button type="button" onClick={goBack} className={`btn-ghost ${step === 0 ? "invisible" : ""}`}>
              Terug
            </button>
            {step < CONFIGURATOR_STEPS.length - 1 ? (
              <button type="button" onClick={goNext} className="btn-primary">
                Volgende
              </button>
            ) : (
              <Link href={offerteHref} className="btn-primary">
                Vraag offerte aan &amp; bekijk uw prijs
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Right: sticky summary. Price is blurred — unlocking it (and the interactive
          monthly-payment calculator) requires submitting an offerte first. */}
      <div className="flex flex-col gap-6 xl:sticky xl:top-28 xl:self-start">
        <div className="card p-6 sm:p-8">
          <span className="eyebrow">Uw configuratie</span>
          <div className="mt-3 flex items-end gap-2">
            <span
              aria-hidden="true"
              className={`select-none text-4xl font-extrabold tracking-tightest text-anthracite-700 blur-md ${prijsLoading ? "opacity-50" : ""}`}
            >
              {prijs != null ? formatCurrency(prijs) : formatCurrency(0)}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-copper-600">
            <IconLock className="h-3.5 w-3.5 shrink-0" />
            Vraag een offerte aan om uw prijs te zien
          </p>
          <p className="mt-1 text-xs text-anthracite-400">Inclusief montage</p>
          {onvolledigeOnderdelen.length > 0 && (
            <p className="mt-2 text-xs leading-relaxed text-anthracite-400">
              Prijs voor {onvolledigeOnderdelen.join(", ")} wordt door onze adviseur definitief bepaald en zit
              nog niet in dit bedrag.
            </p>
          )}

          <ul className="mt-5 space-y-2 border-t border-anthracite-700/8 pt-5">
            {summaryLines.map((line) => (
              <li key={line} className="text-sm text-anthracite-600">
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            {isLastStep ? (
              <Link href={offerteHref} className="btn-primary w-full">
                Vraag offerte aan &amp; bekijk uw prijs
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="btn-primary w-full cursor-not-allowed opacity-40"
                title="Doorloop eerst alle configuratiestappen hiernaast"
              >
                <IconLock className="h-4 w-4 shrink-0" />
                Vraag offerte aan &amp; bekijk uw prijs
              </button>
            )}
            {!isLastStep && (
              <p className="text-center text-xs text-anthracite-400">
                Doorloop eerst alle stappen om een offerte aan te vragen.
              </p>
            )}
            <Link href="/contact" className="btn-ghost w-full">
              Stel een vraag
            </Link>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-anthracite-400">
            Na uw aanvraag ziet u direct uw prijs, en kunt u zelf een maandbedrag samenstellen.
          </p>
        </div>
      </div>
    </div>
  );
}
