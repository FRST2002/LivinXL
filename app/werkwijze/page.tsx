import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import {
  IconArrowRight,
  IconCheck,
  IconCoins,
  IconCompass,
  IconRoof,
  IconRuler,
  IconShield,
  IconWrench,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Werkwijze",
  description:
    "Van configuratie en adviesgesprek tot financiering, inmeten en plaatsing: zo werkt LivinXL aan uw aluminium veranda op maat.",
};

const STEPS = [
  {
    icon: IconRoof,
    title: "Veranda samenstellen",
    description:
      "U kiest een model en stelt uw veranda samen in de configurator, geheel naar eigen wens.",
  },
  {
    icon: IconCompass,
    title: "Adviesgesprek",
    description:
      "Wij nemen contact met u op, bespreken de gekozen opties en stellen de nodige vragen over uw situatie.",
  },
  {
    icon: IconShield,
    title: "Standaardvoorwaarden",
    description:
      "Voldoet uw aanvraag aan de standaardvoorwaarden? Dan wordt u doorverwezen naar onze financier.",
  },
  {
    icon: IconCoins,
    title: "Voorstel van de financier",
    description:
      "De financier stelt een voorstel op aan de hand van uw gekozen of samengestelde model. Wilt u toch nog van model wisselen? Dan bekijkt de financier gelijk de mogelijkheden.",
  },
  {
    icon: IconRuler,
    title: "Inmeten & proforma",
    description:
      "Na goedkeuring door de financier komen wij als specialist bij u op locatie inmeten. Ter plaatse stellen we een proforma samen, die u op locatie tekent — dit is nog zonder verdere gevolgen.",
  },
  {
    icon: IconCheck,
    title: "Definitief akkoord",
    description:
      "De financier neemt opnieuw contact op met het laatste voorstel. Gaat u akkoord, dan is de aanvraag definitief rond.",
  },
  {
    icon: IconWrench,
    title: "Plaatsing",
    description: "Binnen 3 tot 4 weken plaatsen wij uw veranda vakkundig bij u thuis.",
  },
];

export default function WerkwijzePage() {
  return (
    <div>
      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Werkwijze"
          title="Van samenstellen tot plaatsing"
          description="Een helder traject in zeven stappen, inclusief een onafhankelijke financier en een vrijblijvende proforma bij het inmeten."
        />
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <ol className="relative flex flex-col gap-8 border-l border-anthracite-700/10 pl-8 sm:pl-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="absolute -left-[3.05rem] flex h-10 w-10 items-center justify-center rounded-full bg-anthracite-700 text-sm font-bold text-white sm:-left-[3.55rem]">
                {index + 1}
              </span>
              <div className="card flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:gap-6">
                <step.icon className="h-8 w-8 shrink-0 text-copper" />
                <div>
                  <h3 className="text-base font-bold text-anthracite-700">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-8 max-w-3xl text-xs leading-relaxed text-anthracite-400 sm:mx-0">
          Omdat de plaatsing via financiering verloopt, betaalt u rente over het openstaande bedrag.
          Het exacte rentepercentage en de definitieve voorwaarden zijn afhankelijk van uw
          persoonlijke financiële situatie en de gekozen looptijd, en worden door de financier
          bepaald.
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-anthracite-600">Klaar om de eerste stap te zetten?</p>
          <div className="flex gap-3">
            <Link href="/configurator" className="btn-primary">
              Open de configurator
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Plan een adviesgesprek
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
