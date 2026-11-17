import "server-only";
import postgres from "postgres";
import { formDefinitionSchema, type FormDefinition, validateFormAnswers } from "./schema";
import { syncFormSubmissionToSheets } from "./sheets";
import { checkPublicFormLimit } from "./abuse";

// Sin base configurada falla explícitamente: nunca fingir que se guardó una respuesta.
let client: ReturnType<typeof postgres> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  return (client ??= postgres(url, { ssl: "require", max: 1, idle_timeout: 20 }));
}

export async function getPublishedForm(slug: string) {
  const rows = await database()`SELECT definition FROM form_definitions WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
  if (!rows.length) return null;
  const form = formDefinitionSchema.parse(rows[0].definition);
  if (form.status !== "published" || form.slug !== slug) throw new Error("Definición de formulario inconsistente");
  return form;
}

export async function savePublishedFormSubmission(slug: string, input: unknown, ip: string) {
  const saved = await database().begin(async (sql) => {
    // El bloqueo impide archivar/reemplazar la versión durante la validación y escritura.
    const rows = await sql`SELECT definition, version FROM form_definitions WHERE slug = ${slug} AND status = 'published' FOR SHARE`;
    if (!rows.length) return { success: false as const, reason: "not_found" as const };
    const form = formDefinitionSchema.parse(rows[0].definition);
    if (form.status !== "published" || form.slug !== slug || form.version !== rows[0].version) {
      throw new Error("Definición de formulario inconsistente");
    }
    const result = validateFormAnswers(form, input);
    if (!result.success) return { success: false as const, reason: "invalid" as const, errors: result.errors };
    const limit = checkPublicFormLimit(slug, ip);
    if (!limit.allowed) return { success: false as const, reason: "rate_limited" as const, retryAfter: limit.retryAfter };
    const inserted = await sql`INSERT INTO form_submissions (form_slug, form_version, answers) VALUES (${slug}, ${form.version}, ${sql.json(result.answers)}) RETURNING id`;
    const payload = {
      submissionId: String(inserted[0].id),
      form: { slug: form.slug, title: form.title, version: form.version },
      fields: form.fields.map(({ id, label, type }) => ({ id, label, type })),
      answers: result.answers,
    };
    const queued = await sql`INSERT INTO form_sheet_sync (submission_id, payload) VALUES (${inserted[0].id}, ${sql.json(payload)}) RETURNING id`;
    return { success: true as const, syncId: String(queued[0].id) };
  });
  if (!saved.success) return saved;
  // Se intenta después del commit. Si falla, queda en outbox para recuperación.
  const sheets = await retryPendingSheetSync(saved.syncId);
  return { success: true as const, sheets };
}

export async function retryPendingSheetSync(syncId: string) {
  const rows = await database()`SELECT payload FROM form_sheet_sync WHERE id = ${syncId} AND status = 'pending' LIMIT 1`;
  if (!rows.length) return "synced" as const;
  const payload = rows[0].payload as {
    submissionId: string;
    form: Pick<FormDefinition, "slug" | "title" | "version">;
    fields: Array<Pick<FormDefinition["fields"][number], "id" | "label" | "type">>;
    answers: Record<string, string | boolean>;
  };
  const result = await syncFormSubmissionToSheets(payload);
  await database()`UPDATE form_sheet_sync
    SET attempts = CASE WHEN ${result} = 'not_configured' THEN attempts ELSE attempts + 1 END,
        last_attempt_at = CASE WHEN ${result} = 'not_configured' THEN last_attempt_at ELSE now() END,
        status = CASE WHEN ${result} = 'synced' THEN 'synced' ELSE 'pending' END,
        last_result = ${result},
        synced_at = CASE WHEN ${result} = 'synced' THEN now() ELSE NULL END
    WHERE id = ${syncId} AND status = 'pending'`;
  return result;
}

export async function listForms() {
  const rows = await database()`SELECT DISTINCT ON (current.slug) current.definition,
      (SELECT MAX(active.version) FROM form_definitions active WHERE active.slug = current.slug AND active.status = 'published') AS published_version
    FROM form_definitions current ORDER BY current.slug, current.version DESC`;
  return rows.map((row) => ({ ...formDefinitionSchema.parse(row.definition), publishedVersion: row.published_version ? Number(row.published_version) : null }));
}

export async function saveFormDefinition(input: unknown) {
  const parsed = formDefinitionSchema.safeParse(input);
  if (!parsed.success || parsed.data.status === "archived") return { success: false as const };
  const next = await database().begin(async (sql) => {
    await sql`SELECT pg_advisory_xact_lock(hashtext(${parsed.data.slug}))`;
    const rows = await sql`SELECT COALESCE(MAX(version), 0) AS version FROM form_definitions WHERE slug = ${parsed.data.slug}`;
    const version = Number(rows[0].version) + 1;
    const definition = { ...parsed.data, version };
    if (definition.status === "published") {
      await sql`UPDATE form_definitions SET status = 'archived', definition = jsonb_set(definition, '{status}', '"archived"') WHERE slug = ${definition.slug} AND status = 'published'`;
    }
    await sql`INSERT INTO form_definitions (slug, version, status, definition) VALUES (${definition.slug}, ${version}, ${definition.status}, ${sql.json(definition)})`;
    return definition;
  });
  return { success: true as const, form: next };
}

export async function archiveForm(slug: string) {
  const rows = await database()`UPDATE form_definitions SET status = 'archived', definition = jsonb_set(definition, '{status}', '"archived"') WHERE slug = ${slug} AND status != 'archived' RETURNING slug`;
  return rows.length > 0;
}

export async function getFormSubmissions(slug: string) {
  const rows = await database()`SELECT s.id, s.form_version, s.answers, s.created_at,
      q.status AS sheets_status, q.last_result AS sheets_last_result, q.attempts AS sheets_attempts,
      d.definition AS form_definition
    FROM form_submissions s
    JOIN form_definitions d ON d.slug = s.form_slug AND d.version = s.form_version
    LEFT JOIN form_sheet_sync q ON q.submission_id = s.id
    WHERE s.form_slug = ${slug} ORDER BY s.created_at DESC LIMIT 500`;
  return rows.map((row) => {
    const definition = formDefinitionSchema.parse(row.form_definition);
    return {
      id: String(row.id), version: row.form_version, answers: row.answers,
      fieldLabels: Object.fromEntries(definition.fields.map((field) => [field.id, field.label])),
      createdAt: row.created_at, sheetsStatus: row.sheets_last_result ?? row.sheets_status ?? "pending",
      sheetsAttempts: row.sheets_attempts ?? 0,
    };
  });
}

export async function retryPendingSheetSyncs(slug: string) {
  const rows = await database()`SELECT q.id FROM form_sheet_sync q
    JOIN form_submissions s ON s.id = q.submission_id
    WHERE s.form_slug = ${slug} AND q.status = 'pending'
    ORDER BY q.created_at ASC LIMIT 10`;
  await Promise.all(rows.map((row) => retryPendingSheetSync(String(row.id))));
  return rows.length;
}
