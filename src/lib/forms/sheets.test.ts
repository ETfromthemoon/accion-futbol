import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { syncFormSubmissionToSheets } from "./sheets";

const input = {
  form: { slug: "prueba", title: "Formulario", version: 1, status: "published" as const,
    fields: [{ id: "correo", label: "Correo", type: "email" as const, required: true }] },
  answers: { correo: "a@example.com" },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Google Sheets webhook adapter", () => {
  it("stays disabled without explicit configuration", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(syncFormSubmissionToSheets(input)).resolves.toBe("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires both credentials and an HTTPS endpoint", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "http://example.test/hook");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_TOKEN", "token");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(syncFormSubmissionToSheets(input)).resolves.toBe("failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends only to the configured HTTPS receiver using server authorization", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "https://example.test/hook");
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_TOKEN", "secret");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(syncFormSubmissionToSheets(input)).resolves.toBe("synced");
    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.href).toBe("https://example.test/hook");
    expect(options.redirect).toBe("error");
    expect(new Headers(options.headers).get("authorization")).toBe("Bearer secret");
    expect(JSON.parse(String(options.body))).toMatchObject({ form: { slug: "prueba" }, answers: input.answers });
  });
});
