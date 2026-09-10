"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheck } from "@/components/icons";
import { formatCurrency } from "@/lib/finance";
import { FRAME_COLORS } from "@/lib/pricing";

const OFFERTE_STAPPEN = [
  { title: "Adviesgesprek", description: "Wij nemen contact op om uw configuratie en wensen door te nemen." },
  {
    title: "Financiering & voorwaardencheck",
    description: "Bij akkoord stelt onze onafhankelijke financier een voorstel op basis van uw configuratie.",
  },
  {
    title: "Inmeten & proforma",
    description: "Na goedkeuring meten wij bij u op locatie in en tekent u een vrijblijvende proforma.",
  },
  {
    title: "Plaatsing",
    description: "Na definitief akkoord plaatst ons eigen montageteam uw veranda, doorgaans binnen 3 tot 4 weken.",
  },
];

const OFFERTE_PROJECTEN = [
  {
    src: "/projecten/project-11.jpg",
    alt: "LivinXL veranda met hangstoel, palmen en zonnepanelen op het dak van de woning",
    location: "Eindhoven",
    date: "Juni 2023",
  },
  {
    src: "/projecten/project-04.jpg",
    alt: "LivinXL veranda in de avond met geïntegreerde ledverlichting en eettafel",
    location: "Apeldoorn",
    date: "Augustus 2024",
  },
  {
    src: "/projecten/project-08.jpg",
    alt: "LivinXL veranda met glazen hoekoplossing bij helderblauwe lucht",
    location: "Zwolle",
    date: "April 2024",
  },
];

interface FormState {
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  plaats: string;
  model: string;
  periode: string;
  opmerkingen: string;
}

const initialState: FormState = {
  naam: "",
  email: "",
  telefoon: "",
  adres: "",
  postcode: "",
  plaats: "",
  model: "LivinXL Vista",
  periode: "Zo snel mogelijk",
  opmerkingen: "",
};

const PERIODE_OPTIONS = ["Zo snel mogelijk", "Binnen 3 maanden", "Binnen 6 maanden", "Nog geen concrete planning"];

interface ConfiguratieSummary {
  prijs: number | null;
  breedte: number | null;
  diepte: number | null;
  lines: string[];
  maandbedrag: number | null;
  looptijd: number | null;
}

function useConfiguratieFromQuery(): ConfiguratieSummary | null {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const prijsRaw = searchParams.get("prijs");
    const samenvattingRaw = searchParams.get("samenvatting");
    const breedteRaw = searchParams.get("breedte");
    const diepteRaw = searchParams.get("diepte");
    const maandbedragRaw = searchParams.get("maandbedrag");
    const looptijdRaw = searchParams.get("looptijd");

    if (!prijsRaw && !samenvattingRaw) return null;

    return {
      prijs: prijsRaw ? Number(prijsRaw) : null,
      breedte: breedteRaw ? Number(breedteRaw) : null,
      diepte: diepteRaw ? Number(diepteRaw) : null,
      lines: samenvattingRaw
        ? samenvattingRaw
            .split("|")
            .map((line) => line.trim())
            .filter(Boolean)
        : [],
      maandbedrag: maandbedragRaw ? Number(maandbedragRaw) : null,
      looptijd: looptijdRaw ? Number(looptijdRaw) : null,
    };
  }, [searchParams]);
}

function buildOfferteSpecs(configuratie: ConfiguratieSummary | null) {
  return [
    { label: "Materiaal frame", value: "Aluminium, poedergecoat" },
    { label: "Breedte", value: configuratie?.breedte != null ? `${configuratie.breedte} cm` : "300 – 700 cm" },
    { label: "Diepte", value: configuratie?.diepte != null ? `${configuratie.diepte} cm` : "250 – 500 cm" },
    { label: "Dakmateriaal", value: "Polycarbonaat of glas (helder / opaal)" },
    { label: "Kleuren", value: FRAME_COLORS.map((c) => `${c.label} (${c.ral})`).join(", ") },
    { label: "Montage", value: "Door eigen montageteam" },
  ];
}

function genereerOfferteNummer(): string {
  const jaar = new Date().getFullYear();
  const volgnummer = Math.floor(1000 + Math.random() * 9000);
  return `LX-${jaar}-${volgnummer}`;
}

export default function QuoteForm() {
  const configuratie = useConfiguratieFromQuery();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [offerteMeta, setOfferteMeta] = useState<{ nummer: string; datum: string } | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.naam.trim()) next.naam = "Vul uw naam in.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Vul een geldig e-mailadres in.";
    if (!form.telefoon.trim()) next.telefoon = "Vul een telefoonnummer in.";
    if (!form.postcode.trim()) next.postcode = "Vul uw postcode in.";
    if (!form.plaats.trim()) next.plaats = "Vul uw woonplaats in.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/offerte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");

      setSubmitted(form);
      setOfferteMeta({
        nummer: genereerOfferteNummer(),
        datum: new Date().toLocaleDateString("nl-NL", { day: "2-digit", month: "long", year: "numeric" }),
      });
      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setSubmitted(null);
    setOfferteMeta(null);
  }

  function handleSaveOfferte() {
    if (!submitted || !offerteMeta) return;

    // Browsers suggest document.title (sanitized) as the "Save as PDF" file name.
    const veiligeNaam = submitted.naam.replace(/[\\/:*?"<>|]/g, "").trim();
    const originalTitle = document.title;
    document.title = `Offerte ${offerteMeta.nummer} - ${veiligeNaam}`;

    function herstelTitel() {
      document.title = originalTitle;
      window.removeEventListener("afterprint", herstelTitel);
    }
    window.addEventListener("afterprint", herstelTitel);

    window.print();
  }

  if (status === "success" && submitted && offerteMeta) {
    const voornaam = submitted.naam.trim().split(" ")[0] || submitted.naam;

    return (
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-card print:overflow-visible print:rounded-none print:shadow-none">
          {/* Hero */}
          <div className="relative aspect-[21/9] w-full break-inside-avoid print:aspect-auto print:h-64">
            <Image
              src="/hero/veranda-voorkant.jpg"
              alt="LivinXL veranda van voren, aluminium frame met glazen wanden tegen een woning"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite-900/80 via-anthracite-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 sm:p-8">
              <span className="text-2xl font-extrabold tracking-tightest text-white">
                Livin<span className="text-copper-300">XL</span>
              </span>
              <p className="text-sm text-white/80">
                Offerte {offerteMeta.nummer} &middot; {offerteMeta.datum}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-base leading-relaxed text-anthracite-600">
              Beste {voornaam}, hartelijk dank voor uw interesse in de LivinXL Vista. Hieronder vindt u een
              overzicht van uw configuratie, de prijs en de vervolgstappen, zodat u direct een goed beeld
              heeft van wat u van ons kunt verwachten.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 border-t border-anthracite-700/10 pt-8 break-inside-avoid sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                  Klantgegevens
                </h3>
                <div className="mt-3 space-y-1 text-sm text-anthracite-700">
                  <p>{submitted.naam}</p>
                  <p>{submitted.email}</p>
                  <p>{submitted.telefoon}</p>
                  {submitted.adres && <p>{submitted.adres}</p>}
                  <p>{[submitted.postcode, submitted.plaats].filter(Boolean).join(" ")}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                  Model &amp; planning
                </h3>
                <div className="mt-3 space-y-1 text-sm text-anthracite-700">
                  <p>{submitted.model}</p>
                  <p>Gewenste periode: {submitted.periode}</p>
                </div>
              </div>
            </div>

            {configuratie && configuratie.lines.length > 0 && (
              <div className="mt-8 border-t border-anthracite-700/10 pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                  Uw configuratie
                </h3>
                <ul className="mt-3 space-y-1 text-sm text-anthracite-700">
                  {configuratie.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {configuratie?.prijs != null && (
              <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl bg-anthracite-700 p-6 text-white break-inside-avoid sm:grid-cols-2">
                <div>
                  <p className="text-xs text-offwhite-300/70">Totaalbedrag veranda</p>
                  <p className="mt-1 text-2xl font-bold">{formatCurrency(configuratie.prijs)}</p>
                </div>
                {configuratie.maandbedrag != null && (
                  <div>
                    <p className="text-xs text-offwhite-300/70">
                      Maandbedrag (indicatief{configuratie.looptijd ? `, looptijd ${configuratie.looptijd} mnd` : ""})
                    </p>
                    <p className="mt-1 text-2xl font-bold text-copper-200">
                      {formatCurrency(configuratie.maandbedrag)}
                      <span className="ml-1 text-xs font-medium text-offwhite-400/70">/ mnd</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Specificaties */}
            <div className="mt-10 border-t border-anthracite-700/10 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                LivinXL Vista in het kort
              </h3>
              <dl className="mt-4 divide-y divide-anthracite-700/8">
                {buildOfferteSpecs(configuratie).map((spec) => (
                  <div key={spec.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
                    <dt className="text-sm font-semibold text-anthracite-700">{spec.label}</dt>
                    <dd className="text-sm text-anthracite-500">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Volgende stappen */}
            <div className="mt-10 border-t border-anthracite-700/10 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                Wat gebeurt er nu
              </h3>
              <ol className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {OFFERTE_STAPPEN.map((step, index) => (
                  <li key={step.title} className="flex flex-col gap-2 break-inside-avoid">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-copper-50 text-sm font-bold text-copper-600">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-anthracite-700">{step.title}</p>
                    <p className="text-xs leading-relaxed text-anthracite-500">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Projecten */}
            <div className="mt-10 border-t border-anthracite-700/10 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                Eerder door ons geplaatst
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {OFFERTE_PROJECTEN.map((project) => (
                  <div
                    key={project.src}
                    className="overflow-hidden rounded-xl border border-anthracite-700/8 break-inside-avoid"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={project.src}
                        alt={project.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="p-3 text-xs text-anthracite-400">
                      {project.location} &middot; {project.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {submitted.opmerkingen && (
              <div className="mt-10 border-t border-anthracite-700/10 pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
                  Opmerkingen
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm text-anthracite-600">{submitted.opmerkingen}</p>
              </div>
            )}

            <p className="mt-10 border-t border-anthracite-700/10 pt-6 text-xs leading-relaxed text-anthracite-400">
              Deze offerte is gebaseerd op uw configuratie; hieraan kunnen geen rechten worden ontleend.
              De definitieve prijs en het definitieve financieringsvoorstel volgen na het adviesgesprek
              en het inmeten op locatie. Genoemde bedragen zijn exclusief eventuele rentekosten van de
              financiering.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card print:hidden sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-anthracite-600">
            <IconCheck className="h-5 w-5 shrink-0 text-copper" />
            Offerteaanvraag verstuurd. We nemen binnen enkele werkdagen contact met u op.
          </p>
          <div className="flex shrink-0 gap-3">
            <button type="button" onClick={handleSaveOfferte} className="btn-primary">
              Offerte opslaan
            </button>
            <button type="button" onClick={handleReset} className="btn-ghost">
              Nieuwe aanvraag
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {configuratie && (
        <div className="card p-6 sm:p-8">
          <span className="eyebrow">Uw configuratie</span>
          {configuratie.lines.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {configuratie.lines.map((line) => (
                <li key={line} className="text-sm text-anthracite-600">
                  {line}
                </li>
              ))}
            </ul>
          )}
          {(configuratie.prijs != null || configuratie.maandbedrag != null) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-anthracite-700/8 pt-5">
              {configuratie.prijs != null && (
                <div>
                  <p className="text-xs text-anthracite-400">Totaalbedrag veranda</p>
                  <p className="text-lg font-bold text-anthracite-700">{formatCurrency(configuratie.prijs)}</p>
                </div>
              )}
              {configuratie.maandbedrag != null && (
                <div>
                  <p className="text-xs text-anthracite-400">
                    Maandbedrag (indicatief{configuratie.looptijd ? `, ${configuratie.looptijd} mnd` : ""})
                  </p>
                  <p className="text-lg font-bold text-anthracite-700">
                    {formatCurrency(configuratie.maandbedrag)}
                    <span className="ml-1 text-xs font-medium text-anthracite-400">/ mnd</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <label className="field-label" htmlFor="naam">Naam</label>
          <input id="naam" className="field-input" value={form.naam} onChange={(e) => update("naam", e.target.value)} />
          {errors.naam && <p className="mt-1 text-xs text-red-600">{errors.naam}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="email">E-mailadres</label>
          <input
            id="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="telefoon">Telefoonnummer</label>
          <input
            id="telefoon"
            type="tel"
            className="field-input"
            value={form.telefoon}
            onChange={(e) => update("telefoon", e.target.value)}
          />
          {errors.telefoon && <p className="mt-1 text-xs text-red-600">{errors.telefoon}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="adres">Adres (straat + huisnummer)</label>
          <input id="adres" className="field-input" value={form.adres} onChange={(e) => update("adres", e.target.value)} />
        </div>

        <div>
          <label className="field-label" htmlFor="postcode">Postcode</label>
          <input
            id="postcode"
            className="field-input"
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value)}
          />
          {errors.postcode && <p className="mt-1 text-xs text-red-600">{errors.postcode}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="plaats">Woonplaats</label>
          <input id="plaats" className="field-input" value={form.plaats} onChange={(e) => update("plaats", e.target.value)} />
          {errors.plaats && <p className="mt-1 text-xs text-red-600">{errors.plaats}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="model">Model</label>
          <input id="model" className="field-input" value={form.model} onChange={(e) => update("model", e.target.value)} />
        </div>

        <div>
          <label className="field-label" htmlFor="periode">Gewenste periode</label>
          <select
            id="periode"
            className="field-input"
            value={form.periode}
            onChange={(e) => update("periode", e.target.value)}
          >
            {PERIODE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="opmerkingen">Opmerkingen (optioneel)</label>
          <textarea
            id="opmerkingen"
            rows={5}
            className="field-input resize-none"
            value={form.opmerkingen}
            onChange={(e) => update("opmerkingen", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          {status === "error" && (
            <p className="mb-4 text-sm text-red-600">
              Er ging iets mis bij het versturen. Probeer het opnieuw of neem telefonisch contact op.
            </p>
          )}
          <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
            {status === "submitting" ? "Versturen..." : "Offerte aanvragen"}
          </button>
        </div>
      </form>
    </div>
  );
}
