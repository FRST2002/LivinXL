import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Offerte aanvragen",
  description:
    "Vraag vrijblijvend een offerte aan voor uw LivinXL Vista aluminium veranda op maat.",
};

export default function OffertePage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Offerte aanvragen"
        title="Vraag vrijblijvend een offerte aan"
        description="Vul onderstaand formulier in en we nemen binnen enkele werkdagen contact met u op. Heeft u de configurator gebruikt? Dan is uw configuratie automatisch toegevoegd."
      />
      <div className="mt-10 max-w-3xl">
        <Suspense fallback={<div className="card p-8 text-sm text-anthracite-400">Formulier wordt geladen...</div>}>
          <QuoteForm />
        </Suspense>
      </div>
    </div>
  );
}
