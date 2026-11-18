import Link from "next/link";
import { FormHeader } from "@/components/form-builder/form-header";
import { PublicForm } from "@/components/form-builder/public-form";
import { demoAnswers, demoForm } from "@/lib/demo/examples";

function answerFor(field: (typeof demoForm.fields)[number]) {
  const value = demoAnswers[field.id];
  if (field.type === "checkbox") return value ? "Sí, autorizó el contacto" : "No";
  if (field.type === "select") return field.options?.find((option) => option.value === value)?.label ?? "—";
  return String(value || "—");
}

export function DemoForm() {
  return <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.7fr)]">
    <div className="space-y-6">
      <FormHeader form={demoForm} as="h2" />
      <section className="rounded-[1.75rem] border border-white/15 bg-surface p-6 sm:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-white/15 pb-5"><div><p className="section-tag">Cuéntanos sobre ti</p><h2 className="mt-3 font-display text-2xl font-black">Tus datos para empezar</h2></div><p className="text-sm text-muted">* Campos obligatorios</p></div>
        <PublicForm form={demoForm} previewAnswers={demoAnswers} />
      </section>
    </div>
    <aside className="space-y-5">
      <section className="rounded-3xl border border-primary/30 bg-primary/10 p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-primary">Vista del equipo</p><h2 className="mt-3 font-display text-2xl font-black">Una solicitud, toda la información.</h2><p className="mt-3 text-sm leading-relaxed text-foreground/75">Así se ordenarían las respuestas en el panel después de un envío real. En esta muestra los datos son ficticios.</p></section>
      <section className="rounded-3xl border border-white/15 bg-surface p-6"><div className="flex items-center justify-between gap-3 border-b border-white/15 pb-5"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Respuesta de muestra</p><h3 className="mt-2 font-display text-xl font-black">Camila Ejemplo</h3></div><span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Kids</span></div><dl className="mt-5 space-y-4">{demoForm.fields.map((field) => <div key={field.id} className="grid gap-1 border-b border-white/10 pb-3 last:border-0"><dt className="text-xs font-bold uppercase tracking-wide text-muted">{field.label}</dt><dd className="break-words text-sm font-medium leading-relaxed">{answerFor(field)}</dd></div>)}</dl></section>
      <Link href="/#inscripcion" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm font-bold hover:border-primary hover:text-primary">Ver el flujo real de reservas ↗</Link>
    </aside>
  </div>;
}
