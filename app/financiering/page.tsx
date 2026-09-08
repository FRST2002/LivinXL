import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import FinancingStandalone from "@/components/FinancingStandalone";
import { IconCoins, IconShield, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Betaal in termijnen",
  description:
    "Betaal uw LivinXL veranda in termijnen tot 180 maanden. Bereken een indicatief maandbedrag en los altijd kosteloos en renteloos extra af.",
};

const USPS = [
  { icon: IconCoins, label: "Tot 180 maanden looptijd" },
  { icon: IconCheck, label: "Kosteloos en renteloos extra aflossen" },
  { icon: IconShield, label: "Beoordeling door onafhankelijke financier" },
];

const steps = [
  {
    title: "Bereken een indicatie",
    description: "Gebruik de rekentool hierboven om een eerste indicatie van het maandbedrag te krijgen.",
  },
  {
    title: "Adviesgesprek & voorwaardencheck",
    description: "Wij bespreken uw configuratie en toetsen uw aanvraag aan de standaardvoorwaarden.",
  },
  {
    title: "Voorstel van de financier",
    description:
      "Voldoet u aan de voorwaarden? Dan ontvangt u van onze onafhankelijke financier een voorstel op basis van uw samengestelde veranda.",
  },
  {
    title: "Inmeten, proforma & akkoord",
    description:
      "Na goedkeuring meten wij in en tekent u een vrijblijvende proforma. De financier rondt daarna af met het definitieve voorstel.",
  },
];

export default function FinancieringPage() {
  return (
    <div>
      <section className="container-page py-14 sm:py-20">
        <span className="eyebrow">Betaal in termijnen</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tightest text-anthracite-700 sm:text-5xl">
          Betaal uw veranda in termijnen tot 180 maanden
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-anthracite-500 sm:text-lg">
          Spreid de investering in uw LivinXL veranda over een looptijd die bij u past. Onderstaande
          rekentool geeft een indicatieve, annuïtaire berekening.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {USPS.map((usp) => (
            <span
              key={usp.label}
              className="inline-flex items-center gap-2 rounded-full bg-copper-50 px-4 py-2 text-sm font-semibold text-copper-600"
            >
              <usp.icon className="h-4 w-4" />
              {usp.label}
            </span>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <FinancingStandalone />
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Werkwijze"
            title="Zo werkt financiering bij LivinXL"
            description="De financiering zelf loopt via een onafhankelijke financier, niet via LivinXL. Deze beoordeelt uw aanvraag en stelt de definitieve voorwaarden vast."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="card p-6">
                <span className="text-sm font-semibold text-copper">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base font-bold text-anthracite-700">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="card flex gap-4 p-6">
            <IconCoins className="h-8 w-8 shrink-0 text-copper" />
            <div>
              <h3 className="text-base font-bold text-anthracite-700">Annuïtaire berekening</h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite-500">
                Bij een annuïtaire lening betaalt u iedere maand hetzelfde bedrag. In het begin bestaat
                dit bedrag uit relatief meer rente en minder aflossing; naarmate de looptijd vordert
                verschuift die verhouding.
              </p>
            </div>
          </div>
          <div className="card flex gap-4 p-6">
            <IconShield className="h-8 w-8 shrink-0 text-copper" />
            <div>
              <h3 className="text-base font-bold text-anthracite-700">Indicatief, niet bindend</h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite-500">
                De getoonde bedragen zijn een indicatie op basis van een voorbeeldrente van 7% per jaar.
                Onze financier voert een kredietwaardigheidscheck uit om te bepalen of het betaalplan
                past bij uw situatie; pas daarna volgt een concreet en definitief aanbod.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-anthracite-700 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-white">
            <IconCheck className="h-6 w-6 text-copper-300" />
            <p className="text-sm">Wilt u een berekening op maat bespreken met een adviseur?</p>
          </div>
          <Link href="/contact" className="btn-primary">
            Neem contact op
          </Link>
        </div>
      </section>
    </div>
  );
}
