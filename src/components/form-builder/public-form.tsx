"use client";

import { useState } from "react";
import type { FormDefinition } from "@/lib/forms/schema";

const inputClass = "min-h-12 w-full rounded-xl border border-white/20 bg-background px-4 py-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-80";

export function PublicForm({ form, previewAnswers }: { form: FormDefinition; previewAnswers?: Record<string, string | boolean> }) {
  const preview = Boolean(previewAnswers);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) return;
    if (sending) return;
    const formElement = event.currentTarget;
    setSending(true);
    setStatus("");
    setErrors({});
    const data = new FormData(formElement);
    const answers = Object.fromEntries(form.fields.map((field) => [
      field.id,
      field.type === "checkbox" ? data.get(field.id) === "on" : String(data.get(field.id) ?? ""),
    ]));
    answers._website = String(data.get("_website") ?? "");
    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(form.slug)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.fields ?? {});
        setStatus(result.error ?? "No se pudo enviar el formulario.");
        return;
      }
      formElement.reset();
      setStatus("Respuesta recibida. Gracias por completar el formulario.");
    } catch {
      setStatus("No se pudo enviar el formulario. Revisa tu conexión e inténtalo otra vez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" aria-describedby="form-status">
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto size-px overflow-hidden"><label htmlFor="website-check">No completar</label><input id="website-check" name="_website" type="text" tabIndex={-1} autoComplete="off" /></div>
      {form.fields.map((field) => {
        const id = `field-${field.id}`;
        const fullWidth = field.type === "textarea" || field.type === "checkbox";
        return <div key={field.id} className={`space-y-2 ${fullWidth ? "sm:col-span-2" : ""}`}>
          {field.type === "checkbox" ? <label htmlFor={id} className="flex items-start gap-3 rounded-xl border border-white/15 bg-background/50 p-4">
            <input id={id} name={field.id} type="checkbox" required={field.required} checked={preview ? previewAnswers?.[field.id] === true : undefined} disabled={preview} aria-invalid={Boolean(errors[field.id])} className="mt-0.5 size-5 shrink-0 accent-primary" />
            <span>{field.label}{field.required && " *"}</span>
          </label> : <>
            <label htmlFor={id} className="block text-sm font-semibold">{field.label}{field.required && " *"}</label>
            {field.type === "textarea" ? <textarea id={id} name={field.id} required={field.required} maxLength={2000} className={inputClass} value={preview ? String(previewAnswers?.[field.id] ?? "") : undefined} disabled={preview} rows={4} aria-invalid={Boolean(errors[field.id])} />
              : field.type === "select" ? <select id={id} name={field.id} required={field.required} defaultValue={preview ? undefined : ""} value={preview ? String(previewAnswers?.[field.id] ?? "") : undefined} disabled={preview} className={inputClass} aria-invalid={Boolean(errors[field.id])}>
                <option value="" disabled>Selecciona una opción</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select> : <input id={id} name={field.id} type={field.type} required={field.required} maxLength={2000} className={inputClass} value={preview ? String(previewAnswers?.[field.id] ?? "") : undefined} disabled={preview} aria-invalid={Boolean(errors[field.id])} />}
          </>}
          {errors[field.id] && <p className="text-sm text-red-300" role="alert">{errors[field.id]}</p>}
        </div>;
      })}
      <button type={preview ? "button" : "submit"} disabled={sending || preview} className="min-h-12 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground disabled:opacity-75 sm:col-span-2 sm:w-fit">
        {sending ? "Enviando…" : "Enviar solicitud"}
      </button>
      <p id="form-status" role="status" aria-live="polite" className="text-sm sm:col-span-2">{preview ? "Vista de demostración: este formulario no envía datos." : status}</p>
    </form>
  );
}
