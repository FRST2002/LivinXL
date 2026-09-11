/**
 * Forwards form submissions to a GoHighLevel "Inbound Webhook" workflow trigger.
 * GHL itself decides what happens with the payload (create/update a contact, add a
 * tag, move a pipeline stage, etc.) — this file has no GHL-specific schema
 * knowledge, it just posts the same data the internal notification e-mail gets.
 *
 * Requires a GHL_WEBHOOK_URL environment variable (see .env.example); if it's
 * unset, the call is silently skipped — forms still succeed for the customer
 * either way, same principle as the Resend e-mail and database save.
 */
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;

export type GhlFormulier = "offerte" | "contact" | "dealer";

export async function sendToGhl(formulier: GhlFormulier, data: Record<string, unknown>): Promise<void> {
  if (!GHL_WEBHOOK_URL) {
    console.error("GHL_WEBHOOK_URL ontbreekt — aanvraag wordt niet doorgestuurd naar GoHighLevel.");
    return;
  }

  const response = await fetch(GHL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formulier, ...data }),
  });

  if (!response.ok) {
    throw new Error(`GHL-webhook antwoordde met status ${response.status}`);
  }
}
