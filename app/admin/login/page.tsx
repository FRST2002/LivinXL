"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        setError(data.error ?? "Inloggen mislukt");
        setLoading(false);
        return;
      }

      // Intentional full reload (not router.push): forces middleware to see the
      // fresh session cookie rather than relying on client-side route caching.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin";
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <h1 className="text-lg font-bold text-anthracite-700">Inloggen</h1>
        <p className="mt-1 text-sm text-anthracite-500">Toegang tot het offerte-overzicht.</p>

        <div className="mt-6">
          <label className="field-label" htmlFor="username">
            Gebruikersnaam
          </label>
          <input
            id="username"
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </div>
        <div className="mt-4">
          <label className="field-label" htmlFor="password">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
