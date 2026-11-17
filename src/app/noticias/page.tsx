import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/news/news-card";
import { listPublishedNews } from "@/lib/news/repository";
import type { NewsPost } from "@/lib/news/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Noticias | Acción Fútbol",
  description: "Novedades, encuentros e historias de la comunidad de Acción Fútbol.",
  alternates: { canonical: "/noticias" },
};

export default async function NewsPage() {
  let posts: NewsPost[] = [];
  let unavailable = false;
  try { posts = await listPublishedNews(100); } catch { unavailable = true; }
  return <main className="min-h-screen px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
        <Link href="/" className="font-display text-xl font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">ACCIÓN<span className="text-primary">FÚTBOL</span></Link>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">Volver al inicio ↗</Link>
      </header>
      <div className="py-16 sm:py-20"><p className="section-tag">Historias de la cancha</p><h1 className="mt-5 font-display text-5xl font-black tracking-tight sm:text-7xl">Noticias</h1><p className="mt-5 max-w-xl text-lg text-muted">Encuentros, novedades y momentos de nuestra comunidad.</p></div>
      {unavailable ? <p className="rounded-xl border border-white/15 bg-surface p-6">Las noticias están temporalmente no disponibles. Vuelve a intentarlo más tarde.</p> : posts.length === 0 ? <p className="rounded-xl border border-white/15 bg-surface p-6">Pronto compartiremos noticias desde la cancha.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <NewsCard key={post.id} post={post} />)}</div>}
    </div>
  </main>;
}
