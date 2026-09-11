import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Persists submitted offertes so they can be reviewed in /admin. Reads (in order of
 * preference) DATABASE_URL, then POSTGRES_URL — both are populated by the Neon/Vercel
 * Postgres integration; DATABASE_URL is the one this project's integration actually uses.
 *
 * This file must never be imported from a "use client" component — it holds a raw
 * database connection string.
 */
const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sql: NeonQueryFunction<false, false> | null = null;
function getSql(): NeonQueryFunction<false, false> | null {
  if (!CONNECTION_STRING) return null;
  if (!sql) sql = neon(CONNECTION_STRING);
  return sql;
}

let schemaReady: Promise<unknown> | null = null;
function ensureSchema(client: NeonQueryFunction<false, false>): Promise<unknown> {
  if (!schemaReady) {
    schemaReady = client`
      CREATE TABLE IF NOT EXISTS offertes (
        id BIGSERIAL PRIMARY KEY,
        offerte_nummer TEXT NOT NULL,
        datum TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        naam TEXT NOT NULL,
        email TEXT NOT NULL,
        telefoon TEXT NOT NULL,
        adres TEXT NOT NULL DEFAULT '',
        postcode TEXT NOT NULL DEFAULT '',
        plaats TEXT NOT NULL DEFAULT '',
        model TEXT NOT NULL DEFAULT '',
        periode TEXT NOT NULL DEFAULT '',
        opmerkingen TEXT NOT NULL DEFAULT '',
        configuratie_lines JSONB NOT NULL DEFAULT '[]'::jsonb,
        prijs INTEGER
      )
    `;
  }
  return schemaReady;
}

export interface OfferteRecord {
  id: string;
  offerteNummer: string;
  datum: string;
  createdAt: string;
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  plaats: string;
  model: string;
  periode: string;
  opmerkingen: string;
  configuratieLines: string[];
  prijs: number | null;
}

// The neon serverless driver returns untyped rows (Record<string, any>) for tagged
// template queries, so this intentionally accepts `any` rather than fighting that.
function mapRow(row: Record<string, any>): OfferteRecord {
  return {
    id: String(row.id),
    offerteNummer: row.offerte_nummer,
    datum: row.datum,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    naam: row.naam,
    email: row.email,
    telefoon: row.telefoon,
    adres: row.adres,
    postcode: row.postcode,
    plaats: row.plaats,
    model: row.model,
    periode: row.periode,
    opmerkingen: row.opmerkingen,
    configuratieLines: Array.isArray(row.configuratie_lines) ? row.configuratie_lines : [],
    prijs: row.prijs == null ? null : Number(row.prijs),
  };
}

export type NieuweOfferte = Omit<OfferteRecord, "id" | "createdAt">;

/** Saves a submitted offerte. Silently no-ops (logs) if DATABASE_URL isn't configured. */
export async function saveOfferte(input: NieuweOfferte): Promise<void> {
  const client = getSql();
  if (!client) {
    console.error("DATABASE_URL ontbreekt — offerte wordt niet opgeslagen voor het admin-overzicht.");
    return;
  }
  await ensureSchema(client);
  await client`
    INSERT INTO offertes
      (offerte_nummer, datum, naam, email, telefoon, adres, postcode, plaats, model, periode, opmerkingen, configuratie_lines, prijs)
    VALUES
      (${input.offerteNummer}, ${input.datum}, ${input.naam}, ${input.email}, ${input.telefoon}, ${input.adres},
       ${input.postcode}, ${input.plaats}, ${input.model}, ${input.periode}, ${input.opmerkingen},
       ${JSON.stringify(input.configuratieLines)}::jsonb, ${input.prijs})
  `;
}

/** Lists all offertes, most recent first. Returns [] if DATABASE_URL isn't configured. */
export async function listOffertes(): Promise<OfferteRecord[]> {
  const client = getSql();
  if (!client) return [];
  await ensureSchema(client);
  const rows = await client`SELECT * FROM offertes ORDER BY created_at DESC`;
  return rows.map(mapRow);
}

/** Fetches a single offerte by id, or null if not found / DATABASE_URL isn't configured. */
export async function getOfferteById(id: string): Promise<OfferteRecord | null> {
  const client = getSql();
  if (!client) return null;
  await ensureSchema(client);
  const rows = await client`SELECT * FROM offertes WHERE id = ${id}`;
  return rows[0] ? mapRow(rows[0]) : null;
}
