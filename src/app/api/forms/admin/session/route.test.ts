import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/forms/admin-auth", () => ({
  adminCookieHeader: vi.fn(() => "af_forms_admin=signed; HttpOnly; SameSite=Strict"),
  checkLoginRateLimit: vi.fn(() => ({ allowed: true, retryAfter: 0 })),
  clearAdminCookieHeader: vi.fn(() => "af_forms_admin=; Max-Age=0"),
  clearLoginRateLimit: vi.fn(),
  createAdminSession: vi.fn(() => "signed"),
  isFormsAdminConfigured: vi.fn(() => true),
  requestHasExpectedOrigin: vi.fn((request: Request) => request.headers.get("origin") === new URL(request.url).origin),
  verifyAdminPassword: vi.fn((password: string) => password === "test-password"),
}));
import { POST } from "./route";

afterEach(() => vi.resetAllMocks());

describe("forms admin session endpoint", () => {
  it("rejects cross-origin login attempts", async () => {
    const response = await POST(new Request("https://example.test/api/forms/admin/session", {
      method: "POST", headers: { origin: "https://attacker.test" }, body: JSON.stringify({ password: "test-password" }),
    }));
    expect(response.status).toBe(403);
  });

  it("sets an HttpOnly session cookie after valid credentials", async () => {
    const response = await POST(new Request("https://example.test/api/forms/admin/session", {
      method: "POST", headers: { origin: "https://example.test" }, body: JSON.stringify({ password: "test-password" }),
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });
});
