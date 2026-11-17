import { listVisiblePopups } from "@/lib/popups/repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "/";
  if (path.length > 160 || !/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(path)) {
    return Response.json({ error: "Ruta inválida." }, { status: 400 });
  }
  if (!process.env.DATABASE_URL) return Response.json({ popups: [] }, { headers: { "Cache-Control": "no-store" } });
  try {
    return Response.json({ popups: await listVisiblePopups(path) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No se pudieron cargar los avisos." }, { status: 503 });
  }
}
