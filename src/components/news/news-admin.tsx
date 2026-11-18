"use client";

import { useCallback, useEffect, useState } from "react";
import type { NewsInput, NewsPost } from "@/lib/news/schema";
import { demoNews } from "@/lib/demo/examples";

const initial: NewsInput = {
  slug: "nueva-noticia", title: "Nueva noticia", summary: "", body: "",
  coverImage: "", coverAlt: "", status: "draft",
};
const control = "w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground";
const label = "grid gap-1 text-sm font-medium";
const images = ["", "/images/hero-night.webp", "/images/kids-joy.webp", "/images/group-team.webp", "/images/femenino.webp"];

export function NewsAdmin() {
  const [items, setItems] = useState<NewsPost[]>([]);
  const [draft, setDraft] = useState<NewsInput>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const update = <K extends keyof NewsInput>(key: K, value: NewsInput[K]) => setDraft((old) => ({ ...old, [key]: value }));
  function loadDemo() {
    const { id: _id, publishedAt: _publishedAt, createdAt: _createdAt, updatedAt: _updatedAt, ...content } = demoNews;
    void _id; void _publishedAt; void _createdAt; void _updatedAt;
    setDraft(content);
    setMessage("Ejemplo cargado. Revisa los datos antes de guardarlo como borrador.");
  }

  const load = useCallback(async () => {
    const response = await fetch("/api/news/admin", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar las noticias.");
    setItems((await response.json()).news);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/news/admin", { cache: "no-store" })
      .then((response) => { if (!response.ok) throw new Error("No se pudieron cargar las noticias."); return response.json(); })
      .then((result) => { if (active) setItems(result.news); })
      .catch((error: Error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  async function save(status: "draft" | "published") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/news/admin", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, status, publishedAt: undefined, createdAt: undefined, updatedAt: undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar la noticia.");
      setDraft(result.news);
      await load();
      setMessage(status === "published" ? `Publicada: /noticias/${result.news.slug}` : "Borrador guardado. La noticia no se muestra públicamente.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar la noticia."); }
    finally { setBusy(false); }
  }

  return <section id="panel-news" className="admin-content scroll-mt-24">
    <div className="admin-panel admin-panel-intro">
      <h2 className="text-2xl font-bold">Noticias del sitio</h2>
      <p>Crea publicaciones para la portada y el archivo de noticias. El newsletter continúa separado.</p>
      <div className="flex flex-wrap gap-2"><a className="admin-button admin-button-primary w-fit" href="/muestras/noticia" target="_blank" rel="noopener noreferrer">Ver post de prueba ↗</a><button type="button" className="admin-button" onClick={loadDemo}>Cargar ejemplo en editor</button></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
      <div className="admin-panel space-y-5">
        <div className="admin-form-group">
          <h3>01 / Identidad de la noticia</h3>
          <label className={label}>Título<input className={control} maxLength={120} value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label className={label}>Identificador del enlace<input className={control} maxLength={80} value={draft.slug} onChange={(event) => update("slug", event.target.value)} aria-describedby="news-slug-help" /><small id="news-slug-help" className="text-muted">Solo minúsculas, números y guiones. Se verá en /noticias/identificador.</small></label>
          <label className={label}>Resumen<textarea className={control} rows={3} maxLength={280} value={draft.summary} onChange={(event) => update("summary", event.target.value)} /><small className="text-muted">Aparece en la portada y en la lista de noticias.</small></label>
        </div>
        <div className="admin-form-group">
          <h3>02 / Contenido e imagen</h3>
          <label className={label}>Contenido<textarea className={control} rows={12} maxLength={12_000} value={draft.body} onChange={(event) => update("body", event.target.value)} /><small className="text-muted">Escribe en texto simple. Separa párrafos con una línea en blanco.</small></label>
          <label className={label}>Imagen de la web<select className={control} value={images.includes(draft.coverImage) ? draft.coverImage : "custom"} onChange={(event) => update("coverImage", event.target.value === "custom" ? "" : event.target.value)}>{images.map((image) => <option key={image} value={image}>{image || "Sin imagen"}</option>)}<option value="custom">URL propia</option></select></label>
          <label className={label}>URL de imagen<input className={control} maxLength={500} placeholder="/images/imagen.webp o https://..." value={draft.coverImage} onChange={(event) => update("coverImage", event.target.value)} /></label>
          <label className={label}>Descripción de imagen<input className={control} maxLength={140} value={draft.coverAlt} onChange={(event) => update("coverAlt", event.target.value)} /><small className="text-muted">Obligatoria si la noticia tiene imagen.</small></label>
        </div>
        <div className="admin-actions">
          <button type="button" className="admin-button" disabled={busy} onClick={() => save("draft")}>{draft.id && draft.status === "published" ? "Retirar publicación" : "Guardar borrador"}</button>
          <button type="button" className="admin-button admin-button-primary" disabled={busy} onClick={() => save("published")}>Publicar noticia</button>
          <button type="button" className="admin-button admin-button-quiet" disabled={busy} onClick={() => { setDraft(initial); setMessage(""); }}>Nueva noticia</button>
        </div>
        <p role="status" aria-live="polite" className="admin-status text-sm">{message}</p>
      </div>
      <div className="space-y-5">
        <div className="admin-panel space-y-4"><h3>Vista previa</h3><div className="overflow-hidden rounded-xl border border-border bg-background">
          {draft.coverImage && <div role="img" aria-label={draft.coverAlt || draft.title} className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(draft.coverImage)})` }} />}
          <div className="p-5"><p className="section-tag">Noticias de la cancha</p><p className="mt-3 font-display text-2xl font-extrabold">{draft.title || "Sin título"}</p><p className="mt-2 text-sm text-muted">{draft.summary || "El resumen aparecerá aquí."}</p></div>
        </div></div>
        <div className="admin-panel space-y-4"><h3>Publicaciones guardadas</h3>{items.length === 0 ? <p className="text-sm text-muted">Todavía no hay noticias.</p> : items.map((item) => <article key={item.id} className="admin-list-item">
          <div><strong>{item.title}</strong><p className="text-xs">{item.status === "published" ? "Publicada" : "Borrador"} · /noticias/{item.slug}</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" className="admin-button" onClick={() => { setDraft(item); setMessage(""); }}>Editar</button>{item.status === "published" && <a className="admin-button admin-inline-link" href={`/noticias/${item.slug}`} target="_blank" rel="noreferrer">Ver noticia ↗</a>}</div>
        </article>)}</div>
      </div>
    </div>
  </section>;
}
