import { requestHasAdminSession, requestHasExpectedOrigin } from "@/lib/forms/admin-auth";
import { readBoundedJson } from "@/lib/forms/request";
import { listPopups, savePopup } from "@/lib/popups/repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  try { return Response.json({ popups: await listPopups() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudieron cargar los avisos." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  let body: unknown;
  try { body = await readBoundedJson(request, 8_192); }
  catch { return Response.json({ error: "Solicitud inválida." }, { status: 400 }); }
  try {
    const popup = await savePopup(body);
    if (!popup) return Response.json({ error: "Revisa los campos del aviso, enlaces y fechas." }, { status: 422 });
    return Response.json({ popup }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "No se pudo guardar el aviso." }, { status: 503 }); }
}
