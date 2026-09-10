import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import { FRAME_COLORS } from "@/lib/pricing";
import {
  IconArrowRight,
  IconBulb,
  IconCoins,
  IconLayers,
  IconRoof,
  IconScreen,
  IconWall,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "LivinXL Vista",
  description:
    "De LivinXL Vista is onze aluminium veranda op maat: glas of polycarbonaat dak, glazen schuifwanden, zijwanden, ledverlichting en screens.",
};

const OPTIONS = [
  {
    icon: IconRoof,
    title: "Dakmateriaal",
    description:
      "Kies tussen een polycarbonaat dak voor een gunstige prijs-kwaliteitverhouding of een glazen dak (helder of opaal) voor maximale lichtinval.",
  },
  {
    icon: IconLayers,
    title: "Glazen schuifwanden",
    description:
      "Sluit de veranda geheel of gedeeltelijk af met slanke, glazen schuifwanden die eenvoudig open- en dichtschuiven.",
  },
  {
    icon: IconWall,
    title: "Zijwanden",
    description: "Dichte aluminium zijwanden bieden extra beschutting tegen wind en inkijk.",
  },
  {
    icon: IconBulb,
    title: "Ledverlichting",
    description: "Sfeerverlichting geïntegreerd in het dakprofiel, te bedienen via een schakelaar.",
  },
  {
    icon: IconScreen,
    title: "Screens",
    description: "Elektrisch bediende screens houden de veranda koel en beschermen tegen felle zon.",
  },
];

const SPECS = [
  { label: "Materiaal frame", value: "Aluminium, poedergecoat" },
  { label: "Breedte", value: "300 &ndash; 700 cm" },
  { label: "Diepte", value: "250 &ndash; 500 cm" },
  { label: "Dakmateriaal", value: "Polycarbonaat of glas (helder / opaal)" },
  { label: "Kleuren", value: FRAME_COLORS.map((c) => `${c.label} (${c.ral})`).join(", ") },
  { label: "Montage", value: "Door eigen montageteam" },
];

export default function VistaPage() {
  return (
    <div>
      <section className="container-page grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Ons model</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tightest text-anthracite-700 sm:text-5xl">
            LivinXL Vista
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-anthracite-500 sm:text-lg">
            De LivinXL Vista is onze aluminium veranda op maat. Strak, architectonisch en volledig
            samen te stellen: van dakmateriaal tot verlichting, zodat de veranda past bij uw woning
            en uw manier van buiten leven.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/configurator" className="btn-primary">
              Stel uw Vista samen
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/offerte" className="btn-ghost">
              Offerte aanvragen
            </Link>
          </div>
          <Link
            href="/#termijnbetaling"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper-50 px-4 py-2 text-sm font-semibold text-copper-600 transition-colors hover:bg-copper-100"
          >
            <IconCoins className="h-4 w-4" />
            Betaal uw Vista in termijnen tot 180 maanden
          </Link>
        </div>
        <div className="relative aspect-[1483/1061] w-full overflow-hidden rounded-2xl shadow-soft">
          <Image
            src="/vistaheader.png"
            alt="LivinXL Vista veranda met loungeset, aangebouwd aan een woning"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Mogelijkheden" title="Vrijheid in materiaal, kleur en opties" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OPTIONS.map((option) => (
              <div key={option.title} className="card p-6">
                <option.icon className="h-8 w-8 text-copper" />
                <h3 className="mt-4 text-base font-bold text-anthracite-700">{option.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Specificaties" title="LivinXL Vista in het kort" />
            <dl className="mt-8 divide-y divide-anthracite-700/8 border-y border-anthracite-700/8">
              {SPECS.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 gap-4 py-4">
                  <dt className="text-sm font-semibold text-anthracite-700">{spec.label}</dt>
                  <dd
                    className="text-sm text-anthracite-500"
                    dangerouslySetInnerHTML={{ __html: spec.value }}
                  />
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHeading eyebrow="Kleuren" title="Kies een RAL-kleur die past bij uw woning" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {FRAME_COLORS.map((color) => (
                <div key={color.id} className="card flex items-center gap-3 p-4">
                  <span className="h-10 w-10 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                  <div>
                    <p className="text-sm font-semibold text-anthracite-700">{color.label}</p>
                    <p className="text-xs text-anthracite-400">{color.ral}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
