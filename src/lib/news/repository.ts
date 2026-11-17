import "server-only";
import postgres from "postgres";
import { newsInputSchema, newsSlugSchema, type NewsPost } from "./schema";

let client: ReturnType<typeof postgres> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no configurada");
  return (client ??= postgres(url, { ssl: "require", max: 1, idle_timeout: 20 }));
}

type NewsRow = {
  id: string; slug: string; title: string; summary: string; body: string;
  cover_image: string; cover_alt: string; status: "draft" | "published";
  published_at: Date | null; created_at: Date; updated_at: Date;
};

function fromRow(row: NewsRow): NewsPost {
  return {
    id: row.id, slug: row.slug, title: row.title, summary: row.summary,
    body: row.body, coverImage: row.cover_image, coverAlt: row.cover_alt,
    status: row.status, publishedAt: row.published_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
  };
}

export async function listPublishedNews(limit = 30): Promise<NewsPost[]> {
  if (!process.env.DATABASE_URL) return [];
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const rows = await database()`SELECT id, slug, title, summary, body, cover_image, cover_alt, status, published_at, created_at, updated_at
    FROM news_posts WHERE status = 'published' ORDER BY published_at DESC, created_at DESC LIMIT ${safeLimit}`;
  return rows.map((row) => fromRow(row as unknown as NewsRow));
}

export async function getPublishedNews(slug: string): Promise<NewsPost | null> {
  if (!newsSlugSchema.safeParse(slug).success || !process.env.DATABASE_URL) return null;
  const rows = await database()`SELECT id, slug, title, summary, body, cover_image, cover_alt, status, published_at, created_at, updated_at
    FROM news_posts WHERE slug = ${slug} AND status = 'published' LIMIT 1`;
  return rows.length ? fromRow(rows[0] as unknown as NewsRow) : null;
}

export async function listAllNews(): Promise<NewsPost[]> {
  const rows = await database()`SELECT id, slug, title, summary, body, cover_image, cover_alt, status, published_at, created_at, updated_at
    FROM news_posts ORDER BY updated_at DESC LIMIT 100`;
  return rows.map((row) => fromRow(row as unknown as NewsRow));
}

export async function saveNews(input: unknown): Promise<NewsPost | null> {
  const parsed = newsInputSchema.safeParse(input);
  if (!parsed.success) return null;
  const news = parsed.data;
  const id = news.id ?? crypto.randomUUID();
  const rows = await database()`INSERT INTO news_posts
    (id, slug, title, summary, body, cover_image, cover_alt, status, published_at)
    VALUES (${id}, ${news.slug}, ${news.title}, ${news.summary}, ${news.body}, ${news.coverImage}, ${news.coverAlt}, ${news.status}, ${news.status === "published" ? new Date() : null})
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug, title = EXCLUDED.title, summary = EXCLUDED.summary,
      body = EXCLUDED.body, cover_image = EXCLUDED.cover_image, cover_alt = EXCLUDED.cover_alt,
      status = EXCLUDED.status,
      published_at = CASE WHEN EXCLUDED.status = 'published' THEN COALESCE(news_posts.published_at, now()) ELSE NULL END,
      updated_at = now()
    RETURNING id, slug, title, summary, body, cover_image, cover_alt, status, published_at, created_at, updated_at`;
  return fromRow(rows[0] as unknown as NewsRow);
}
