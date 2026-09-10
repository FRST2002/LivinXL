import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="bg-anthracite-700">
      <div className="container-page flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="eyebrow text-copper-300">Aan de slag</span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tightest text-white sm:text-4xl">
            Ontdek in twee minuten uw investering
          </h2>
          <p className="mt-4 text-base leading-relaxed text-offwhite-300/80">
            Stel uw LivinXL Vista samen in de configurator en bekijk direct de prijs en een
            indicatief maandbedrag — desgewenst te betalen in termijnen tot 180 maanden.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/configurator" className="btn-primary">
            Open de configurator
          </Link>
          <Link
            href="/#termijnbetaling"
            className="btn border border-white/20 bg-transparent text-white hover:border-white/50"
          >
            Betaal in termijnen
          </Link>
        </div>
      </div>
    </section>
  );
}
