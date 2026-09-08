"use client";

import { FormEvent, useState } from "react";
import { IconCheck } from "@/components/icons";

interface FormState {
  bedrijfsnaam: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
  kvkNummer: string;
  plaats: string;
  website: string;
  bericht: string;
}

const initialState: FormState = {
  bedrijfsnaam: "",
  contactpersoon: "",
  email: "",
  telefoon: "",
  kvkNummer: "",
  plaats: "",
  website: "",
  bericht: "",
};

export default function DealerForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.bedrijfsnaam.trim()) next.bedrijfsnaam = "Vul uw bedrijfsnaam in.";
    if (!form.contactpersoon.trim()) next.contactpersoon = "Vul een contactpersoon in.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Vul een geldig e-mailadres in.";
    if (!form.telefoon.trim()) next.telefoon = "Vul een telefoonnummer in.";
    if (!form.kvkNummer.trim()) next.kvkNummer = "Vul uw KvK-nummer in.";
    if (!form.plaats.trim()) next.plaats = "Vul uw vestigingsplaats in.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/dealer", {
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
        <h3 className="text-xl font-bold text-anthracite-700">Aanmelding ontvangen</h3>
        <p className="max-w-md text-sm text-anthracite-500">
          Bedankt voor uw interesse om LivinXL dealer te worden. We nemen zo spoedig mogelijk
          contact met u op om de mogelijkheden te bespreken.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-2">
          Nieuwe aanmelding versturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <label className="field-label" htmlFor="bedrijfsnaam">Bedrijfsnaam</label>
        <input
          id="bedrijfsnaam"
          className="field-input"
          value={form.bedrijfsnaam}
          onChange={(e) => update("bedrijfsnaam", e.target.value)}
        />
        {errors.bedrijfsnaam && <p className="mt-1 text-xs text-red-600">{errors.bedrijfsnaam}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="contactpersoon">Contactpersoon</label>
        <input
          id="contactpersoon"
          className="field-input"
          value={form.contactpersoon}
          onChange={(e) => update("contactpersoon", e.target.value)}
        />
        {errors.contactpersoon && <p className="mt-1 text-xs text-red-600">{errors.contactpersoon}</p>}
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
        <label className="field-label" htmlFor="kvk">KvK-nummer</label>
        <input
          id="kvk"
          className="field-input"
          value={form.kvkNummer}
          onChange={(e) => update("kvkNummer", e.target.value)}
        />
        {errors.kvkNummer && <p className="mt-1 text-xs text-red-600">{errors.kvkNummer}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="plaats">Vestigingsplaats</label>
        <input
          id="plaats"
          className="field-input"
          value={form.plaats}
          onChange={(e) => update("plaats", e.target.value)}
        />
        {errors.plaats && <p className="mt-1 text-xs text-red-600">{errors.plaats}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="website">Website (optioneel)</label>
        <input
          id="website"
          className="field-input"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="bericht">Vertel kort iets over uw bedrijf</label>
        <textarea
          id="bericht"
          rows={4}
          className="field-input resize-none"
          value={form.bericht}
          onChange={(e) => update("bericht", e.target.value)}
        />
      </div>

      <div className="sm:col-span-2">
        {status === "error" && (
          <p className="mb-4 text-sm text-red-600">
            Er ging iets mis bij het versturen. Probeer het opnieuw of neem telefonisch contact op.
          </p>
        )}
        <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
          {status === "submitting" ? "Versturen..." : "Aanmelding versturen"}
        </button>
      </div>
    </form>
  );
}
