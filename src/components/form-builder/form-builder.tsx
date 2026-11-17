"use client";

import { useState } from "react";
import { formDefinitionSchema, type FormDefinition } from "@/lib/forms/schema";

type Field = FormDefinition["fields"][number];
type FieldType = Field["type"];
const types: { value: FieldType; label: string }[] = [
  { value: "text", label: "Texto" }, { value: "email", label: "Correo" },
  { value: "tel", label: "Teléfono" }, { value: "textarea", label: "Texto largo" },
  { value: "select", label: "Lista de opciones" }, { value: "checkbox", label: "Casilla" },
];
const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground";

const newField = (): Field => ({ id: `campo-${crypto.randomUUID().slice(0, 8)}`, label: "Nuevo campo", type: "text", required: false });

/** Editor en memoria. El componente no publica ni guarda datos por sí mismo. */
export function FormBuilder({ initialDraft, onDraftChange }: {
  initialDraft?: FormDefinition;
  onDraftChange?: (draft: FormDefinition) => void;
}) {
  const [draft, setDraft] = useState<FormDefinition>(() => initialDraft
    ? { ...initialDraft, status: "draft" }
    : { slug: "nuevo-formulario", title: "Nuevo formulario", version: 1, status: "draft", fields: [] });
  const valid = formDefinitionSchema.safeParse(draft).success;

  function change(next: FormDefinition) {
    setDraft(next);
    onDraftChange?.(next);
  }
  function changeField(id: string, update: (field: Field) => Field) {
    change({ ...draft, fields: draft.fields.map((field) => field.id === id ? update(field) : field) });
  }

  return (
    <div className="admin-builder">
      <section aria-labelledby="builder-title" className="admin-subpanel space-y-5">
        <div><h2 id="builder-title" className="text-2xl font-bold">Constructor de formularios</h2><p className="text-sm text-muted">Borrador local: los cambios se perderán al salir de esta página.</p></div>
        <label className="block space-y-1"><span>Título</span><input className={inputClass} maxLength={120} value={draft.title} onChange={(event) => change({ ...draft, title: event.target.value })} /></label>
        <label className="block space-y-1"><span>Identificador de enlace</span><input className={inputClass} maxLength={80} value={draft.slug} onChange={(event) => change({ ...draft, slug: event.target.value })} aria-describedby="slug-help" /><small id="slug-help" className="text-muted">Usa minúsculas, números y guiones.</small></label>
        <p role="status" className="admin-status text-sm">Estado: borrador · {valid ? "Datos válidos" : "Completa los campos y el identificador"}</p>
        {draft.fields.map((field, index) => (
          <fieldset key={field.id} className="space-y-3 rounded-xl border border-border bg-surface p-4">
            <legend className="px-1 font-semibold">Campo {index + 1}</legend>
            <label className="block space-y-1"><span>Pregunta</span><input className={inputClass} maxLength={120} value={field.label} onChange={(event) => changeField(field.id, (f) => ({ ...f, label: event.target.value }))} /></label>
            <label className="block space-y-1"><span>Tipo</span><select className={inputClass} value={field.type} onChange={(event) => changeField(field.id, (f) => {
              const type = event.target.value as FieldType;
              const { options: _options, ...rest } = f;
              void _options;
              return type === "select" ? { ...rest, type, options: [{ value: "opcion-1", label: "Opción 1" }] } : { ...rest, type };
            })}>{types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={field.required} onChange={(event) => changeField(field.id, (f) => ({ ...f, required: event.target.checked }))} /> Obligatorio</label>
            {field.type === "select" && <div className="space-y-2"><p>Opciones</p>{field.options?.map((option, optionIndex) => <div key={option.value} className="flex flex-wrap gap-2"><label className="min-w-40 flex-1"><span className="sr-only">Opción {optionIndex + 1}</span><input className={inputClass} maxLength={100} value={option.label} onChange={(event) => changeField(field.id, (f) => ({ ...f, options: f.options?.map((o) => o.value === option.value ? { ...o, label: event.target.value } : o) }))} /></label><button type="button" className="admin-button admin-button-danger" aria-label={`Eliminar opción ${optionIndex + 1}`} onClick={() => changeField(field.id, (f) => ({ ...f, options: f.options?.filter((o) => o.value !== option.value) }))}>Eliminar</button></div>)}<button type="button" className="admin-button" disabled={(field.options?.length ?? 0) >= 30} onClick={() => changeField(field.id, (f) => ({ ...f, options: [...(f.options ?? []), { value: `opcion-${crypto.randomUUID().slice(0, 8)}`, label: "Nueva opción" }] }))}>Añadir opción</button></div>}
            <button type="button" className="admin-button admin-button-danger" onClick={() => change({ ...draft, fields: draft.fields.filter((f) => f.id !== field.id) })}>Eliminar campo</button>
          </fieldset>
        ))}
        <button type="button" className="admin-button w-full" disabled={draft.fields.length >= 30} onClick={() => change({ ...draft, fields: [...draft.fields, newField()] })}>+ Añadir campo</button>
      </section>
      <section aria-labelledby="preview-title" className="admin-subpanel h-fit space-y-4">
        <h2 id="preview-title" className="text-xl font-bold">Vista previa</h2>
        <p className="text-sm text-muted">Vista de muestra; no envía respuestas.</p>
        <h3 className="text-lg font-semibold">{draft.title || "Formulario sin título"}</h3>
        {draft.fields.map((field) => <div key={field.id} className="space-y-1"><label htmlFor={`preview-${field.id}`} className="block">{field.label || "Campo sin título"}{field.required && " *"}</label>{field.type === "textarea" ? <textarea id={`preview-${field.id}`} className={inputClass} disabled /> : field.type === "select" ? <select id={`preview-${field.id}`} className={inputClass} disabled><option>Selecciona una opción</option>{field.options?.map((o) => <option key={o.value}>{o.label}</option>)}</select> : <input id={`preview-${field.id}`} type={field.type} className={field.type === "checkbox" ? "size-4" : inputClass} disabled />}</div>)}
      </section>
    </div>
  );
}
