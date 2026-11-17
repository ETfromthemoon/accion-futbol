import "server-only";
import postgres from "postgres";
import type { NewsletterSubscription } from "./schema";

let client: ReturnType<typeof postgres> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  return (client ??= postgres(url, { ssl: "require", max: 1, idle_timeout: 20 }));
}

// Se conserva el consentimiento, pero no se marca como contacto confirmado ni se envía correo.
export async function saveNewsletterSignup(subscription: NewsletterSubscription) {
  await database()`INSERT INTO newsletter_signups (email, consent_at, status)
    VALUES (${subscription.email}, now(), 'pending_confirmation')
    ON CONFLICT (email) DO NOTHING`;
}

export async function listNewsletterSignups() {
  const rows = await database()`SELECT email, consent_at, status FROM newsletter_signups ORDER BY consent_at DESC LIMIT 500`;
  return rows.map((row) => ({ email: String(row.email), consentAt: new Date(row.consent_at).toISOString(), status: String(row.status) }));
}
