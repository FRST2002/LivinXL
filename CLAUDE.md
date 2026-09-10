# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LivinXL is a marketing + configurator website for a made-to-measure aluminium veranda brand, built with
Next.js 14 (App Router), TypeScript, and Tailwind CSS. All UI copy is in Dutch.

## Commands

```bash
npm install
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm run start   # run the production build
npm run lint    # next lint (eslint-config-next)
```

Requires Node.js 18.18+. There is no test suite and no test script configured — don't assume Jest/Vitest
exists. `npx tsc --noEmit` can be used for a standalone type-check.

## Architecture

### Pricing is real (cost + margin), calculated server-side only

- `lib/pricing.ts` — configurator option definitions only (roof materials, frame colors, wall/screen
  positions, limits, `ConfiguratorState`). `configuratorStateToQuery()` serializes the current
  configuration (summary, price, and optionally the chosen monthly payment/term) into URL query params
  consumed by `/offerte`. No purchase prices or pricing math live here.
- `lib/server/verandaPrijzen.ts` — holds the real MB Aluminium Partners purchase-price tables (frame+roof
  by width/depth, schuifwanden per panel, zijwanden, screens, led) and `berekenVerkoopprijs()`, which sums
  the relevant purchase prices and multiplies the total by 2.2 (sell price = 220% of purchase price). **This file must never be imported from a
  "use client" component** — doing so would ship purchase prices into the browser bundle. It is only
  imported by `app/api/prijs/route.ts`, a POST route handler that takes a configuration and returns just
  `{ prijs }` — never the underlying cost breakdown. (Ideally the `server-only` package would enforce this
  boundary at build time; it isn't installed here, so it's enforced by convention only — don't undo that by
  importing `verandaPrijzen.ts` from client code.)
- `components/Configurator.tsx` fetches `/api/prijs` on a 300ms debounce whenever the configuration
  changes (see its local `usePrijs` hook) instead of computing a price synchronously — expect a brief
  "wordt herberekend..." state after each change, not an instant number.
- `lib/finance.ts` — `calculateAnnuity()`, a standalone annuity calculation (7% default indicative rate, up
  to 180 months), plus `nl-NL` currency formatters. Independent of the pricing model above; any page can
  finance any amount. `PRICE_MIN`/`PRICE_MAX` in `lib/pricing.ts` (€7.000–€12.000) are only used as slider
  bounds for the generic, configuration-independent calculator on the homepage (`FinancingStandalone`) —
  they are not, and should not be presented as, the real achievable price range.

### FinancingCalculator is the one reusable financing widget

There is no standalone `/financiering` page — it was removed; the financing calculator lives inline on the
homepage under the `#termijnbetaling` section id, and every link that used to point to `/financiering`
(footer, CtaBanner, other pages' badges/CTAs) now points to `/#termijnbetaling` instead.
`components/FinancingCalculator.tsx` holds its own `downPayment`/`termMonths` state and is used in two
places with different props: the homepage (`FinancingStandalone`, amount is user-editable via
`onAmountChange`), and inside `Configurator` (`compact`, `showInterest={false}`, amount fixed to the
configurator's calculated price). It accepts an optional `onChange` callback that reports the current
`{ principal, downPayment, termMonths, monthlyPayment }` whenever the calculation changes — this is how
`Configurator` captures the customer's chosen monthly payment to forward to the offerte flow, without lifting
the calculator's internal state up.

### Configurator → offerte data flow

`Configurator` (`/configurator`) builds an `/offerte?...` link via `configuratorStateToQuery`, carrying the
price, a human-readable config summary, and the selected monthly payment/term. `QuoteForm.tsx` (`/offerte`)
reads these query params (`useSearchParams`, hence the page wraps it in `<Suspense>`) to show a read-only
"your configuration" preview before submission. After a customer submits their contact details, `QuoteForm`
renders a full on-screen "offerte" (quote) document (customer details, configuration, total price, monthly
payment — interest is intentionally never shown here) with an "Offerte opslaan" button that calls
`window.print()`. Printing is scoped to just the quote via Tailwind's `print:hidden` utility on `Header`,
`Footer`, and the page's intro section — there is no PDF library involved.

### Forms are validate-only stubs

`components/{QuoteForm,ContactForm,DealerForm}.tsx` POST to `app/api/{offerte,contact,dealer}/route.ts`.
Each route only checks required fields are present and returns `{ok:true}` — there is no email or CRM
integration yet. No environment variables or database are involved anywhere in this app.

### Styling

Design tokens (the `anthracite`/`copper`/`offwhite` palette, `tracking-tightest`, custom shadows) live in
`tailwind.config.ts`. Reusable component classes (`.btn-primary`, `.btn-ghost`, `.card`, `.field-input`,
`.eyebrow`, `.container-page`) are defined once in `app/globals.css` under `@layer components` — prefer
these over ad hoc utility strings when styling new UI to stay visually consistent.

### Icons and illustration are hand-built, no external libraries

`components/icons.tsx` is a self-contained set of inline SVG icons (no icon package dependency).
`components/VerandaIllustration.tsx` is a hand-built SVG illustration whose props (`schuifwanden`, `zijwand`,
`led`, `screens`, `frameHex`) let it visually reflect live configurator/product state instead of using stock
photography.

## Deployment

Deployed on Vercel, connected to the `main` branch of `https://github.com/FRST2002/LivinXL` — any push to
`main` auto-deploys. The production domain (`livinxl.nl`) is on DNS hosted elsewhere (DirectAdmin), with only
the web-facing A/CNAME records pointed at Vercel; email (MX, mail/pop/smtp records, SPF/DKIM/DMARC) stays on
the original provider and must not be touched when changing DNS for the site.
