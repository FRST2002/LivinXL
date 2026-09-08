# LivinXL

Website voor LivinXL, aluminium veranda's op maat. Gebouwd met Next.js (App Router), TypeScript en Tailwind CSS.

## Starten

Dit project vereist Node.js 18.18+ (niet aanwezig op deze machine tijdens het bouwen — installeer Node.js en voer daarna onderstaande commando's uit).

```bash
npm install
npm run dev
```

Open vervolgens [http://localhost:3000](http://localhost:3000).

## Paginastructuur

- `/` — Homepage
- `/product/vista` — Productpagina LivinXL Vista
- `/projecten` — Projecten
- `/werkwijze` — Werkwijze
- `/financiering` — Financieringsrekentool (annuïtair, tot 180 maanden)
- `/dealer-worden` — Dealer worden (aanmeldformulier)
- `/contact` — Contactformulier
- `/faq` — Veelgestelde vragen
- `/offerte` — Offerteformulier (neemt configuratie over vanuit de configurator)
- `/configurator` — Werkende verandaconfigurator met live prijsindicatie en financiering

## Belangrijkste logica

- `lib/pricing.ts` — configuratie-opties en het prijsmodel (indicatieve richtprijs € 7.000 – € 12.000)
- `lib/finance.ts` — annuïtaire berekening (standaard 7% indicatieve jaarrente, looptijd tot 180 maanden)

De formulieren (`/offerte`, `/dealer-worden`, `/contact`) posten naar eenvoudige API-routes
(`app/api/*/route.ts`) die de invoer valideren en een bevestiging teruggeven. Voor productiegebruik
kunnen deze routes worden gekoppeld aan e-mail of een CRM.
