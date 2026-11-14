import "server-only";
import type { FormDefinition } from "./schema";

type SheetResult = "not_configured" | "synced" | "failed";

/**
 * Adaptador webhook para una automatización propia de Google Sheets.
 * No crea hojas ni almacena credenciales en el cliente. Configurar URL HTTPS y
 * token del receptor únicamente en el entorno del servidor.
 */
export async function syncFormSubmissionToSheets(input: {
  submissionId?: string;
  form: Pick<FormDefinition, "slug" | "title" | "version">;
  fields?: Array<Pick<FormDefinition["fields"][number], "id" | "label" | "type">>;
  answers: Record<string, string | boolean>;
}): Promise<SheetResult> {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const token = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;
  if (!endpoint && !token) return "not_configured";
  if (!endpoint || !token) return "failed";

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return "failed";
  }
  if (url.protocol !== "https:") return "failed";

  try {
    const response = await fetch(url, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(4000),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        submissionId: input.submissionId,
        form: { slug: input.form.slug, title: input.form.title, version: input.form.version },
        fields: input.fields ?? [],
        answers: input.answers,
      }),
    });
    return response.ok ? "synced" : "failed";
  } catch {
    // No registrar URL, token, respuestas ni datos personales.
    return "failed";
  }
}
