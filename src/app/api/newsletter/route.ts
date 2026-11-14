import { newsletterSubscriptionSchema } from "@/lib/newsletter/schema";
import { subscribe } from "@/lib/newsletter/provider";

export async function POST(request: Request) {
  if (process.env.NEWSLETTER_ENABLED !== "true") {
    return Response.json({ error: "La suscripción no está disponible." }, { status: 503 });
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 2048) return Response.json({ error: "Solicitud demasiado grande." }, { status: 413 });
  let body: unknown;
  try {
    if (!request.body) return Response.json({ error: "Solicitud inválida." }, { status: 400 });
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        return Response.json({ error: "Solicitud demasiado grande." }, { status: 413 });
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const parsed = newsletterSubscriptionSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Ingresa un correo válido y acepta recibir novedades." }, { status: 422 });
  const result = await subscribe(parsed.data);
  if (result !== "accepted") return Response.json({ error: "La suscripción no está disponible. Inténtalo más tarde." }, { status: 503 });
  return Response.json({ success: true });
}
