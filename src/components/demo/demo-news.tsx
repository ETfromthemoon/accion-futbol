import Link from "next/link";
import { demoNews } from "@/lib/demo/examples";

export function DemoNews() {
  return <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(270px,.6fr)]">
    <article id="articulo">
      <p className="section-tag">Historias de la cancha / Kids</p>
      <h2 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{demoNews.title}</h2>
      <p className="mt-7 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-foreground/80 sm:text-xl">{demoNews.summary}</p>
      <figure className="mt-9"><div role="img" aria-label={demoNews.coverAlt} className="aspect-[16/10] rounded-[1.75rem] bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(demoNews.coverImage)})` }} /><figcaption className="mt-3 text-sm text-muted">{demoNews.coverAlt}</figcaption></figure>
      <div className="mt-11 max-w-2xl space-y-6 text-base leading-8 text-foreground/85 sm:text-lg">{demoNews.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <div className="mt-12 border-t border-white/15 pt-6"><Link href="/noticias" className="inline-flex min-h-11 items-center font-bold text-primary hover:text-foreground">← Explorar noticias publicadas</Link></div>
    </article>
    <aside className="space-y-5 lg:pt-6">
      <div className="rounded-3xl border border-white/15 bg-surface p-6"><p className="text-xs font-black uppercase tracking-widest text-primary">También en portada</p><p className="mt-3 text-sm leading-relaxed text-muted">El título, la imagen y el resumen sirven para presentar la noticia antes de abrir el artículo completo.</p><Link href="#articulo" className="mt-5 block overflow-hidden rounded-2xl border border-white/15 bg-background hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><div role="img" aria-label={demoNews.coverAlt} className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(demoNews.coverImage)})` }} /><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">Noticias de la cancha</p><h3 className="mt-3 font-display text-xl font-black leading-tight">{demoNews.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{demoNews.summary}</p><span className="mt-4 inline-flex font-bold text-primary">Leer noticia ↗</span></div></Link></div>
      <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6"><p className="font-display text-lg font-black">Datos que se pueden editar</p><p className="mt-3 text-sm leading-relaxed text-foreground/75">Título, enlace, resumen, contenido, imagen de portada y descripción accesible de la imagen.</p></div>
    </aside>
  </div>;
}
