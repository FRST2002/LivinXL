"use client";

import { FormEvent, useState } from "react";
import { IconCheck } from "@/components/icons";

interface FormState {
  naam: string;
  email: string;
  telefoon: string;
  onderwerp: string;
  bericht: string;
}

const initialState: FormState = {
  naam: "",
  email: "",
  telefoon: "",
  onderwerp: "Algemene vraag",
  bericht: "",
};

const ONDERWERPEN = ["Algemene vraag", "Offerte", "Financiering", "Dealer worden", "Service & garantie"];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.naam.trim()) next.naam = "Vul uw naam in.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Vul een geldig e-mailadres in.";
    if (!form.telefoon.trim()) next.telefoon = "Vul een telefoonnummer in.";
    if (!form.bericht.trim()) next.bericht = "Vul uw bericht in.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
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
        <h3 className="text-xl font-bold text-anthracite-700">Bericht verstuurd</h3>
        <p className="max-w-md text-sm text-anthracite-500">
          Bedankt voor uw bericht. We reageren zo spoedig mogelijk.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-2">
          Nieuw bericht versturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-6 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          <label className="field-label" htmlFor="onderwerp">Onderwerp</label>
          <select
            id="onderwerp"
            className="field-input"
            value={form.onderwerp}
            onChange={(e) => update("onderwerp", e.target.value)}
          >
            {ONDERWERPEN.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="bericht">Bericht</label>
        <textarea
          id="bericht"
          rows={6}
          className="field-input resize-none"
          value={form.bericht}
          onChange={(e) => update("bericht", e.target.value)}
        />
        {errors.bericht && <p className="mt-1 text-xs text-red-600">{errors.bericht}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Er ging iets mis bij het versturen. Probeer het opnieuw of neem telefonisch contact op.
        </p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? "Versturen..." : "Bericht versturen"}
      </button>
    </form>
  );
}
