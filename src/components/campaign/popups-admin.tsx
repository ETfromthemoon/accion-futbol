"use client";

import { useCallback, useEffect, useState } from "react";
import type { PopupDefinition } from "@/lib/popups/schema";

const initial: PopupDefinition = {
  name: "Nuevo aviso", status: "draft", template: "classic", path: "/", trigger: "delay",
  delaySeconds: 5, scrollPercent: 50, frequencyDays: 7, startsAt: "", endsAt: "",
  eyebrow: "Acción Fútbol", title: "Hay algo para ti", message: "Conoce las novedades de nuestra academia.",
  imageUrl: "", imageAlt: "", ctaLabel: "Conocer más", ctaHref: "#inscripcion",
};
const control = "w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground";
const label = "grid gap-1 text-sm font-medium";
const images = ["", "/images/hero-night.webp", "/images/kids-joy.webp", "/images/group-team.webp", "/images/femenino.webp"];

function localDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function PopupsAdmin() {
  const [popups, setPopups] = useState<PopupDefinition[]>([]);
  const [draft, setDraft] = useState<PopupDefinition>(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const update = <K extends keyof PopupDefinition>(key: K, value: PopupDefinition[K]) => setDraft((old) => ({ ...old, [key]: value }));
  const load = useCallback(async () => {
    const response = await fetch("/api/popups/admin", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los avisos.");
    setPopups((await response.json()).popups);
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/popups/admin", { cache: "no-store" })
      .then((response) => { if (!response.ok) throw new Error("No se pudieron cargar los avisos."); return response.json(); })
      .then((result) => { if (active) setPopups(result.popups); })
      .catch((error: Error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  async function save(status: "draft" | "published") {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/popups/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...draft, status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar.");
      setDraft(result.popup); await load();
      setMessage(status === "published" ? "Aviso publicado. Comprueba la página y el activador elegidos." : "Borrador guardado.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar."); }
    finally { setBusy(false); }
  }

  return <section id="panel-popups" className="admin-content scroll-mt-24">
    <div className="admin-panel admin-panel-intro"><h2 className="text-2xl font-bold">Generador de pop-ups</h2><p className="text-sm">Crea avisos por página con tres plantillas y activación por tiempo, desplazamiento o salida.</p><a className="admin-button admin-button-primary w-fit" href="/muestras/popup" target="_blank" rel="noopener noreferrer">Ver post de prueba ↗</a></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
      <div className="admin-panel space-y-5">
        <div className="admin-form-group"><h3>01 / Dónde y cuándo aparece</h3><div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>Nombre interno<input className={control} maxLength={100} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label className={label}>Plantilla<select className={control} value={draft.template} onChange={(event) => update("template", event.target.value as PopupDefinition["template"])}><option value="classic">Clásica</option><option value="split">Imagen dividida</option><option value="banner">Aviso compacto</option></select></label>
          <label className={label}>Mostrar en<select className={control} value={["all", "/", "/formularios/clase-de-prueba"].includes(draft.path) ? draft.path : "custom"} onChange={(event) => update("path", event.target.value === "custom" ? "/formularios/clase-de-prueba" : event.target.value)}><option value="/">Inicio</option><option value="all">Todas las páginas públicas</option><option value="/formularios/clase-de-prueba">Formulario de clase de prueba</option><option value="custom">Otra ruta</option></select></label>
          <label className={label}>Ruta exacta<input className={control} value={draft.path === "all" ? "" : draft.path} disabled={draft.path === "all"} placeholder="/formularios/mi-formulario" onChange={(event) => update("path", event.target.value)} /></label>
          <label className={label}>Activador<select className={control} value={draft.trigger} onChange={(event) => update("trigger", event.target.value as PopupDefinition["trigger"])}><option value="delay">Tiempo en página</option><option value="scroll">Porcentaje de scroll</option><option value="exit">Intento de salida (escritorio)</option></select></label>
          {draft.trigger === "delay" && <label className={label}>Segundos<input className={control} type="number" min={0} max={120} value={draft.delaySeconds} onChange={(event) => update("delaySeconds", Number(event.target.value))} /></label>}
          {draft.trigger === "scroll" && <label className={label}>Porcentaje de scroll<input className={control} type="number" min={5} max={95} value={draft.scrollPercent} onChange={(event) => update("scrollPercent", Number(event.target.value))} /></label>}
          <label className={label}>Días antes de repetir<input className={control} type="number" min={0} max={90} value={draft.frequencyDays} onChange={(event) => update("frequencyDays", Number(event.target.value))} /></label>
          <label className={label}>Desde (opcional)<input className={control} type="datetime-local" value={localDate(draft.startsAt)} onChange={(event) => update("startsAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /></label>
          <label className={label}>Hasta (opcional)<input className={control} type="datetime-local" value={localDate(draft.endsAt)} onChange={(event) => update("endsAt", event.target.value ? new Date(event.target.value).toISOString() : "")} /></label>
        </div></div>
        <div className="admin-form-group"><h3>02 / Contenido del aviso</h3><div className="grid gap-4">
          <label className={label}>Texto superior<input className={control} maxLength={80} value={draft.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} /></label>
          <label className={label}>Título<input className={control} maxLength={140} value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label className={label}>Mensaje<textarea className={control} rows={3} maxLength={500} value={draft.message} onChange={(event) => update("message", event.target.value)} /></label>
          <label className={label}>Imagen de la web<select className={control} value={images.includes(draft.imageUrl) ? draft.imageUrl : "custom"} onChange={(event) => update("imageUrl", event.target.value === "custom" ? "" : event.target.value)}>{images.map((image) => <option key={image} value={image}>{image || "Sin imagen"}</option>)}<option value="custom">URL propia</option></select></label>
          <label className={label}>URL de imagen<input className={control} maxLength={500} placeholder="/images/imagen.webp o https://..." value={draft.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} /></label>
          <label className={label}>Descripción de imagen<input className={control} maxLength={140} value={draft.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className={label}>Texto del botón<input className={control} maxLength={60} value={draft.ctaLabel} onChange={(event) => update("ctaLabel", event.target.value)} /></label><label className={label}>Destino del botón<input className={control} maxLength={500} placeholder="#inscripcion o /formularios/slug" value={draft.ctaHref} onChange={(event) => update("ctaHref", event.target.value)} /></label></div>
        </div></div>
        <div className="admin-actions"><button className="admin-button" type="button" disabled={busy} onClick={() => save("draft")}>Guardar borrador</button><button className="admin-button admin-button-primary" type="button" disabled={busy} onClick={() => save("published")}>Publicar aviso</button><button className="admin-button admin-button-quiet" type="button" onClick={() => setDraft(initial)}>Nuevo aviso</button></div>
        <p role="status" aria-live="polite" className="admin-status text-sm">{message}</p>
      </div>
      <div className="space-y-5"><div className="admin-panel"><h3 className="mb-4 font-semibold">Vista previa de contenido</h3><div className="overflow-hidden rounded-2xl border border-white/15 bg-background shadow-xl">{draft.imageUrl && <div role="img" aria-label={draft.imageAlt || draft.title} className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(draft.imageUrl)})` }} />}<div className="p-6"><p className="section-tag">{draft.eyebrow}</p><p className="mt-3 font-display text-2xl font-extrabold">{draft.title}</p><p className="mt-3 text-sm text-muted">{draft.message}</p><span className="mt-5 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{draft.ctaLabel}</span></div></div></div>
        <div className="admin-panel space-y-3"><h3 className="font-semibold">Avisos guardados</h3>{popups.length === 0 ? <p className="text-sm text-muted">Todavía no hay avisos.</p> : popups.map((item) => <div key={item.id} className="admin-list-item"><div><strong>{item.name}</strong><p className="text-xs">{item.status === "published" ? "Publicado" : "Borrador"} · {item.path === "all" ? "Todas las páginas" : item.path} · {item.trigger}</p></div><div className="flex flex-wrap gap-2"><button type="button" className="admin-button" onClick={() => { setDraft(item); setMessage(""); }}>Editar</button>{item.status === "published" && <button type="button" className="admin-button admin-button-danger" onClick={() => { setDraft({ ...item, status: "draft" }); setMessage("Guarda el borrador para retirar este aviso."); }}>Preparar retiro</button>}</div></div>)}</div>
      </div>
    </div>
  </section>;
}
