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

- `lib/pricing.ts` — configurator option definitions only (roof materials, frame colors, screen positions,
  limits, `ConfiguratorState`). `configuratorStateToQuery()` serializes the current configuration (summary,
  price, and width/depth) into URL query params consumed by `/offerte`. No purchase prices or pricing math
  live here.
- `lib/server/verandaPrijzen.ts` — holds the real MB Aluminium Partners purchase-price tables (frame+roof
  by width/depth, schuifwanden per panel, zijwanden, screens, led) and `berekenVerkoopprijs()`, which sums
  the relevant purchase prices and multiplies the total by 2.2 (sell price = 220% of purchase price), and
  returns `{ prijs, onvolledigeOnderdelen }`. **This file must never be imported from a
  "use client" component** — doing so would ship purchase prices into the browser bundle. It is only
  imported by `app/api/prijs/route.ts`, a POST route handler that takes a configuration and returns that
  same `{ prijs, onvolledigeOnderdelen }` shape — never the underlying cost breakdown. (Ideally the
  `server-only` package would enforce this boundary at build time; it isn't installed here, so it's enforced
  by convention only — don't undo that by importing `verandaPrijzen.ts` from client code.)
- **Zijwanden and "spie" are photo-based material pickers, each fully priced.** Each side
  (`zijwandLinks`/`zijwandRechts` in `ConfiguratorState`, `lib/pricing.ts`) has two independent material
  choices, each rendered as a photo grid (see `MateriaalPicker` in `Configurator.tsx`, photos in
  `public/wandopties/`): a **zijwand** material (`geen` / `polycarbonaat` / `aluminium` / `schuifwanden`)
  and a **spie** material (`geen` / `polycarbonaat` / `aluminium` / `glas`) — the spie is the gable-shaped
  panel above the zijwand, under the sloped roof edge. Whenever `zijwandLinks.materiaal` (or
  `zijwandRechts.materiaal`) is not `"geen"`, its `.spie` is not allowed to be `"geen"` either — a chosen
  wall always needs a spie choice, enforced in `Configurator.tsx` (switching the wall material away from
  `"geen"` auto-picks a non-`"geen"` spie if one isn't already set, and the spie picker hides the `"geen"`
  option while a wall material is selected). `voorkant` (front) is simpler: just `geen` or `schuifwanden`
  (no spie, no material choice). All of these (`ZIJWAND_POLYCARBONAAT`, `ZIJWAND_ALUMINIUM`,
  `SPIE_POLYCARBONAAT`, `SPIE_ALUMINIUM`, `SPIE_GLAS` in `verandaPrijzen.ts`) now have real MB Aluminium
  Partners purchase prices; note `SPIE_ALUMINIUM` uses the supplier's "20cm profiel" column (there's also
  an unused "16cm profiel" column — the configurator has no profile-width selector, so this is a
  deliberate simplification, not a data gap). `zijwandInkoop`/`spieInkoop` still have an "onbekend"
  fallback (returns €0 and reports the label via `onvolledigeOnderdelen`, which the configurator surfaces
  as "Prijs voor … wordt door onze adviseur definitief bepaald") for whichever future material shows up
  with no purchase price transcribed yet — per this project's rule against ever guessing real supplier
  numbers, don't remove that fallback even though every current option is priced.
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
`onAmountChange`), and inside `Configurator` (`compact`, amount fixed to the configurator's calculated
price). It never shows interest cost — only the monthly payment — anywhere on the site. It accepts an
optional `onChange` callback that reports the current
`{ principal, downPayment, termMonths, monthlyPayment }` whenever the calculation changes.

### Price is deliberately blurred until a customer submits an offerte (lead-gen gate)

This is intentional product behavior, not a bug: `Configurator` never renders `FinancingCalculator` at
all, and blurs its own price number (`blur-md` + a copper "Vraag een offerte aan om uw prijs te zien"
pill overlaid via `IconLock`) — the price is still computed and present in the DOM (via `usePrijs`), just
visually obscured, so this is a soft/marketing gate, not real data protection (unlike the purchase-price
hiding described above, which is a hard requirement). `QuoteForm`'s pre-submission "your configuration"
preview blurs the price the same way. The reasoning (per the person who owns this site): the monthly
payment isn't meaningful to LivinXL itself since the financier decides real terms anyway, so there's no
downside to only letting customers explore it *after* they've left contact details — every visitor who
wants a number has to submit the lead form first. The homepage/`#termijnbetaling` calculator
(`FinancingStandalone`) is deliberately **not** gated — it's a generic trust-building tool untied to any
specific configuration, so gating it wouldn't make sense.

### Configurator → offerte data flow

`Configurator` (`/configurator`) builds an `/offerte?...` link via `configuratorStateToQuery`, carrying
the price, a human-readable config summary, and width/depth. `QuoteForm.tsx` (`/offerte`) reads these
query params (`useSearchParams`, hence the page wraps it in `<Suspense>`) to show a read-only, still-
blurred "your configuration" preview before submission. After a customer submits their contact details,
`QuoteForm` renders a full on-screen "offerte" (quote) document — customer details, configuration, total
price now unblurred — followed by a live, interactive `FinancingCalculator` so the customer can shape
their own monthly payment (interest is intentionally never shown anywhere in this flow). An "Offerte
opslaan" button calls `window.print()`; printing is scoped to just the quote via Tailwind's `print:hidden`
utility on `Header`, `Footer`, and the page's intro section — there is no PDF library involved. Since the
live calculator's sliders don't make sense on paper, they're `print:hidden` and a static one-line summary
of the customer's current selection (`hidden print:block`) takes their place when printing. The offerte
number/date shown to the customer is generated **server-side** in `app/api/offerte/route.ts` and returned
in the response (`QuoteForm` uses that value, it does not generate its own) — this keeps it identical to
the number used in the internal notification email described below.

### Forms validate, then (for offerte/contact) email the team via Resend

`components/{QuoteForm,ContactForm,DealerForm}.tsx` POST to `app/api/{offerte,contact,dealer}/route.ts`,
which validate required fields and return `{ok:true}` (offerte also returns `{offerteNummer, datum}`).
The offerte and contact routes additionally call `lib/server/email.ts` (`sendOfferteEmail` /
`sendContactEmail`), which uses the `resend` package to email the full submission — for offerte, this
includes the customer's details, the configuration summary, and the price/monthly payment, i.e. the same
content the customer sees in their on-screen offerte — to `RESEND_TO_EMAIL` (default `info@livinxl.nl`).
This requires a `RESEND_KEY_LIVINXL` environment variable (see `.env.example`); if it's unset,
`getClient()` returns `null` and the email is silently skipped — forms still succeed for the customer
either way, and email failures are caught and logged, never surfaced as a form error. Note the variable
is deliberately **not** named `RESEND_API_KEY`: on this project's Vercel dashboard that exact name kept
reverting to unset (deleted/recreated multiple times, across both "Secret" and "Config" types, redeployed
each time, confirmed via a temporary `/api/debug-env` route and Vercel's runtime logs) while every other
variable name worked immediately — so don't rename it back without re-verifying against
`/api/debug-env` first. `/dealer-worden` has no email integration yet.

### Offertes are persisted to Postgres (Neon) and reviewable at /admin

`app/api/offerte/route.ts` also calls `lib/server/db.ts`'s `saveOfferte()` right after (not instead of)
`sendOfferteEmail()`, in its own try/catch — a database hiccup must never fail the customer's submission,
same principle as the email send. `lib/server/db.ts` uses `@neondatabase/serverless` (the modern
replacement for the now-deprecated `@vercel/postgres`) against a Neon Postgres database provisioned via
Vercel's Storage integration; it reads `DATABASE_URL` (falling back to `POSTGRES_URL`), lazily runs a
`CREATE TABLE IF NOT EXISTS offertes (...)` the first time it's used per warm instance, and exposes
`saveOfferte`/`listOffertes`/`getOfferteById`. **This file must never be imported from a "use client"
component** — same reasoning as `verandaPrijzen.ts` above, though here it's a raw DB connection string
rather than purchase prices.

`/admin` (list, newest first) and `/admin/[id]` (detail — customer info + configuration + price, i.e. the
same content as the customer's on-screen offerte) are Server Components that call these functions
directly. Both explicitly set `dynamic = "force-dynamic"`, `revalidate = 0`, **and**
`fetchCache = "force-no-store"` — during development, `force-dynamic` alone was not enough to stop Next
from caching the Neon driver's internal `fetch()` call (it kept serving the first, pre-any-data render),
so don't remove the other two even though they look redundant.

Access is gated by `middleware.ts` (matches `/admin/:path*`, redirects to `/admin/login` unless a valid
session cookie is present) plus `lib/server/adminAuth.ts`, which does the credential check
(`ADMIN_USERNAME`/`ADMIN_PASSWORD`, plain string compare — there's exactly one admin account, so a
password hash felt like overkill) and signs/verifies the session cookie with `ADMIN_SESSION_SECRET` using
the Web Crypto API (`crypto.subtle`) rather than Node's `crypto` module, specifically so the same code
works in `middleware.ts` (Edge runtime) and in `app/api/admin/{login,logout}/route.ts` (Node runtime). All
three env vars are deliberately **not** hardcoded in source — this repo is on GitHub, and a literal
password/secret in a commit is a password/secret leaked to anyone with repo access.

### Every form also forwards to GoHighLevel via an inbound webhook

`lib/server/ghl.ts`'s `sendToGhl(formulier, data)` POSTs `{ formulier, ...data }` (where `formulier` is
`"offerte" | "contact" | "dealer"`) to `GHL_WEBHOOK_URL` — a GoHighLevel Workflow configured with an
"Inbound Webhook" trigger. This project deliberately does **not** talk to the GHL REST API directly (no
OAuth/API-token handling here): GHL itself owns all the CRM logic (create/update contact, tags, pipeline
stage) inside the workflow the webhook triggers, so this file has zero GHL-schema knowledge — it just
forwards the same data that already goes into the internal notification e-mail (and, for offertes, the
database). All three `app/api/{offerte,contact,dealer}/route.ts` call it in their own try/catch, after
their existing email/DB calls, same non-blocking principle: a GHL hiccup must never fail the customer's
submission. Without `GHL_WEBHOOK_URL` set, the call silently no-ops (logged, not surfaced).

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
