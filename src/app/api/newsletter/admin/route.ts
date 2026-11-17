import { requestHasAdminSession } from "@/lib/forms/admin-auth";
import { listNewsletterSignups } from "@/lib/newsletter/repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  try { return Response.json({ subscribers: await listNewsletterSignups() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudieron cargar las suscripciones." }, { status: 503 }); }
}
