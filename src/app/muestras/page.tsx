import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Muestras de contenido | Acción Fútbol", robots: { index: false, follow: false } };

const samples = [
  { href: "/muestras/formulario", number: "01", title: "Formulario", text: "Campos configurables, respuesta ficticia y vista de recepción." },
  { href: "/muestras/noticia", number: "02", title: "Noticia", text: "Publicación completa con imagen, resumen y cuerpo." },
  { href: "/muestras/newsletter", number: "03", title: "Newsletter", text: "Ejemplo visual de un correo y del estado de una solicitud." },
  { href: "/muestras/popup", number: "04", title: "Pop-up", text: "Plantilla con imagen y apertura interactiva de prueba." },
] as const;

export default function SamplesPage() {
  return <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
      <Link href="/" className="font-display text-xl font-black tracking-tight">ACCIÓN<span className="text-primary">FÚTBOL</span></Link>
      <Link href="/formularios" className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold hover:border-primary">Volver al panel ↗</Link>
    </header>
    <div className="py-14 sm:py-20"><p className="section-tag">Muestras para revisión</p><h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">Así se verían los contenidos.</h1><p className="mt-5 max-w-2xl text-lg text-muted">Ejemplos ficticios guardados con el proyecto. Sirven para enseñar el diseño; no publican noticias, envían correos ni registran respuestas.</p></div>
    <div className="grid gap-4 md:grid-cols-2">{samples.map((sample) => <Link key={sample.href} href={sample.href} className="group rounded-3xl border border-white/15 bg-surface p-7 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span className="text-sm font-black tracking-widest text-primary">{sample.number} / MUESTRA</span><h2 className="mt-5 font-display text-3xl font-black">{sample.title}</h2><p className="mt-3 text-muted">{sample.text}</p><span className="mt-8 inline-flex min-h-11 items-center font-bold text-primary group-hover:text-foreground">Ver post de prueba ↗</span></Link>)}</div>
  </main>;
}
