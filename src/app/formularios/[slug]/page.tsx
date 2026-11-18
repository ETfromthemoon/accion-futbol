import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicForm } from "@/components/form-builder/public-form";
import { FormHeader } from "@/components/form-builder/form-header";
import { getPublishedForm } from "@/lib/forms/repository";

export const dynamic = "force-dynamic";

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let form;
  try {
    form = await getPublishedForm(slug);
  } catch {
    return <main className="mx-auto max-w-2xl px-6 py-20"><h1 className="text-3xl font-bold">Formularios temporalmente no disponibles</h1><p className="mt-3">Inténtalo más tarde.</p></main>;
  }
  if (!form) notFound();
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-8 sm:px-8 sm:py-14">
    <Link href="/" className="mb-7 inline-flex min-h-11 items-center text-sm font-bold text-primary hover:text-foreground">← Volver a Acción Fútbol</Link>
    <FormHeader form={form} />
    <section className="mt-6 rounded-[1.75rem] border border-white/15 bg-surface p-6 sm:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-white/15 pb-5"><div><p className="section-tag">Cuéntanos sobre ti</p><h2 className="mt-3 font-display text-2xl font-black">Tus datos para empezar</h2></div><p className="text-sm text-muted">* Campos obligatorios</p></div>
      <PublicForm form={form} />
    </section>
  </main>;
}
