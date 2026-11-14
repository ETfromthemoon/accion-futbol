import { getPublishedForm, savePublishedFormSubmission } from "@/lib/forms/repository";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
  try {
    const form = await getPublishedForm(slug);
    if (!form) return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
    return Response.json({ form }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Formularios no disponibles." }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 32_768) return Response.json({ error: "Solicitud demasiado grande." }, { status: 413 });

  let input: unknown;
  try {
    if (!request.body) return Response.json({ error: "Solicitud inválida." }, { status: 400 });
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let body = "";
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) {
        await reader.cancel();
        return Response.json({ error: "Solicitud demasiado grande." }, { status: 413 });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    input = JSON.parse(body);
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (input && typeof input === "object" && !Array.isArray(input)) {
    const data = input as Record<string, unknown>;
    if (typeof data._website === "string" && data._website.trim()) {
      // Honeypot: responder como si se hubiera recibido, sin persistir datos del bot.
      return Response.json({ success: true, sheets: "synced" }, { status: 201 });
    }
    const { _website: _ignored, ...answers } = data;
    void _ignored;
    input = answers;
  }

  try {
    const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const result = await savePublishedFormSubmission(slug, input, ip);
    if (!result.success && result.reason === "not_found") return Response.json({ error: "Formulario no encontrado." }, { status: 404 });
    if (!result.success && result.reason === "rate_limited") return Response.json({ error: "Se alcanzó el límite temporal de envíos. Inténtalo más tarde." }, { status: 429, headers: { "Retry-After": String(result.retryAfter) } });
    if (!result.success) return Response.json({ error: "Revisa las respuestas del formulario.", fields: result.errors }, { status: 422 });
    return Response.json({ success: true, sheets: result.sheets }, { status: 201 });
  } catch {
    // La respuesta nunca contiene datos enviados ni detalles internos de DB/proveedor.
    return Response.json({ error: "No se pudo recibir la respuesta. Inténtalo más tarde." }, { status: 503 });
  }
}
