import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import { IconArrowRight, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Een impressie van door LivinXL geleverde en gemonteerde aluminium veranda's: verschillende configuraties, daksoorten en kleuren.",
};

const PROJECTS = [
  {
    src: "/projecten/project-08.jpg",
    alt: "LivinXL veranda met glazen hoekoplossing bij helderblauwe lucht",
    location: "Zwolle",
    date: "April 2024",
  },
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
    src: "/projecten/project-06.jpg",
    alt: "Ruime LivinXL veranda met bakstenen kolommen, aangesloten op een woning met zonnepanelen",
    location: "Breda",
    date: "Mei 2023",
  },
  {
    src: "/projecten/project-05.jpg",
    alt: "LivinXL veranda met loungeset bij zonsondergang",
    location: "Utrecht",
    date: "Juli 2024",
  },
  {
    src: "/projecten/project-12.jpg",
    alt: "Open LivinXL veranda zonder wanden, symmetrisch tegen een woning geplaatst",
    location: "Groningen",
    date: "Maart 2025",
  },
  {
    src: "/projecten/project-02.jpg",
    alt: "LivinXL veranda met glazen wanden rondom en nieuw aangelegd gazon",
    location: "Nijmegen",
    date: "September 2023",
  },
  {
    src: "/projecten/project-10.jpg",
    alt: "LivinXL veranda met houten eettafel en loungebank",
    location: "Tilburg",
    date: "Juni 2024",
  },
  {
    src: "/projecten/project-09.jpg",
    alt: "LivinXL veranda aangesloten op een woning met zadeldak en border met bloemen",
    location: "Deventer",
    date: "Oktober 2023",
  },
  {
    src: "/projecten/project-01.jpg",
    alt: "LivinXL veranda met zwart aluminium frame en glazen vouwwand in de hoek",
    location: "Almere",
    date: "April 2025",
  },
  {
    src: "/projecten/project-03.jpg",
    alt: "LivinXL veranda met de glazen wand volledig open geschoven",
    location: "Haarlem",
    date: "Augustus 2023",
  },
  {
    src: "/projecten/project-07.jpg",
    alt: "LivinXL veranda met loungeset bij avondlicht en rieten scherm",
    location: "Arnhem",
    date: "Mei 2024",
  },
  {
    src: "/projecten/project-13.jpg",
    alt: "Totaalbeeld van een LivinXL veranda met loungeset, palmen en zonnepanelen",
    location: "Amersfoort",
    date: "Juli 2025",
  },
];

export default function ProjectenPage() {
  return (
    <div>
      <section className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="Projecten"
          title="Door ons geleverd en gemonteerd"
          description="Een impressie van LivinXL Vista veranda's bij onze klanten thuis: verschillende afmetingen, daksoorten, kleuren en indelingen. Iedere veranda wordt op maat ontworpen voor de specifieke situatie. Onderstaande selectie is slechts een greep uit ons werk."
        />
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper-50 px-4 py-2 text-sm font-semibold text-copper-600">
          <IconCheck className="h-4 w-4" />
          50+ projecten gerealiseerd in Nederland en België
        </div>
      </section>

      <section className="container-page pb-16 sm:pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <div
              key={project.src}
              className="overflow-hidden rounded-2xl border border-anthracite-700/8 shadow-card"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-anthracite-600">
            Benieuwd wat een vergelijkbare veranda voor uw woning zou kosten? U betaalt desgewenst
            in termijnen tot 180 maanden.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link href="/#termijnbetaling" className="btn-ghost">
              Betaal in termijnen
            </Link>
            <Link href="/configurator" className="btn-primary">
              Open de configurator
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
