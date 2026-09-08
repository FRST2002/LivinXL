import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import DealerForm from "@/components/DealerForm";
import { IconCheck, IconCoins, IconShield, IconTruck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Dealer worden",
  description: "Word LivinXL dealer en bied de LivinXL Vista aluminium veranda aan in uw regio.",
};

const BENEFITS = [
  {
    icon: IconShield,
    title: "Een sterk, herkenbaar product",
    description: "De LivinXL Vista is een compleet, modulair systeem met een duidelijke merkidentiteit.",
  },
  {
    icon: IconTruck,
    title: "Betrouwbare levering",
    description: "Heldere productie- en levertijden, zodat u uw klanten goed kunt informeren.",
  },
  {
    icon: IconCoins,
    title: "Aantrekkelijke marges",
    description: "Een dealerstructuur die ruimte laat voor een gezonde marge op ieder project.",
  },
  {
    icon: IconCheck,
    title: "Ondersteuning op maat",
    description: "Ondersteuning bij configuratie, calculatie en technische vragen tijdens het traject.",
  },
];

export default function DealerWordenPage() {
  return (
    <div>
      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Dealer worden"
          title="Word LivinXL dealer in uw regio"
          description="Bent u actief in de bouw, tuininrichting of aanverwante branche en wilt u de LivinXL Vista aan uw klanten aanbieden? Meld u aan als dealer. Dankzij onze termijnbetaling tot 180 maanden sluit u als dealer makkelijker deals: uw klant hoeft niet in één keer af te rekenen."
        />
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="card p-6">
                <benefit.icon className="h-8 w-8 text-copper" />
                <h3 className="mt-4 text-base font-bold text-anthracite-700">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Aanmelden" title="Meld uw bedrijf aan als LivinXL dealer" />
        <div className="mt-10 max-w-3xl">
          <DealerForm />
        </div>
      </section>
    </div>
  );
}
