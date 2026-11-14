import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/forms/repository", () => ({
  getPublishedForm: vi.fn(),
  savePublishedFormSubmission: vi.fn(),
}));
import { getPublishedForm, savePublishedFormSubmission } from "@/lib/forms/repository";
import { GET, POST } from "./route";

const published = {
  slug: "clase-de-prueba", title: "Clase de prueba", version: 1, status: "published" as const,
  fields: [{ id: "correo", label: "Correo", type: "email" as const, required: true }],
};
const context = { params: Promise.resolve({ slug: "clase-de-prueba" }) };

afterEach(() => vi.resetAllMocks());

describe("public form endpoint", () => {
  it("returns only a published definition", async () => {
    vi.mocked(getPublishedForm).mockResolvedValue(published);
    const response = await GET(new Request("https://example.test/api/forms/clase-de-prueba"), context);
    expect(response.status).toBe(200);
    expect((await response.json()).form).toEqual(published);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects malformed slugs before reaching storage", async () => {
    const response = await GET(new Request("https://example.test/api/forms/bad%2Fslug"), {
      params: Promise.resolve({ slug: "bad/slug" }),
    });
    expect(response.status).toBe(404);
    expect(getPublishedForm).not.toHaveBeenCalled();
  });

  it("saves validated submissions and reports successful receipt", async () => {
    vi.mocked(savePublishedFormSubmission).mockResolvedValue({ success: true, sheets: "not_configured" });
    const response = await POST(new Request("https://example.test/api/forms/clase-de-prueba", {
      method: "POST", body: JSON.stringify({ correo: "persona@example.com" }),
    }), context);
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ success: true });
    expect(savePublishedFormSubmission).toHaveBeenCalledWith("clase-de-prueba", { correo: "persona@example.com" }, "unknown");
  });

  it("silently discards honeypot submissions", async () => {
    const response = await POST(new Request("https://example.test/api/forms/clase-de-prueba", {
      method: "POST", body: JSON.stringify({ correo: "persona@example.com", _website: "bot" }),
    }), context);
    expect(response.status).toBe(201);
    expect(savePublishedFormSubmission).not.toHaveBeenCalled();
  });

  it("rejects oversized request bodies", async () => {
    const response = await POST(new Request("https://example.test/api/forms/clase-de-prueba", {
      method: "POST", headers: { "content-length": "40000" }, body: "{}",
    }), context);
    expect(response.status).toBe(413);
    expect(savePublishedFormSubmission).not.toHaveBeenCalled();
  });
});
