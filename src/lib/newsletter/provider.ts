import "server-only";
import type { NewsletterSubscription } from "./schema";

// Adaptador para un servicio propio de suscripciones. El destino debe aceptar
// JSON y responder 2xx solo después de recibir la solicitud correctamente.
export async function subscribe(subscription: NewsletterSubscription): Promise<"accepted" | "unavailable"> {
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
