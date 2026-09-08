"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/product/vista", label: "LivinXL Vista" },
  { href: "/projecten", label: "Projecten" },
  { href: "/werkwijze", label: "Werkwijze" },
  { href: "/financiering", label: "Betaal in termijnen" },
  { href: "/dealer-worden", label: "Dealer worden" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-anthracite-700/8 bg-offwhite/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tightest text-anthracite-700">
            Livin<span className="text-copper">XL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-copper" : "text-anthracite-600 hover:text-anthracite-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/configurator" className="btn-ghost">
            Configurator
          </Link>
          <Link href="/offerte" className="btn-primary">
            Offerte aanvragen
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-anthracite-700 transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span className={`h-0.5 w-6 bg-anthracite-700 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-anthracite-700 transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-anthracite-700/8 bg-offwhite lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-anthracite-700 hover:bg-anthracite-700/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 px-3">
              <Link href="/configurator" className="btn-ghost w-full">
                Configurator
              </Link>
              <Link href="/offerte" className="btn-primary w-full">
                Offerte aanvragen
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
