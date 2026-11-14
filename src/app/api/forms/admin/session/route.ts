import {
  adminCookieHeader, checkLoginRateLimit, clearAdminCookieHeader,
  clearLoginRateLimit, createAdminSession, isFormsAdminConfigured,
  requestHasExpectedOrigin, verifyAdminPassword,
} from "@/lib/forms/admin-auth";
import { readBoundedJson } from "@/lib/forms/request";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isFormsAdminConfigured()) return Response.json({ error: "El acceso administrativo no está configurado." }, { status: 503 });
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  const limit = checkLoginRateLimit(request);
  if (!limit.allowed) return Response.json({ error: "Demasiados intentos. Inténtalo más tarde." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  let password: unknown;
  try { password = (await readBoundedJson(request, 2048) as { password?: unknown }).password; }
  catch (error) { return Response.json({ error: error instanceof Error && error.message === "body_too_large" ? "Solicitud demasiado grande." : "Solicitud inválida." }, { status: error instanceof Error && error.message === "body_too_large" ? 413 : 400 }); }
  if (typeof password !== "string" || !verifyAdminPassword(password)) return Response.json({ error: "Credenciales inválidas." }, { status: 401 });
  clearLoginRateLimit(request);
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ success: true }, { headers: { "Set-Cookie": adminCookieHeader(createAdminSession(), secure), "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  if (!requestHasExpectedOrigin(request)) return Response.json({ error: "Solicitud no autorizada." }, { status: 403 });
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ success: true }, { headers: { "Set-Cookie": clearAdminCookieHeader(secure), "Cache-Control": "no-store" } });
}
