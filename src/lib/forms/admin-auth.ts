import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

export const FORMS_ADMIN_COOKIE = "af_forms_admin";
const SESSION_SECONDS = 8 * 60 * 60;
const attempts = new Map<string, number[]>();

function configured() {
  const passwordHash = process.env.FORMS_ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.FORMS_ADMIN_SESSION_SECRET;
  return Boolean(passwordHash && sessionSecret && sessionSecret.length >= 32 && expectedOrigin());
}

function expectedOrigin() {
  if (process.env.FORMS_ADMIN_ORIGIN) return process.env.FORMS_ADMIN_ORIGIN;
  // Cada vista previa de Vercel tiene un host distinto; se usa solo el host que Vercel asigna al despliegue.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return null;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function validPassword(password: string) {
  const [salt, expected, extra] = (process.env.FORMS_ADMIN_PASSWORD_HASH ?? "").split(":");
  if (extra || !/^[a-f\d]{32,128}$/i.test(salt ?? "") || !/^[a-f\d]{128}$/i.test(expected ?? "")) return false;
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 64).toString("hex");
  return safeEqual(actual, expected.toLowerCase());
}

function signature(value: string) {
  return createHmac("sha256", process.env.FORMS_ADMIN_SESSION_SECRET ?? "").update(value).digest("base64url");
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  return `${payload}.${signature(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!configured() || !value) return false;
  const [expiresText, supplied, extra] = value.split(".");
  if (!expiresText || !supplied || extra) return false;
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Date.now() / 1000 || expires > Date.now() / 1000 + SESSION_SECONDS + 60) return false;
  return safeEqual(signature(expiresText), supplied);
}

export function isFormsAdminConfigured() {
  return configured();
}

export function requestHasAdminSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${FORMS_ADMIN_COOKIE}=`));
  return isValidAdminSession(cookie?.slice(FORMS_ADMIN_COOKIE.length + 1));
}

export function requestHasExpectedOrigin(request: Request) {
  const configuredOrigin = expectedOrigin();
  if (!configuredOrigin) return false;
  try {
    return request.headers.get("origin") === new URL(configuredOrigin).origin && new URL(configuredOrigin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function checkLoginRateLimit(request: Request) {
  const key = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const windowStart = now - 15 * 60_000;
  const recent = (attempts.get(key) ?? []).filter((time) => time > windowStart);
  const global = (attempts.get("__global__") ?? []).filter((time) => time > windowStart);
  const blockedUntil = Math.max(recent.length >= 8 ? recent[0] + 15 * 60_000 : 0, global.length >= 60 ? global[0] + 15 * 60_000 : 0);
  if (blockedUntil > now) return { allowed: false, retryAfter: Math.ceil((blockedUntil - now) / 1000) };
  recent.push(now);
  global.push(now);
  if (!attempts.has(key) && attempts.size >= 5000) {
    const oldest = [...attempts.keys()].find((entry) => entry !== "__global__");
    if (oldest) attempts.delete(oldest);
  }
  attempts.set(key, recent);
  attempts.set("__global__", global);
  return { allowed: true, retryAfter: 0 };
}

export function clearLoginRateLimit(request: Request) {
  const key = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  attempts.delete(key);
  attempts.set("__global__", (attempts.get("__global__") ?? []).slice(0, -1));
}

export function verifyAdminPassword(password: string) {
  if (!configured() || !password || password.length > 1024) return false;
  try {
    return validPassword(password);
  } catch {
    return false;
  }
}

export function adminCookieHeader(value: string, secure: boolean) {
  return `${FORMS_ADMIN_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}

export function clearAdminCookieHeader(secure: boolean) {
  return `${FORMS_ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}
