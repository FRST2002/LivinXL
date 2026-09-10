"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CONFIGURATOR_DEFAULTS,
  ConfiguratorState,
  FRAME_COLORS,
  LIMITS,
  PositionOption,
  ROOF_MATERIALS,
  SCHUIFWAND_POSITIONS,
  SCREEN_POSITIONS,
  ZIJWAND_POSITIONS,
  configuratorStateToQuery,
  describeConfiguration,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/finance";
import { IconBulb, IconLayers, IconLock, IconRoof, IconRuler, IconScreen, IconWall } from "@/components/icons";

/** Debounced price lookup: the actual purchase-price data lives server-side only (see app/api/prijs). */
function usePrijs(state: ConfiguratorState) {
  const [prijs, setPrijs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timeout = setTimeout(() => {
      fetch("/api/prijs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          width: state.width,
          depth: state.depth,
          roofMaterial: state.roofMaterial,
          schuifwanden: state.schuifwanden,
          zijwanden: state.zijwanden,
          screens: state.screens,
          ledverlichting: state.ledverlichting,
        }),
      })
        .then((res) => res.json())
        .then((data: { prijs?: number }) => {
          if (!cancelled && typeof data.prijs === "number") {
            setPrijs(data.prijs);
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
    state.schuifwanden,
    state.zijwanden,
    state.screens,
    state.ledverlichting,
  ]);

  return { prijs, loading };
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
  const { prijs, loading: prijsLoading } = usePrijs(state);

  const summaryLines = useMemo(() => describeConfiguration(state), [state]);
  const offerteHref = useMemo(
    () => `/offerte?${configuratorStateToQuery(state, prijs ?? 0)}`,
    [state, prijs]
  );

  function update<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

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

        {/* Afmetingen */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <IconRuler className="h-6 w-6 text-copper" />
            <h3 className="text-lg font-bold text-anthracite-700">Afmetingen</h3>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="field-label mb-0">Breedte</label>
                <span className="text-sm font-semibold text-anthracite-700">{state.width} cm</span>
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
                <label className="field-label mb-0">Diepte</label>
                <span className="text-sm font-semibold text-anthracite-700">{state.depth} cm</span>
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
        </div>

        {/* Dakmateriaal */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <IconRoof className="h-6 w-6 text-copper" />
            <h3 className="text-lg font-bold text-anthracite-700">Dakmateriaal</h3>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </div>

        {/* Kleur */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-anthracite-700">Kleur aluminium frame</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        </div>

        {/* Opties */}
        <div className="card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-anthracite-700">Opties</h3>
          <div className="mt-6 divide-y divide-anthracite-700/8">
            <div className="py-4">
              <div className="flex items-center gap-3">
                <IconLayers className="h-5 w-5 shrink-0 text-copper" />
                <div>
                  <p className="text-sm font-semibold text-anthracite-700">Glazen schuifwanden</p>
                  <p className="text-xs text-anthracite-400">Kies de zijden waar u schuifwanden wilt</p>
                </div>
              </div>
              <div className="mt-3 pl-8">
                <PositionToggles
                  value={state.schuifwanden}
                  options={SCHUIFWAND_POSITIONS}
                  onChange={(v) => update("schuifwanden", v)}
                />
              </div>
            </div>

            <div className="py-4">
              <div className="flex items-center gap-3">
                <IconWall className="h-5 w-5 shrink-0 text-copper" />
                <div>
                  <p className="text-sm font-semibold text-anthracite-700">Zijwanden</p>
                  <p className="text-xs text-anthracite-400">Dichte panelen voor extra beschutting</p>
                </div>
              </div>
              <div className="mt-3 pl-8">
                <PositionToggles
                  value={state.zijwanden}
                  options={ZIJWAND_POSITIONS}
                  onChange={(v) => update("zijwanden", v)}
                />
              </div>
            </div>

            <div className="py-4">
              <div className="flex items-center gap-3">
                <IconScreen className="h-5 w-5 shrink-0 text-copper" />
                <div>
                  <p className="text-sm font-semibold text-anthracite-700">Screens</p>
                  <p className="text-xs text-anthracite-400">Elektrische zonwering / windvast doek</p>
                </div>
              </div>
              <div className="mt-3 pl-8">
                <PositionToggles
                  value={state.screens}
                  options={SCREEN_POSITIONS}
                  onChange={(v) => update("screens", v)}
                />
                {state.screens.length > 0 && (
                  <p className="mt-2 text-xs text-anthracite-400">
                    Standaard antraciet doek. Wilt u een andere kleur? Geef dit aan bij uw offerteaanvraag.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <IconBulb className="h-5 w-5 text-copper" />
                <div>
                  <p className="text-sm font-semibold text-anthracite-700">Ledverlichting</p>
                  <p className="text-xs text-anthracite-400">Sfeerverlichting geïntegreerd in het dakprofiel</p>
                </div>
              </div>
              <Toggle checked={state.ledverlichting} onChange={(v) => update("ledverlichting", v)} />
            </div>
          </div>
        </div>
      </div>

      {/* Right: sticky summary. Price is blurred — unlocking it (and the interactive
          monthly-payment calculator) requires submitting an offerte first. */}
      <div className="flex flex-col gap-6 xl:sticky xl:top-28 xl:self-start">
        <div className="card p-6 sm:p-8">
          <span className="eyebrow">Uw configuratie</span>
          <div className="relative mt-3">
            <div className="flex items-end gap-2">
              <span
                aria-hidden="true"
                className={`select-none text-4xl font-extrabold tracking-tightest text-anthracite-700 blur-md ${prijsLoading ? "opacity-50" : ""}`}
              >
                {prijs != null ? formatCurrency(prijs) : formatCurrency(0)}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="flex items-center gap-2 rounded-full bg-copper-50 px-3 py-1.5">
                <IconLock className="h-4 w-4 shrink-0 text-copper-600" />
                <span className="text-xs font-semibold text-copper-600">Vraag een offerte aan om uw prijs te zien</span>
              </div>
            </div>
          </div>
          <p className="mt-1 text-xs text-anthracite-400">Inclusief montage</p>

          <ul className="mt-5 space-y-2 border-t border-anthracite-700/8 pt-5">
            {summaryLines.map((line) => (
              <li key={line} className="text-sm text-anthracite-600">
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Link href={offerteHref} className="btn-primary w-full">
              Vraag offerte aan &amp; bekijk uw prijs
            </Link>
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
