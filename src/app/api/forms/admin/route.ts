import { requestHasAdminSession, requestHasExpectedOrigin } from "@/lib/forms/admin-auth";
import { listForms, saveFormDefinition } from "@/lib/forms/repository";
import { readBoundedJson } from "@/lib/forms/request";

export const runtime = "nodejs";

function authorized(request: Request) {
  return requestHasAdminSession(request);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  try { return Response.json({ forms: await listForms() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudieron cargar los formularios." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  let definition: unknown;
  try { definition = await readBoundedJson(request, 32_768); }
  catch (error) { return Response.json({ error: "Definición inválida." }, { status: error instanceof Error && error.message === "body_too_large" ? 413 : 400 }); }
  try {
    const saved = await saveFormDefinition(definition);
    if (!saved.success) return Response.json({ error: "Completa los campos con valores válidos." }, { status: 422 });
    return Response.json({ form: saved.form }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No se pudo guardar el formulario." }, { status: 503 });
  }
}
