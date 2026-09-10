# LivinXL

Website voor LivinXL, aluminium veranda's op maat. Gebouwd met Next.js (App Router), TypeScript en Tailwind CSS.

## Starten

Dit project vereist Node.js 18.18+.

```bash
npm install
npm run dev
```

Open vervolgens [http://localhost:3000](http://localhost:3000).

## Paginastructuur

- `/` — Homepage (bevat ook de financieringsrekentool, onder `#termijnbetaling`)
- `/product/vista` — Productpagina LivinXL Vista
- `/projecten` — Projecten
- `/werkwijze` — Werkwijze
- `/dealer-worden` — Dealer worden (aanmeldformulier)
- `/contact` — Contactformulier
- `/faq` — Veelgestelde vragen
- `/offerte` — Offerteformulier (neemt configuratie over vanuit de configurator)
- `/configurator` — Werkende verandaconfigurator; de prijs is vertroebeld totdat een offerte is aangevraagd

## Belangrijkste logica

- `lib/pricing.ts` — configuratie-opties (afmetingen, dakmateriaal, kleuren, posities)
- `lib/server/verandaPrijzen.ts` — de daadwerkelijke prijsberekening (verkoopprijs = 220% van de inkoopprijs). Dit
  bestand mag nooit vanuit een "use client"-component worden geïmporteerd; alleen
  `app/api/prijs/route.ts` roept het aan, zodat inkoopprijzen nooit in de browser terechtkomen.
- `lib/finance.ts` — annuïtaire berekening (standaard 7% indicatieve jaarrente, looptijd tot 180 maanden)

De formulieren (`/offerte`, `/dealer-worden`, `/contact`) posten naar eenvoudige API-routes
(`app/api/*/route.ts`) die de invoer valideren en een bevestiging teruggeven.

`/offerte` en `/contact` sturen daarnaast (via `lib/server/email.ts` en de [Resend](https://resend.com)
API) een e-mail met de volledige aanvraag naar `info@livinxl.nl`. Dit vereist een `RESEND_KEY_LIVINXL`
environment variable (zie `.env.example`; bewust niet "RESEND_API_KEY" genoemd, zie CLAUDE.md) — zonder
die key werken de formulieren nog gewoon, maar wordt
er geen e-mail verstuurd. `/dealer-worden` heeft nog geen e-mail-/CRM-koppeling.
