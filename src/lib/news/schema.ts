import { z } from "zod";

export const newsSlugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(3).max(80);

const coverImageSchema = z.string().trim().max(500).refine((value) => {
  if (!value) return true;
  if (/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
});

export const newsInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: newsSlugSchema,
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(280),
  body: z.string().trim().max(12_000),
  coverImage: coverImageSchema,
  coverAlt: z.string().trim().max(140),
  status: z.enum(["draft", "published"]),
}).strict().superRefine((news, ctx) => {
  if (news.status === "published") {
    if (news.title.length < 5) ctx.addIssue({ code: "custom", path: ["title"], message: "El título debe tener al menos 5 caracteres." });
    if (news.summary.length < 20) ctx.addIssue({ code: "custom", path: ["summary"], message: "El resumen debe tener al menos 20 caracteres." });
    if (news.body.length < 30) ctx.addIssue({ code: "custom", path: ["body"], message: "El contenido debe tener al menos 30 caracteres." });
  }
  if (news.coverImage && !news.coverAlt) {
    ctx.addIssue({ code: "custom", path: ["coverAlt"], message: "Describe la imagen para lectores de pantalla." });
  }
});

export type NewsInput = z.infer<typeof newsInputSchema>;
export type NewsPost = NewsInput & {
  id: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
