import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NewsCard } from "./news-card";
import type { NewsPost } from "@/lib/news/schema";

export function NewsSection({ posts }: { posts: NewsPost[] }) {
  if (posts.length === 0) return null;
  return <section id="noticias" className="relative overflow-hidden bg-surface/60 py-20 sm:py-28">
    <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
    <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="section-tag">Noticias de la cancha</p><h2 className="mt-4 max-w-xl font-display text-4xl font-black leading-none tracking-tight sm:text-5xl">Lo último en Acción Fútbol.</h2></div>
        <Link href="/noticias" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 py-2 font-display text-sm font-bold transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Ver todas las noticias <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      </div>
      <div className={`grid gap-5 ${posts.length > 1 ? "lg:grid-cols-[1.2fr_.8fr]" : ""}`}>
        <NewsCard post={posts[0]} featured />
        {posts.length > 1 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">{posts.slice(1, 3).map((post) => <NewsCard key={post.id} post={post} />)}</div>}
      </div>
    </div>
  </section>;
}
