import "server-only";

// Solo se invoca después de guardar una solicitud real, nunca desde un endpoint de tracking público.
export async function sendMetaLead(request: Request, eventId: string | undefined): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION ?? "";
  if (!token || !/^\d{5,25}$/.test(pixelId) || !/^v\d+\.\d+$/.test(version) || !eventId || !/^[a-f0-9-]{36}$/i.test(eventId)) return;
  const cookies = request.headers.get("cookie")?.split(/;\s*/) ?? [];
  if (!cookies.includes("accion_meta_consent=granted")) return;
  const fbp = cookies.find((item) => item.startsWith("_fbp="))?.slice(5);
  // No enviamos nombres, correos, teléfonos ni otros datos del formulario.
  if (!fbp || !/^fb\.1\.\d+\.\d+$/.test(fbp)) return;
  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: "website", user_data: { fbp } }] }),
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) console.error("[meta] No se pudo enviar el evento de conversión", response.status);
  } catch {
    console.error("[meta] No se pudo conectar con Conversion API");
  }
}
