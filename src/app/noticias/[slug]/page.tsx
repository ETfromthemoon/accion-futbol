import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNewsDate } from "@/components/news/news-card";
import { getPublishedNews } from "@/lib/news/repository";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedNews(slug).catch(() => null);
  if (!post) return { title: "Noticia no disponible | Acción Fútbol", robots: { index: false } };
  return {
    title: `${post.title} | Acción Fútbol`, description: post.summary,
    alternates: { canonical: `/noticias/${post.slug}` },
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.publishedAt ?? undefined, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedNews(slug);
  if (!post) notFound();
  return <main className="min-h-screen px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
        <Link href="/" className="font-display text-xl font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">ACCIÓN<span className="text-primary">FÚTBOL</span></Link>
        <Link href="/noticias" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">Todas las noticias ↗</Link>
      </header>
      <article className="mx-auto max-w-3xl pt-14 sm:pt-20">
        <p className="section-tag">Noticias de la cancha</p>
        <time dateTime={post.publishedAt ?? undefined} className="mt-5 block text-sm text-muted">{formatNewsDate(post.publishedAt)}</time>
        <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{post.title}</h1>
        <p className="mt-7 border-l-2 border-primary pl-5 text-lg leading-relaxed text-foreground/80 sm:text-xl">{post.summary}</p>
        {post.coverImage && <figure className="mt-10"><div role="img" aria-label={post.coverAlt} className="aspect-[16/9] rounded-[1.5rem] bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(post.coverImage)})` }} /><figcaption className="mt-2 text-sm text-muted">{post.coverAlt}</figcaption></figure>}
        <div className="mt-12 space-y-6 text-base leading-8 text-foreground/85 sm:text-lg">{post.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}</div>
        <div className="mt-16 border-t border-white/15 pt-8"><Link href="/noticias" className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:text-foreground">← Volver a todas las noticias</Link></div>
      </article>
    </div>
  </main>;
}
