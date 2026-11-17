import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NewsPost } from "@/lib/news/schema";

export function formatNewsDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Santiago" }).format(new Date(date));
}

export function NewsCard({ post, featured = false }: { post: NewsPost; featured?: boolean }) {
  return <Link href={`/noticias/${post.slug}`} className={`group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/15 bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${featured ? "md:flex-row" : ""}`}>
    <div role={post.coverImage ? "img" : undefined} aria-label={post.coverImage ? post.coverAlt : undefined} className={`relative overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgb(245_91_157_/_0.25),transparent_50%),#171719] ${featured ? "h-44 sm:h-52 md:h-auto md:min-h-64 md:w-[42%] md:shrink-0" : "h-36 sm:h-44"}`} style={post.coverImage ? { backgroundImage: `linear-gradient(0deg, rgb(0 0 0 / .3), transparent), url(${JSON.stringify(post.coverImage)})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
      {!post.coverImage && <span className="absolute bottom-5 left-6 font-display text-2xl font-black tracking-tight text-white/80">ACCIÓN<span className="text-primary">FÚTBOL</span></span>}
    </div>
    <div className={`flex flex-1 flex-col p-6 sm:p-7 ${featured ? "md:justify-center" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{formatNewsDate(post.publishedAt)}</p>
      <h3 className={`mt-3 font-display font-extrabold leading-tight ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{post.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">{post.summary}</p>
      <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary">Leer noticia <ArrowUpRight aria-hidden="true" className="size-4" /></span>
    </div>
  </Link>;
}
