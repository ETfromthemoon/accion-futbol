"use client";

import { useCallback, useEffect, useState } from "react";
import { FormBuilder } from "./form-builder";
import type { FormDefinition } from "@/lib/forms/schema";
import { PopupsAdmin } from "@/components/campaign/popups-admin";
import { NewsletterAdmin } from "@/components/newsletter/newsletter-admin";

type Submission = { id: string; version: number; answers: Record<string, string | boolean>; fieldLabels: Record<string, string>; createdAt: string; sheetsStatus: string; sheetsAttempts: number };
type ManagedForm = FormDefinition & { publishedVersion: number | null };
const emptyDraft: FormDefinition = { slug: "nuevo-formulario", title: "Nuevo formulario", version: 1, status: "draft", fields: [] };
const control = "rounded-lg border border-border px-4 py-2";
const templateDrafts: FormDefinition[] = [
  { ...emptyDraft, slug: "clase-de-prueba", title: "Clase de prueba" },
  { ...emptyDraft, slug: "seleccion-pro", title: "Selección Pro" },
];

export function FormsAdmin({ authenticated, sheetsConfigured }: { authenticated: boolean; sheetsConfigured: boolean }) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [forms, setForms] = useState<ManagedForm[]>([]);
  const [editing, setEditing] = useState<FormDefinition | null>(null);
  const [draft, setDraft] = useState<FormDefinition>(emptyDraft);
  const [editorRevision, setEditorRevision] = useState(0);
  const [activeSlug, setActiveSlug] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"forms" | "newsletter" | "popups">("forms");

  const loadForms = useCallback(async () => {
    const response = await fetch("/api/forms/admin", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los formularios.");
    setForms((await response.json()).forms);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    loadForms().catch((error: Error) => setMessage(error.message));
  }, [loggedIn, loadForms]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/forms/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo iniciar sesión.");
      setPassword("");
      setLoggedIn(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión."); }
    finally { setBusy(false); }
  }

  async function save(status: "draft" | "published") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/forms/admin", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar el formulario.");
      setEditing(result.form);
      setDraft(result.form);
      await loadForms();
      setMessage(status === "published" ? `Publicado: /formularios/${result.form.slug}` : "Borrador guardado.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar el formulario."); }
    finally { setBusy(false); }
  }

  async function showSubmissions(slug: string) {
    setActiveSlug(slug);
    setMessage("");
    try {
      const response = await fetch(`/api/forms/admin/${encodeURIComponent(slug)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudieron cargar las respuestas.");
      setSubmissions(result.submissions);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudieron cargar las respuestas."); }
  }

  async function action(slug: string, action: "archive" | "retry-sheets") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/forms/admin/${encodeURIComponent(slug)}`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo completar la acción.");
      await loadForms();
      if (activeSlug === slug) await showSubmissions(slug);
      setMessage(action === "archive" ? "Formulario archivado." : `Reintentos realizados: ${result.retried}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo completar la acción."); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/forms/admin/session", { method: "DELETE" });
    setLoggedIn(false);
    setForms([]);
    setSubmissions([]);
    setActiveSlug("");
  }

  if (!loggedIn) return <section className="mx-auto max-w-md space-y-5 rounded-2xl border border-border p-6">
    <h2 className="text-xl font-bold">Acceso del equipo</h2>
    <form onSubmit={login} className="space-y-4">
      <label className="block space-y-2"><span>Contraseña administrativa</span><input className={`${control} w-full`} type="password" autoComplete="current-password" maxLength={1024} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      <button className="rounded-full bg-foreground px-5 py-3 text-background disabled:opacity-50" disabled={busy}>{busy ? "Ingresando…" : "Ingresar"}</button>
    </form>
    <p role="status" aria-live="polite" className="text-sm">{message}</p>
  </section>;

  return <div className="space-y-10">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold">Panel de contenido</h2><p className="text-sm text-muted">Gestiona formularios, solicitudes de newsletter y avisos emergentes.</p></div><button className={control} onClick={logout}>Cerrar sesión</button></div>
    <nav aria-label="Herramientas del panel" className="flex flex-wrap gap-2 border-b border-border pb-4">{([['forms', 'Formularios'], ['newsletter', 'Newsletter'], ['popups', 'Pop-ups']] as const).map(([id, title]) => <button key={id} type="button" aria-current={tab === id ? "page" : undefined} className={tab === id ? "rounded-full bg-primary px-5 py-2 font-semibold text-white" : "rounded-full border border-border px-5 py-2"} onClick={() => setTab(id)}>{title}</button>)}</nav>
    {tab === "forms" && <div className="space-y-10">
    {!sheetsConfigured && <p className="rounded-xl border border-border p-4 text-sm text-muted">Las respuestas se guardan en este panel. La copia a Google Sheets se habilitará cuando esté lista la hoja del cliente.</p>}
    <section className="space-y-5"><h3 className="text-xl font-semibold">{editing ? "Preparar formulario" : "Crear formulario"}</h3>
      <div className="space-y-2"><p className="text-sm text-muted">Bases orientativas: solo incluyen nombre y enlace sugeridos. Completa sus campos después de revisar los formularios actuales del cliente.</p><div className="flex flex-wrap gap-2">{templateDrafts.map((template) => <button key={template.slug} type="button" className={control} onClick={() => { setEditing(template); setDraft(template); }}>Usar base: {template.title}</button>)}</div></div>
      <FormBuilder key={`${editing ? `${editing.slug}-${editing.version}` : "new"}-${editorRevision}`} initialDraft={editing ?? emptyDraft} onDraftChange={setDraft} />
      <div className="flex flex-wrap gap-3"><button type="button" className={control} disabled={busy} onClick={() => save("draft")}>Guardar borrador</button><button type="button" className="rounded-lg bg-foreground px-4 py-2 text-background" disabled={busy} onClick={() => save("published")}>Publicar versión</button>
        {editing && <button type="button" className={control} onClick={() => { setEditing(null); setDraft(emptyDraft); setEditorRevision((value) => value + 1); }}>Nuevo formulario</button>}</div>
    </section>
    <section className="space-y-4"><h3 className="text-xl font-semibold">Formularios</h3>
      {forms.length === 0 ? <p className="text-sm text-muted">Todavía no hay formularios.</p> : <div className="space-y-3">{forms.map((form) => <article key={form.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
        <div><h4 className="font-semibold">{form.title}</h4><p className="text-sm text-muted">Borrador v{form.version}{form.publishedVersion && <> · publicado v{form.publishedVersion} · <a className="underline" href={`/formularios/${form.slug}`} target="_blank" rel="noreferrer">Abrir enlace</a></>}</p></div>
        <div className="flex flex-wrap gap-2"><button className={control} onClick={() => { const { publishedVersion: _publishedVersion, ...definition } = form; void _publishedVersion; setEditing(definition); setDraft({ ...definition, status: "draft" }); }}>Crear versión</button><button className={control} onClick={() => showSubmissions(form.slug)}>Ver respuestas</button>{form.publishedVersion && <button className={control} onClick={() => action(form.slug, "archive")}>Archivar publicación</button>}</div>
      </article>)}</div>}
    </section>
    {activeSlug && <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-semibold">Respuestas: {activeSlug}</h3>{sheetsConfigured && <button className={control} onClick={() => action(activeSlug, "retry-sheets")}>Reintentar pendientes de Sheets</button>}</div>
      {submissions.length === 0 ? <p className="text-sm text-muted">No hay respuestas guardadas.</p> : <div className="space-y-3">{submissions.map((submission) => <article key={submission.id} className="space-y-2 rounded-xl border border-border p-4"><p className="text-sm text-muted">{new Date(submission.createdAt).toLocaleString("es-CL")} · versión {submission.version}{sheetsConfigured && <> · Sheets: {submission.sheetsStatus} ({submission.sheetsAttempts} intentos)</>}</p><dl className="grid gap-2 sm:grid-cols-2">{Object.entries(submission.answers).map(([key, value]) => <div key={key}><dt className="text-xs text-muted">{submission.fieldLabels[key] ?? key}</dt><dd className="break-words">{String(value)}</dd></div>)}</dl></article>)}</div>}
    </section>}
    <p role="status" aria-live="polite" className="text-sm">{message}</p>
    </div>}
    {tab === "newsletter" && <NewsletterAdmin />}
    {tab === "popups" && <PopupsAdmin />}
  </div>;
}
