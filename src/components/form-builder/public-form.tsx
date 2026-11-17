"use client";

import { useState } from "react";
import type { FormDefinition } from "@/lib/forms/schema";

const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground";

export function PublicForm({ form }: { form: FormDefinition }) {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <form onSubmit={submit} className="space-y-5" aria-describedby="form-status">
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto size-px overflow-hidden"><label htmlFor="website-check">No completar</label><input id="website-check" name="_website" type="text" tabIndex={-1} autoComplete="off" /></div>
      {form.fields.map((field) => {
        const id = `field-${field.id}`;
        return <div key={field.id} className="space-y-1">
          {field.type === "checkbox" ? <label htmlFor={id} className="flex items-start gap-3">
            <input id={id} name={field.id} type="checkbox" required={field.required} aria-invalid={Boolean(errors[field.id])} />
            <span>{field.label}{field.required && " *"}</span>
          </label> : <>
            <label htmlFor={id} className="block">{field.label}{field.required && " *"}</label>
            {field.type === "textarea" ? <textarea id={id} name={field.id} required={field.required} maxLength={2000} className={inputClass} aria-invalid={Boolean(errors[field.id])} />
              : field.type === "select" ? <select id={id} name={field.id} required={field.required} defaultValue="" className={inputClass} aria-invalid={Boolean(errors[field.id])}>
                <option value="" disabled>Selecciona una opción</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select> : <input id={id} name={field.id} type={field.type} required={field.required} maxLength={2000} className={inputClass} aria-invalid={Boolean(errors[field.id])} />}
          </>}
          {errors[field.id] && <p className="text-sm text-red-700" role="alert">{errors[field.id]}</p>}
        </div>;
      })}
      <button type="submit" disabled={sending} className="rounded-full bg-foreground px-6 py-3 font-semibold text-background disabled:opacity-60">
        {sending ? "Enviando…" : "Enviar respuesta"}
      </button>
      <p id="form-status" role="status" aria-live="polite" className="text-sm">{status}</p>
    </form>
  );
}
