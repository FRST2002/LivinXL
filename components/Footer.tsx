import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product/vista", label: "LivinXL Vista" },
      { href: "/configurator", label: "Configurator" },
      { href: "/projecten", label: "Projecten" },
      { href: "/werkwijze", label: "Werkwijze" },
    ],
  },
  {
    title: "Bedrijf",
    links: [
      { href: "/dealer-worden", label: "Dealer worden" },
      { href: "/#termijnbetaling", label: "Betaal in termijnen" },
      { href: "/faq", label: "Veelgestelde vragen" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-anthracite-700/10 bg-anthracite-700 text-offwhite-200 print:hidden">
      <div className="container-page grid grid-cols-1 gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="text-2xl font-extrabold tracking-tightest text-white">
            Livin<span className="text-copper-300">XL</span>
          </span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-offwhite-300/80">
            LivinXL levert en monteert aluminium veranda&apos;s op maat, ontworpen om uw
            buitenruimte het hele jaar door bruikbaar te maken.
          </p>
          <p className="mt-6 text-lg font-semibold text-copper-200">
            Meer ruimte. Zelfde adres.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-offwhite-400/70">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite-300/90 transition-colors hover:text-copper-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-offwhite-400/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} LivinXL. Alle rechten voorbehouden.</p>
          <p>Aluminium veranda&apos;s op maat &mdash; ontwerp, levering en montage.</p>
        </div>
      </div>
    </footer>
  );
}
