import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicForm } from "@/components/form-builder/public-form";
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
  return <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
    <Link href="/" className="text-sm underline">Acción Fútbol</Link>
    <h1 className="mt-8 text-4xl font-bold">{form.title}</h1>
    <p className="mb-8 mt-3 text-sm text-muted">Los campos marcados con * son obligatorios.</p>
    <PublicForm form={form} />
  </main>;
}
