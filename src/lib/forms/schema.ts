import { z } from "zod";

// Las definiciones son datos: nunca contienen código ejecutable ni HTML.
const identifier = z.string().regex(/^[a-z][a-z0-9_-]{0,39}$/);
const optionSchema = z.object({ value: identifier, label: z.string().trim().min(1).max(100) }).strict();
const coverImageSchema = z.string().trim().max(500).refine((value) => {
  if (!value) return true;
  if (/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
});
const fieldSchema = z.object({
  id: identifier,
  label: z.string().trim().min(1).max(120),
  type: z.enum(["text", "email", "tel", "textarea", "select", "checkbox"]),
  required: z.boolean(),
  options: z.array(optionSchema).min(1).max(30).optional(),
}).strict().superRefine((field, ctx) => {
  if (field.type === "select" && !field.options) ctx.addIssue({ code: "custom", message: "El selector necesita opciones" });
  if (field.type !== "select" && field.options) ctx.addIssue({ code: "custom", message: "Solo un selector admite opciones" });
  if (field.options && new Set(field.options.map((option) => option.value)).size !== field.options.length) {
    ctx.addIssue({ code: "custom", message: "Las opciones deben ser únicas" });
  }
});

export const formDefinitionSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  coverImage: coverImageSchema.optional(),
  coverAlt: z.string().trim().max(140).optional(),
  version: z.number().int().positive(),
  status: z.enum(["draft", "published", "archived"]),
  fields: z.array(fieldSchema).min(1).max(30),
}).strict().superRefine((form, ctx) => {
  if (new Set(form.fields.map((field) => field.id)).size !== form.fields.length) {
    ctx.addIssue({ code: "custom", message: "Los identificadores de campo deben ser únicos" });
  }
  if (form.coverImage && !form.coverAlt) {
    ctx.addIssue({ code: "custom", path: ["coverAlt"], message: "Describe la imagen para lectores de pantalla" });
  }
});

export type FormDefinition = z.infer<typeof formDefinitionSchema>;

// Las respuestas se validan contra la versión publicada, no contra campos enviados por el visitante.
export function validateFormAnswers(form: FormDefinition, input: unknown) {
  if (form.status !== "published") return { success: false as const, errors: { _form: "Formulario no disponible" } };
  const parsed = z.record(z.string(), z.union([z.string().max(2000), z.boolean()])).safeParse(input);
  if (!parsed.success) return { success: false as const, errors: { _form: "Respuestas inválidas" } };
  const errors: Record<string, string> = {};
  const answers: Record<string, string | boolean> = {};
  const ids = new Set(form.fields.map((field) => field.id));
  if (Object.keys(parsed.data).some((key) => !ids.has(key))) errors._form = "Hay campos desconocidos";
  for (const field of form.fields) {
    const value = parsed.data[field.id];
    if (field.type === "checkbox") {
      if (value !== undefined && typeof value !== "boolean") errors[field.id] = "Valor inválido";
      else if (field.required && value !== true) errors[field.id] = "Este campo es obligatorio";
      else answers[field.id] = value ?? false;
      continue;
    }
    if (value !== undefined && typeof value !== "string") { errors[field.id] = "Valor inválido"; continue; }
    const text = (value ?? "").trim();
    if (!text && field.required) errors[field.id] = "Este campo es obligatorio";
    else if (text && field.type === "email" && !z.email().safeParse(text).success) errors[field.id] = "Correo inválido";
    else if (text && field.type === "select" && !field.options?.some((option) => option.value === text)) errors[field.id] = "Opción inválida";
    else answers[field.id] = text;
  }
  return Object.keys(errors).length ? { success: false as const, errors } : { success: true as const, answers };
}
