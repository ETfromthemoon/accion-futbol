import { requestHasAdminSession, requestHasExpectedOrigin } from "@/lib/forms/admin-auth";
import { readBoundedJson } from "@/lib/forms/request";
import { listAllNews, saveNews } from "@/lib/news/repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  try { return Response.json({ news: await listAllNews() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "No se pudieron cargar las noticias." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!requestHasAdminSession(request)) return Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  let body: unknown;
  try { body = await readBoundedJson(request, 16_384); }
  catch { return Response.json({ error: "Solicitud inválida." }, { status: 400 }); }
  try {
    const news = await saveNews(body);
    if (!news) return Response.json({ error: "Revisa el título, enlace, resumen, contenido e imagen." }, { status: 422 });
    return Response.json({ news }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return Response.json({ error: "Ese identificador de enlace ya está en uso." }, { status: 409 });
    }
    return Response.json({ error: "No se pudo guardar la noticia." }, { status: 503 });
  }
}
