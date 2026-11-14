import { requestHasAdminSession, requestHasExpectedOrigin } from "@/lib/forms/admin-auth";
import { archiveForm, getFormSubmissions, retryPendingSheetSyncs } from "@/lib/forms/repository";
import { readBoundedJson } from "@/lib/forms/request";

export const runtime = "nodejs";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  const { slug } = await params;
  if (!slugPattern.test(slug)) return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
  try { return Response.json({ submissions: await getFormSubmissions(slug) }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudieron cargar las respuestas." }, { status: 503 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  const { slug } = await params;
  if (!slugPattern.test(slug)) return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
  let action: unknown;
  try { action = (await readBoundedJson(request, 2048) as { action?: unknown }).action; }
  catch (error) { return Response.json({ error: "Solicitud inválida." }, { status: error instanceof Error && error.message === "body_too_large" ? 413 : 400 }); }
  try {
    if (action === "archive") {
      const archived = await archiveForm(slug);
      return archived ? Response.json({ success: true }) : Response.json({ error: "Formulario no encontrado." }, { status: 404 });
    }
    if (action === "retry-sheets") return Response.json({ retried: await retryPendingSheetSyncs(slug) });
    return Response.json({ error: "Acción inválida." }, { status: 422 });
  } catch {
    return Response.json({ error: "No se pudo completar la acción." }, { status: 503 });
  }
}
