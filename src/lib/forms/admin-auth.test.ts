import { scryptSync } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import {
  checkLoginRateLimit, createAdminSession, isValidAdminSession,
  requestHasAdminSession, requestHasExpectedOrigin, verifyAdminPassword,
} from "./admin-auth";

const password = "solo-para-pruebas-123";
const salt = "ab".repeat(16);
const hash = `${salt}:${scryptSync(password, Buffer.from(salt, "hex"), 64).toString("hex")}`;
let ipNumber = 0;

function configure() {
  vi.stubEnv("FORMS_ADMIN_PASSWORD_HASH", hash);
  vi.stubEnv("FORMS_ADMIN_SESSION_SECRET", "session-secret-at-least-32-characters");
  vi.stubEnv("FORMS_ADMIN_ORIGIN", "https://example.test");
}

afterEach(() => vi.unstubAllEnvs());

describe("forms admin auth", () => {
  it("fails closed without all server credentials", () => {
    vi.stubEnv("FORMS_ADMIN_PASSWORD_HASH", "");
    expect(verifyAdminPassword(password)).toBe(false);
    expect(isValidAdminSession(undefined)).toBe(false);
  });

  it("checks the configured scrypt password and signs expiring sessions", () => {
    configure();
    expect(verifyAdminPassword(password)).toBe(true);
    expect(verifyAdminPassword("incorrecta")).toBe(false);
    const session = createAdminSession();
    expect(isValidAdminSession(session)).toBe(true);
    expect(isValidAdminSession(`${session}x`)).toBe(false);
  });

  it("requires the configured same origin and signed cookie", () => {
    configure();
    const session = createAdminSession();
    const request = new Request("https://example.test/api/forms/admin", { headers: { origin: "https://example.test", cookie: `af_forms_admin=${session}` } });
    expect(requestHasExpectedOrigin(request)).toBe(true);
    expect(requestHasAdminSession(request)).toBe(true);
    expect(requestHasExpectedOrigin(new Request("https://example.test/api/forms/admin", { headers: { origin: "https://evil.test" } }))).toBe(false);
  });

  it("limits login attempts per source IP", () => {
    const request = () => new Request("https://example.test/login", { headers: { "x-real-ip": `test-${ipNumber}` } });
    const unique = request();
    for (let attempt = 0; attempt < 8; attempt += 1) expect(checkLoginRateLimit(unique).allowed).toBe(true);
    expect(checkLoginRateLimit(unique).allowed).toBe(false);
    ipNumber += 1;
  });
});
