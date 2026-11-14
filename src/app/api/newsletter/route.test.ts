import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/newsletter/provider", () => ({ subscribe: vi.fn() }));
import { subscribe } from "@/lib/newsletter/provider";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("https://example.test/api/newsletter", { method: "POST", body: JSON.stringify(body) });
}

describe("newsletter endpoint", () => {
  beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("NEWSLETTER_ENABLED", "true"); });
  afterEach(() => vi.unstubAllEnvs());

  it("is unavailable by default", async () => {
    vi.stubEnv("NEWSLETTER_ENABLED", "");
    expect((await POST(request({ email: "a@example.com", consent: true }))).status).toBe(503);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("rejects subscriptions without consent", async () => {
    expect((await POST(request({ email: "a@example.com", consent: false }))).status).toBe(422);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies without calling the provider", async () => {
    expect((await POST(request({ email: "x".repeat(3000), consent: true }))).status).toBe(413);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("reports a provider failure instead of claiming success", async () => {
    vi.mocked(subscribe).mockResolvedValue("unavailable");
    expect((await POST(request({ email: "a@example.com", consent: true }))).status).toBe(503);
  });

  it("returns success after the provider accepts", async () => {
    vi.mocked(subscribe).mockResolvedValue("accepted");
    expect((await POST(request({ email: "A@EXAMPLE.COM", consent: true }))).status).toBe(200);
    expect(subscribe).toHaveBeenCalledWith({ email: "a@example.com", consent: true });
  });
});
