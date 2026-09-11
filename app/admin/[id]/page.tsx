import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfferteById } from "@/lib/server/db";
import { formatCurrency } from "@/lib/finance";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminOfferteDetailPage({ params }: { params: { id: string } }) {
  const offerte = await getOfferteById(params.id);
  if (!offerte) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-copper-600 hover:underline">
        &larr; Terug naar overzicht
      </Link>

      <div className="mt-6 rounded-2xl border border-anthracite-700/8 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-anthracite-700/8 pb-6">
          <div>
            <h1 className="text-xl font-bold text-anthracite-700">Offerte {offerte.offerteNummer}</h1>
            <p className="mt-1 text-sm text-anthracite-500">{offerte.datum}</p>
          </div>
          {offerte.prijs != null && (
            <div className="text-right">
              <p className="text-xs text-anthracite-400">Totaalbedrag veranda</p>
              <p className="text-xl font-bold text-anthracite-700">{formatCurrency(offerte.prijs)}</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">Klantgegevens</h2>
            <div className="mt-3 space-y-1 text-sm text-anthracite-700">
              <p>{offerte.naam}</p>
              <p>
                <a className="hover:underline" href={`mailto:${offerte.email}`}>
                  {offerte.email}
                </a>
              </p>
              <p>
                <a className="hover:underline" href={`tel:${offerte.telefoon}`}>
                  {offerte.telefoon}
                </a>
              </p>
              {offerte.adres && <p>{offerte.adres}</p>}
              <p>{[offerte.postcode, offerte.plaats].filter(Boolean).join(" ")}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">
              Model &amp; planning
            </h2>
            <div className="mt-3 space-y-1 text-sm text-anthracite-700">
              <p>{offerte.model || "—"}</p>
              <p>Gewenste periode: {offerte.periode || "—"}</p>
            </div>
          </div>
        </div>

        {offerte.configuratieLines.length > 0 && (
          <div className="mt-8 border-t border-anthracite-700/8 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">Configuratie</h2>
            <ul className="mt-3 space-y-1 text-sm text-anthracite-700">
              {offerte.configuratieLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {offerte.opmerkingen && (
          <div className="mt-8 border-t border-anthracite-700/8 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-anthracite-400">Opmerkingen</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-anthracite-600">{offerte.opmerkingen}</p>
          </div>
        )}
      </div>
    </div>
  );
}
