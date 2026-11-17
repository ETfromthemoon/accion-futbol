import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/forms/admin-auth", () => ({ requestHasAdminSession: vi.fn(), requestHasExpectedOrigin: vi.fn() }));
vi.mock("@/lib/news/repository", () => ({ listAllNews: vi.fn(), saveNews: vi.fn() }));

import { requestHasAdminSession, requestHasExpectedOrigin } from "@/lib/forms/admin-auth";
import { listAllNews, saveNews } from "@/lib/news/repository";
import { GET, POST } from "./route";

const request = (body?: unknown) => new Request("https://preview.example/api/news/admin", body === undefined ? undefined : { method: "POST", body: JSON.stringify(body) });

describe("administración de noticias", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(requestHasAdminSession).mockReturnValue(true);
    vi.mocked(requestHasExpectedOrigin).mockReturnValue(true);
  });

  it("protege el listado y la publicación con la sesión existente", async () => {
    vi.mocked(requestHasAdminSession).mockReturnValue(false);
    expect((await GET(request())).status).toBe(401);
    expect((await POST(request({}))).status).toBe(401);
    expect(listAllNews).not.toHaveBeenCalled();
    expect(saveNews).not.toHaveBeenCalled();
  });

  it("rechaza cambios desde otro origen", async () => {
    vi.mocked(requestHasExpectedOrigin).mockReturnValue(false);
    expect((await POST(request({}))).status).toBe(403);
    expect(saveNews).not.toHaveBeenCalled();
  });

  it("devuelve un error de validación sin publicar", async () => {
    vi.mocked(saveNews).mockResolvedValue(null);
    expect((await POST(request({ title: "incompleto" }))).status).toBe(422);
  });
});
