import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { sendMetaLead } from "./server";

const id = "89f7e559-58a3-47c2-a632-6f2a76887f66";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("Meta conversiones", () => {
  it("no envía datos sin configuración", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    const send = vi.fn(); vi.stubGlobal("fetch", send);
    await sendMetaLead(new Request("https://ejemplo.cl"), id);
    expect(send).not.toHaveBeenCalled();
  });

  it("requiere consentimiento e identificador de navegador y conserva el identificador del evento", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789");
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "token");
    vi.stubEnv("META_GRAPH_API_VERSION", "v20.0");
    const send = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal("fetch", send);
    await sendMetaLead(new Request("https://ejemplo.cl", { headers: { cookie: "_fbp=fb.1.123.456" } }), id);
    expect(send).not.toHaveBeenCalled();
    await sendMetaLead(new Request("https://ejemplo.cl", { headers: { cookie: "accion_meta_consent=granted; _fbp=fb.1.123.456" } }), id);
    expect(send).toHaveBeenCalledOnce();
    const payload = JSON.parse(send.mock.calls[0][1].body);
    expect(payload.data[0]).toMatchObject({ event_name: "Lead", event_id: id, user_data: { fbp: "fb.1.123.456" } });
  });
});
