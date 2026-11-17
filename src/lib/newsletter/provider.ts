import "server-only";
import type { NewsletterSubscription } from "./schema";
import { saveNewsletterSignup } from "./repository";

// El modo database guarda solicitudes pendientes. El adaptador HTTPS queda
// disponible cuando el cliente elija un servicio de correo con confirmación.
export async function subscribe(subscription: NewsletterSubscription): Promise<"accepted" | "unavailable"> {
  if (process.env.NEWSLETTER_MODE === "database") {
    try { await saveNewsletterSignup(subscription); return "accepted"; }
    catch { return "unavailable"; }
  }
  const endpoint = process.env.NEWSLETTER_ENDPOINT;
  const token = process.env.NEWSLETTER_TOKEN;
  if (!endpoint || !token) return "unavailable";
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return "unavailable";
  }
  if (url.protocol !== "https:" || url.username || url.password) return "unavailable";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(subscription),
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? "accepted" : "unavailable";
  } catch {
    return "unavailable";
  }
}
