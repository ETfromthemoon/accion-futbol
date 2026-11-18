import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoForm } from "@/components/demo/demo-form";
import { DemoNews } from "@/components/demo/demo-news";
import { DemoNewsletter } from "@/components/demo/demo-newsletter";
import { DemoPopup } from "@/components/demo/demo-popup";

type Sample = "formulario" | "noticia" | "newsletter" | "popup";
type Props = { params: Promise<{ tipo: string }> };
const samples: Record<Sample, { number: string; label: string; title: string; summary: string }> = {
  formulario: { number: "01", label: "Formulario", title: "Una inscripción que llega completa.", summary: "Una portada clara, nueve preguntas bien elegidas y una respuesta ordenada para que el equipo pueda continuar la conversación." },
  noticia: { number: "02", label: "Noticia", title: "Una historia que merece ser leída.", summary: "Imagen, titular, resumen y un relato que presenta la academia con la misma información que aparecería en portada." },
  newsletter: { number: "03", label: "Newsletter", title: "Una comunidad que sigue en contacto.", summary: "Un concepto visual de correo y la solicitud que hoy puede registrarse desde el sitio, con sus límites claramente identificados." },
  popup: { number: "04", label: "Pop-up", title: "Un mensaje en el momento justo.", summary: "Una campaña de muestra con imagen, enlace y activador, presentada en las tres plantillas disponibles en el panel." },
};
const kinds = Object.keys(samples) as Sample[];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  return { title: `${samples[tipo as Sample]?.label ?? "Muestra"} de prueba | Acción Fútbol`, robots: { index: false, follow: false } };
}

export default async function SamplePage({ params }: Props) {
  const { tipo } = await params;
  if (!kinds.includes(tipo as Sample)) notFound();
  const kind = tipo as Sample;
  const sample = samples[kind];
  return <main className="mx-auto min-h-screen max-w-7xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6"><Link href="/" className="font-display text-xl font-black tracking-tight">ACCIÓN<span className="text-primary">FÚTBOL</span></Link><Link href="/muestras" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm font-bold hover:border-primary hover:text-primary">Todas las muestras ↗</Link></header>
    <nav aria-label="Tipos de muestra" className="mt-7 flex flex-wrap gap-2">{kinds.map((item) => <Link key={item} href={`/muestras/${item}`} aria-current={item === kind ? "page" : undefined} className={`inline-flex min-h-10 items-center rounded-full border px-4 text-xs font-bold transition-colors ${item === kind ? "border-primary bg-primary text-primary-foreground" : "border-white/20 text-muted hover:border-primary hover:text-foreground"}`}>{samples[item].number} / {samples[item].label}</Link>)}</nav>
    <div className="max-w-4xl pb-9 pt-14 sm:pt-20"><p className="section-tag">Demostración / {sample.number} / {sample.label}</p><h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">{sample.title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{sample.summary}</p><p className="mt-6 inline-flex rounded-xl border border-primary/35 bg-primary/10 px-4 py-3 text-xs leading-relaxed text-foreground/80">Contenido de ejemplo guardado en el proyecto. No crea publicaciones, respuestas, contactos ni envíos reales.</p></div>
    {kind === "formulario" && <DemoForm />}
    {kind === "noticia" && <DemoNews />}
    {kind === "newsletter" && <DemoNewsletter />}
    {kind === "popup" && <DemoPopup />}
  </main>;
}
