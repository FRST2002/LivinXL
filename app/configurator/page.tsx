import type { Metadata } from "next";
import Configurator from "@/components/Configurator";

export const metadata: Metadata = {
  title: "Configurator",
  description:
    "Stel uw LivinXL Vista veranda samen en bekijk direct de prijs en financieringsmogelijkheden.",
};

export default function ConfiguratorPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="max-w-2xl">
        <span className="eyebrow">Configurator</span>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tightest text-anthracite-700 sm:text-5xl">
          Stel uw LivinXL Vista samen
        </h1>
        <p className="mt-4 text-base leading-relaxed text-anthracite-500">
          Kies afmetingen, materialen en opties en bekijk direct de richtprijs met bijbehorend
          indicatief maandbedrag. Vraag daarna vrijblijvend een offerte aan.
        </p>
      </div>

      <div className="mt-12">
        <Configurator />
      </div>
    </div>
  );
}
