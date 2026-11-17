import "server-only";
import postgres from "postgres";
import { popupIsVisible, popupSchema, type PopupDefinition } from "./schema";

let client: ReturnType<typeof postgres> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  return (client ??= postgres(url, { ssl: "require", max: 1, idle_timeout: 20 }));
}

export async function listPopups(): Promise<PopupDefinition[]> {
  const rows = await database()`SELECT definition FROM popup_campaigns ORDER BY updated_at DESC LIMIT 100`;
  return rows.map((row) => popupSchema.parse(row.definition));
}

export async function listVisiblePopups(path: string): Promise<PopupDefinition[]> {
  const rows = await database()`SELECT definition FROM popup_campaigns WHERE status = 'published' ORDER BY updated_at DESC LIMIT 50`;
  return rows.map((row) => popupSchema.parse(row.definition)).filter((popup) => popupIsVisible(popup, path));
}

export async function savePopup(input: unknown) {
  const parsed = popupSchema.safeParse(input);
  if (!parsed.success) return null;
  const popup = { ...parsed.data, id: parsed.data.id ?? crypto.randomUUID() };
  await database()`INSERT INTO popup_campaigns (id, status, definition)
    VALUES (${popup.id}, ${popup.status}, ${database().json(popup)})
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, definition = EXCLUDED.definition, updated_at = now()`;
  return popup;
}
