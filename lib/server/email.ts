import { Resend } from "resend";
import { formatCurrency } from "@/lib/finance";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "LivinXL Website <noreply@livinxl.nl>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "info@livinxl.nl";

// Named differently from "RESEND_API_KEY" on purpose: that exact variable name
// got stuck on the Vercel project (kept reading as unset even after being
// deleted and recreated several times, while every other variable name works
// fine) — using a fresh name sidesteps whatever is wrong with that one.
function getClient(): Resend | null {
  const apiKey = process.env.RESEND_KEY_LIVINXL;
  if (!apiKey) {
    console.error("RESEND_KEY_LIVINXL ontbreekt in deze omgeving — e-mail wordt overgeslagen.");
    return null;
  }
  return new Resend(apiKey);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapEmail(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #26292E;">
      <div style="padding: 20px 0; border-bottom: 2px solid #B57544;">
        <span style="font-size: 22px; font-weight: 800;">Livin<span style="color:#B57544;">XL</span></span>
      </div>
      <h1 style="font-size: 18px; margin: 20px 0 10px;">${title}</h1>
      ${bodyHtml}
    </div>
  `;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #6C6F76; font-size: 13px; white-space: nowrap; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 6px 0; font-size: 13px;">${value}</td>
    </tr>
  `;
}

export interface OfferteEmailInput {
  offerteNummer: string;
  datum: string;
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  postcode: string;
  plaats: string;
  model: string;
  periode: string;
  opmerkingen: string;
  configuratieLines: string[];
  prijs: number | null;
}

export async function sendOfferteEmail(input: OfferteEmailInput): Promise<void> {
  const client = getClient();
  if (!client) return; // RESEND_KEY_LIVINXL not configured — skip silently, don't block the form.

  const klantRows = [
    row("Naam", escapeHtml(input.naam)),
    row("E-mail", `<a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a>`),
    row("Telefoon", escapeHtml(input.telefoon)),
    row("Adres", escapeHtml([input.adres, input.postcode, input.plaats].filter(Boolean).join(", "))),
    row("Model", escapeHtml(input.model)),
    row("Gewenste periode", escapeHtml(input.periode)),
  ].join("");

  const configuratieHtml =
    input.configuratieLines.length > 0
      ? `<ul style="padding-left: 18px; font-size: 13px;">${input.configuratieLines
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join("")}</ul>`
      : `<p style="font-size: 13px; color: #6C6F76;">Geen configuratie meegegeven (rechtstreeks offerteformulier).</p>`;

  const prijsHtml =
    input.prijs != null
      ? `<table style="margin-top: 8px;">${row("Totaalbedrag veranda", `<strong>${formatCurrency(input.prijs)}</strong>`)}</table>`
      : "";

  const opmerkingenHtml = input.opmerkingen
    ? `<p style="font-size: 13px; white-space: pre-line;">${escapeHtml(input.opmerkingen)}</p>`
    : "";

  const html = wrapEmail(`Nieuwe offerteaanvraag &middot; ${input.offerteNummer}`, `
    <p style="font-size: 13px; color: #6C6F76;">${escapeHtml(input.datum)}</p>
    <h2 style="font-size: 14px; margin: 20px 0 6px;">Klantgegevens</h2>
    <table>${klantRows}</table>
    <h2 style="font-size: 14px; margin: 20px 0 6px;">Configuratie</h2>
    ${configuratieHtml}
    <h2 style="font-size: 14px; margin: 20px 0 6px;">Prijs</h2>
    ${prijsHtml || `<p style="font-size: 13px; color: #6C6F76;">Geen prijs meegegeven.</p>`}
    ${opmerkingenHtml ? `<h2 style="font-size: 14px; margin: 20px 0 6px;">Opmerkingen</h2>${opmerkingenHtml}` : ""}
  `);

  await client.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `Nieuwe offerteaanvraag — ${input.naam} (${input.offerteNummer})`,
    html,
  });
}

export interface ContactEmailInput {
  naam: string;
  email: string;
  telefoon: string;
  onderwerp: string;
  bericht: string;
}

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const client = getClient();
  if (!client) return;

  const rows = [
    row("Naam", escapeHtml(input.naam)),
    row("E-mail", `<a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a>`),
    row("Telefoon", escapeHtml(input.telefoon || "-")),
    row("Onderwerp", escapeHtml(input.onderwerp)),
  ].join("");

  const html = wrapEmail("Nieuw contactformulier", `
    <table>${rows}</table>
    <h2 style="font-size: 14px; margin: 20px 0 6px;">Bericht</h2>
    <p style="font-size: 13px; white-space: pre-line;">${escapeHtml(input.bericht)}</p>
  `);

  await client.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `Nieuw contactformulier — ${input.onderwerp} (${input.naam})`,
    html,
  });
}
