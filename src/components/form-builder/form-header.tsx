import type { FormDefinition } from "@/lib/forms/schema";

export function FormHeader({ form, as: Heading = "h1" }: { form: FormDefinition; as?: "h1" | "h2" }) {
  return <header className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-surface">
    {form.coverImage && <div role="img" aria-label={form.coverAlt || form.title} className="aspect-[2.5/1] min-h-48 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgb(0 0 0 / .28), transparent), url(${JSON.stringify(form.coverImage)})` }} />}
    <div className="p-6 sm:p-10">
      <p className="section-tag">Acción Fútbol · Inscripción</p>
      <Heading className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">{form.title}</Heading>
      {form.description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">{form.description}</p>}
    </div>
  </header>;
}
