import Link from "next/link";
import { listOffertes } from "@/lib/server/db";
import { formatCurrency } from "@/lib/finance";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminOverzichtPage() {
  const offertes = await listOffertes();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-anthracite-700">Offerteaanvragen</h1>
          <p className="mt-1 text-sm text-anthracite-500">
            {offertes.length} {offertes.length === 1 ? "aanvraag" : "aanvragen"}
          </p>
        </div>
        <LogoutButton />
      </div>

      {offertes.length === 0 ? (
        <p className="mt-8 text-sm text-anthracite-500">Nog geen offerteaanvragen ontvangen.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-anthracite-700/8 bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-anthracite-700/8 text-xs uppercase tracking-wide text-anthracite-400">
              <tr>
                <th className="px-4 py-3">Offertenummer</th>
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Naam</th>
                <th className="px-4 py-3">Plaats</th>
                <th className="px-4 py-3">Prijs</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-anthracite-700/8">
              {offertes.map((offerte) => (
                <tr key={offerte.id}>
                  <td className="px-4 py-3 font-semibold text-anthracite-700">{offerte.offerteNummer}</td>
                  <td className="px-4 py-3 text-anthracite-500">{offerte.datum}</td>
                  <td className="px-4 py-3 text-anthracite-700">{offerte.naam}</td>
                  <td className="px-4 py-3 text-anthracite-500">{offerte.plaats || "—"}</td>
                  <td className="px-4 py-3 text-anthracite-700">
                    {offerte.prijs != null ? formatCurrency(offerte.prijs) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/${offerte.id}`} className="text-sm font-semibold text-copper-600 hover:underline">
                      Bekijken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
