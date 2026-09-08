import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import FaqAccordion from "@/components/FaqAccordion";
import FinancingStandalone from "@/components/FinancingStandalone";
import { FAQ_ITEMS } from "@/lib/faq";
import {
  IconArrowRight,
  IconBulb,
  IconCheck,
  IconCoins,
  IconCompass,
  IconFlame,
  IconLayers,
  IconLeaf,
  IconRoof,
  IconRuler,
  IconScreen,
  IconShield,
  IconWall,
  IconWrench,
} from "@/components/icons";

const USP_STRIP = [
  { icon: IconRuler, label: "Op maat gemaakt" },
  { icon: IconWrench, label: "Eigen montageteam" },
  { icon: IconCoins, label: "Termijnen tot 180 mnd" },
  { icon: IconCheck, label: "Vrijblijvende proforma" },
];

const WHY_LIVINXL = [
  {
    icon: IconRuler,
    title: "Op maat gemaakt",
    body: "Na uw configuratie komen wij op locatie inmeten, zodat elk profiel precies aansluit op uw woning en situatie.",
  },
  {
    icon: IconWrench,
    title: "Eigen montageteam",
    body: "Van inmeten tot plaatsing: uw veranda wordt door ons eigen montageteam geplaatst, doorgaans binnen 3 tot 4 weken na akkoord.",
  },
  {
    icon: IconShield,
    title: "Transparante indicatieve prijzen",
    body: "De configurator geeft direct een indicatieve richtprijs tussen € 7.000 en € 12.000. De definitieve offerte volgt op basis van uw exacte configuratie.",
  },
  {
    icon: IconCoins,
    title: "Termijnbetaling zonder gedoe",
    body: "Betaal uw veranda in termijnen tot 180 maanden via onze onafhankelijke financier, en los kosteloos en renteloos extra af wanneer u wilt.",
  },
  {
    icon: IconCheck,
    title: "Begeleiding in elke stap",
    body: "Van adviesgesprek en financieringscheck tot de vrijblijvende proforma bij het inmeten: wij begeleiden u door het hele traject.",
  },
];

const FEATURES = [
  { icon: IconRoof, title: "Glas of polycarbonaat", description: "Kies de daksoort die past bij uw lichtinval en budget." },
  { icon: IconLayers, title: "Glazen schuifwanden", description: "Sluit uw veranda volledig af of zet hem open naar de tuin." },
  { icon: IconWall, title: "Zijwanden", description: "Extra beschutting tegen wind met dichte aluminium panelen." },
  { icon: IconBulb, title: "Ledverlichting", description: "Sfeervolle verlichting geïntegreerd in het dakprofiel." },
  { icon: IconScreen, title: "Screens", description: "Elektrische zonwering houdt de veranda koel en comfortabel." },
  { icon: IconFlame, title: "Verwarming", description: "Infrarood verwarming voor gebruik in de koelere maanden." },
];

const PROCESS = [
  { icon: IconRoof, title: "Samenstellen", description: "U configureert uw veranda volledig naar wens." },
  { icon: IconCoins, title: "Adviesgesprek & financier", description: "Wij bespreken de opties; bij akkoord stelt onze financier een voorstel op." },
  { icon: IconRuler, title: "Inmeten & proforma", description: "Na goedkeuring meten wij in en tekent u een vrijblijvende proforma." },
  { icon: IconWrench, title: "Plaatsing", description: "Na definitief akkoord plaatsen wij uw veranda binnen 3 tot 4 weken." },
];

const PROJECTS = [
  {
    src: "/projecten/project-11.jpg",
    alt: "LivinXL veranda met hangstoel, palmen en zonnepanelen op het dak van de woning",
    location: "Eindhoven",
    date: "Juni 2023",
  },
  {
    src: "/projecten/project-04.jpg",
    alt: "LivinXL veranda in de avond met geïntegreerde ledverlichting en eettafel",
    location: "Apeldoorn",
    date: "Augustus 2024",
  },
  {
    src: "/projecten/project-08.jpg",
    alt: "LivinXL veranda met glazen hoekoplossing bij helderblauwe lucht",
    location: "Zwolle",
    date: "April 2024",
  },
];

const TERMIJN_VOORDELEN = [
  {
    icon: IconCoins,
    title: "Direct genieten, gespreid betalen",
    body: "Uw veranda wordt geplaatst zodra u akkoord bent; u betaalt geleidelijk terug in plaats van in één keer een groot bedrag vrij te maken.",
  },
  {
    icon: IconCheck,
    title: "Kosteloos en renteloos extra aflossen",
    body: "Wilt u toch eerder klaar zijn? U lost altijd zonder boete of extra rente een extra bedrag af, wanneer het u uitkomt.",
  },
  {
    icon: IconCompass,
    title: "Zelf uw maandbedrag bepalen",
    body: "Door de looptijd (tot 180 maanden) en een eventuele aanbetaling te kiezen, bepaalt u zelf hoe laag uw maandbedrag start.",
  },
  {
    icon: IconShield,
    title: "Zorgvuldige, onafhankelijke beoordeling",
    body: "Onze financier beoordeelt uw aanvraag op basis van uw persoonlijke situatie, zodat het betaalplan echt bij u past.",
  },
  {
    icon: IconLeaf,
    title: "Uw spaargeld blijft intact",
    body: "Zo hoeft u geen grote som ineens vrij te maken en houdt u financiële ruimte voor andere plannen.",
  },
  {
    icon: IconRuler,
    title: "Vooraf een duidelijke berekening",
    body: "De annuïtaire rekentool laat vooraf precies zien waar u aan toe bent, zodat u niet voor verrassingen komt te staan.",
  },
];

const ONDERSCHEID = [
  {
    label: "Directe prijsindicatie",
    competitor: "Vaak pas na een lang offertetraject",
  },
  {
    label: "Eigen montageteam",
    competitor: "Montage vaak uitbesteed aan derden",
  },
  {
    label: "Betalen in termijnen tot 180 maanden",
    competitor: "Meestal alleen ineens of beperkt te financieren",
  },
  {
    label: "Kosteloos en renteloos extra aflossen",
    competitor: "Vaak boeterente bij vervroegd aflossen",
  },
  {
    label: "Volledig zelf samen te stellen",
    competitor: "Vaste standaardpakketten met weinig keuze",
  },
  {
    label: "Begeleiding in elke stap van het traject",
    competitor: "Losse schakels, weinig overzicht voor de klant",
  },
  {
    label: "Plaatsing binnen 3 tot 4 weken na akkoord",
    competitor: "Vaak maanden wachttijd",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container-page grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="eyebrow">LivinXL Vista</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tightest text-anthracite-700 sm:text-5xl lg:text-6xl">
            Meer ruimte.
            <br />
            Zelfde adres.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-anthracite-500 sm:text-lg">
            LivinXL levert en monteert aluminium veranda&apos;s op maat. Architectonisch strak,
            volledig naar wens samen te stellen en het hele jaar door te gebruiken.
          </p>
          <Link
            href="/financiering"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper-50 px-4 py-2 text-sm font-semibold text-copper-600 transition-colors hover:bg-copper-100"
          >
            <IconCoins className="h-4 w-4" />
            Betaal in termijnen tot 180 maanden
          </Link>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/configurator" className="btn-primary">
              Open de configurator
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/product/vista" className="btn-ghost">
              Ontdek de LivinXL Vista
            </Link>
          </div>
          <p className="mt-6 text-sm text-anthracite-400">
            Indicatieve richtprijs tussen <span className="font-semibold text-anthracite-600">€ 7.000</span> en{" "}
            <span className="font-semibold text-anthracite-600">€ 12.000</span>, inclusief montage — desgewenst
            te betalen in termijnen.{" "}
            <Link href="/financiering" className="font-semibold text-copper hover:text-copper-600">
              Bereken uw maandbedrag
            </Link>
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft">
          <Image
            src="/hero/veranda-voorkant.jpg"
            alt="LivinXL veranda van voren, aluminium frame met glazen wanden tegen een woning"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* USP strip */}
      <section className="border-y border-anthracite-700/8 bg-white py-6">
        <div className="container-page grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {USP_STRIP.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-6 w-6 shrink-0 text-copper" />
              <span className="text-sm font-semibold text-anthracite-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Mogelijkheden"
            title="Volledig naar wens samen te stellen"
            description="De LivinXL Vista is modulair opgebouwd: u bepaalt materiaal, kleur en opties die passen bij uw woning en levensstijl."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6">
                <feature.icon className="h-8 w-8 text-copper" />
                <h3 className="mt-4 text-base font-bold text-anthracite-700">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/product/vista" className="inline-flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-600">
              Bekijk alle specificaties
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Betaal in termijnen */}
      <section className="bg-anthracite-700 py-16 sm:py-24">
        <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-copper-300">Betaal in termijnen</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tightest text-white sm:text-4xl">
              Uw veranda nu, en betaal in termijnen tot 180 maanden
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-offwhite-300/80">
              Bij LivinXL hoeft u niet te wachten of in één keer af te rekenen. Onze
              financieringspartner stelt een voorstel op dat past bij uw situatie — en u bepaalt
              zelf hoe laag het maandbedrag start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/financiering" className="btn-primary">
                Bereken uw maandbedrag
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/werkwijze" className="btn border border-white/20 bg-transparent text-white hover:border-white/50">
                Bekijk de werkwijze
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-5">
              <IconCoins className="h-7 w-7 text-copper-300" />
              <p className="mt-3 text-sm font-semibold text-white">Tot 180 maanden looptijd</p>
              <p className="mt-1 text-xs text-offwhite-300/70">U kiest zelf de looptijd die bij u past.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <IconCheck className="h-7 w-7 text-copper-300" />
              <p className="mt-3 text-sm font-semibold text-white">Kosteloos extra aflossen</p>
              <p className="mt-1 text-xs text-offwhite-300/70">Renteloos en zonder boete, wanneer u wilt.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <IconShield className="h-7 w-7 text-copper-300" />
              <p className="mt-3 text-sm font-semibold text-white">Onafhankelijke financier</p>
              <p className="mt-1 text-xs text-offwhite-300/70">Uw aanvraag wordt zorgvuldig beoordeeld.</p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <IconRoof className="h-7 w-7 text-copper-300" />
              <p className="mt-3 text-sm font-semibold text-white">Direct uw eigen veranda</p>
              <p className="mt-1 text-xs text-offwhite-300/70">Plaatsing binnen 3 tot 4 weken na akkoord.</p>
            </div>
          </div>
        </div>

        <div className="container-page mt-12">
          <p className="mb-4 text-sm font-semibold text-copper-300">
            Benieuwd wat uw maandbedrag wordt? Reken het hieronder direct uit.
          </p>
          <FinancingStandalone />
        </div>
      </section>

      {/* Voordelen termijnbetaling */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Termijnbetaling"
            title="De voordelen van betalen in termijnen"
            description="Spreiden is meer dan alleen makkelijker betalen. Dit zijn de belangrijkste voordelen die klanten noemen wanneer ze hun LivinXL veranda in termijnen betalen."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TERMIJN_VOORDELEN.map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="h-8 w-8 text-copper" />
                <h3 className="mt-4 text-base font-bold text-anthracite-700">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/financiering"
              className="inline-flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-600"
            >
              Bereken uw maandbedrag
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Waarom LivinXL */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Waarom LivinXL"
            title="Waarom kiezen voor LivinXL"
            description="Vijf redenen waarom klanten voor LivinXL kiezen voor hun aluminium veranda op maat."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_LIVINXL.map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="h-8 w-8 text-copper" />
                <h3 className="mt-4 text-base font-bold text-anthracite-700">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onderscheid */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Het verschil"
            title="Wat maakt LivinXL uniek"
            description="Een veranda is een investering voor jaren. Dit is waarom klanten voor LivinXL kiezen in plaats van een gemiddeld verandabedrijf."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-anthracite-700/8 shadow-card">
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 bg-anthracite-700 px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-white sm:gap-x-4 sm:px-8 sm:text-xs">
              <span>Waarop het aankomt</span>
              <span className="text-center text-copper-300">LivinXL</span>
              <span className="text-center text-offwhite-400/70">Gemiddeld verandabedrijf</span>
            </div>
            <div className="divide-y divide-anthracite-700/8 bg-white">
              {ONDERSCHEID.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 px-4 py-5 sm:gap-x-4 sm:px-8"
                >
                  <span className="text-xs font-semibold text-anthracite-700 sm:text-sm">{row.label}</span>
                  <span className="flex justify-center">
                    <IconCheck className="h-5 w-5 text-copper" />
                  </span>
                  <span className="text-center text-[11px] text-anthracite-400 sm:text-xs">{row.competitor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Werkwijze teaser */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Werkwijze"
            title="Van samenstellen tot plaatsing"
            description="Een helder traject, inclusief een onafhankelijke financier en een vrijblijvende proforma bij het inmeten."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="card flex h-full flex-col gap-4 p-6">
                  <step.icon className="h-8 w-8 text-copper" />
                  <div>
                    <span className="text-xs font-semibold text-anthracite-400">STAP {index + 1}</span>
                    <h3 className="mt-1 text-base font-bold text-anthracite-700">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-anthracite-500">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/werkwijze" className="inline-flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-600">
              Bekijk de volledige werkwijze
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Projecten teaser */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Projecten"
            title="Door ons geleverd en gemonteerd"
            description="Elke veranda wordt op maat ontworpen. Onderstaande voorbeelden geven een indruk van de mogelijkheden."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PROJECTS.map((project) => (
              <div key={project.src} className="overflow-hidden rounded-2xl border border-anthracite-700/8 shadow-card">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-anthracite-700">
                    {project.location} &middot; {project.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/projecten" className="inline-flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-600">
              Bekijk alle projecten
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Veelgestelde vragen"
            title="Vooral vragen over termijnbetaling"
            description="Een paar antwoorden vooraf. Staat uw vraag er niet bij? Bekijk alle vragen of neem contact op."
          />
          <div className="mt-10 max-w-3xl">
            <FaqAccordion items={FAQ_ITEMS.slice(0, 4)} />
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-600">
              Bekijk alle vragen
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/financiering" className="btn-primary shrink-0">
              Bereken uw maandbedrag
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
