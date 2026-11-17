import { z } from "zod";

const internalPath = z.string().regex(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/);
const imageUrl = z.string().trim().max(500).refine((value) => {
  if (!value) return true;
  if (/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
});

export const popupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  status: z.enum(["draft", "published"]),
  template: z.enum(["classic", "split", "banner"]),
  path: z.union([z.literal("all"), internalPath]),
  trigger: z.enum(["delay", "scroll", "exit"]),
  delaySeconds: z.number().int().min(0).max(120),
  scrollPercent: z.number().int().min(5).max(95),
  frequencyDays: z.number().int().min(0).max(90),
  startsAt: z.string().max(40),
  endsAt: z.string().max(40),
  eyebrow: z.string().trim().max(80),
  title: z.string().trim().min(2).max(140),
  message: z.string().trim().min(2).max(500),
  imageUrl,
  imageAlt: z.string().trim().max(140),
  ctaLabel: z.string().trim().min(2).max(60),
  ctaHref: z.string().trim().max(500).refine((value) => {
    if (value.startsWith("#") && /^#[a-zA-Z][\w-]*$/.test(value)) return true;
    if (internalPath.safeParse(value).success) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch { return false; }
  }),
}).strict().superRefine((popup, ctx) => {
  const start = popup.startsAt ? Date.parse(popup.startsAt) : null;
  const end = popup.endsAt ? Date.parse(popup.endsAt) : null;
  if (start !== null && !Number.isFinite(start)) ctx.addIssue({ code: "custom", path: ["startsAt"], message: "Fecha de inicio inválida" });
  if (end !== null && !Number.isFinite(end)) ctx.addIssue({ code: "custom", path: ["endsAt"], message: "Fecha de término inválida" });
  if (start !== null && end !== null && start >= end) ctx.addIssue({ code: "custom", path: ["endsAt"], message: "El término debe ser posterior al inicio" });
  if (popup.template === "split" && !popup.imageUrl) ctx.addIssue({ code: "custom", path: ["imageUrl"], message: "La plantilla con imagen requiere una imagen" });
});

export type PopupDefinition = z.infer<typeof popupSchema>;

export function popupIsVisible(popup: PopupDefinition, path: string, now = new Date()) {
  if (popup.status !== "published") return false;
  if (popup.path !== "all" && popup.path !== path) return false;
  if (popup.startsAt && Date.parse(popup.startsAt) > now.getTime()) return false;
  if (popup.endsAt && Date.parse(popup.endsAt) <= now.getTime()) return false;
  return true;
}
