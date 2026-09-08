"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheck } from "@/components/icons";

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

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const prijs = searchParams.get("prijs");
    const samenvatting = searchParams.get("samenvatting");
    if (!prijs && !samenvatting) return;

    const lines: string[] = [];
    if (samenvatting) lines.push(`Configuratie: ${samenvatting.replace(/\|/g, "\n-")}`);
    if (prijs) lines.push(`Indicatieve richtprijs: € ${Number(prijs).toLocaleString("nl-NL")}`);

    setForm((prev) => ({ ...prev, opmerkingen: lines.join("\n") }));
  }, [searchParams]);

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
      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-copper-50">
          <IconCheck className="h-7 w-7 text-copper" />
        </span>
        <h3 className="text-xl font-bold text-anthracite-700">Offerteaanvraag verstuurd</h3>
        <p className="max-w-md text-sm text-anthracite-500">
          Bedankt voor uw aanvraag. We nemen binnen enkele werkdagen contact met u op om uw
          LivinXL Vista en de mogelijkheden te bespreken.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-2">
          Nieuwe aanvraag versturen
        </button>
      </div>
    );
  }

  return (
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
        <label className="field-label" htmlFor="opmerkingen">Opmerkingen / gewenste configuratie</label>
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
  );
}
