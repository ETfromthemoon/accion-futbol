"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { demoPopup } from "@/lib/demo/examples";
import type { PopupDefinition } from "@/lib/popups/schema";

type Template = PopupDefinition["template"];
const templates: { id: Template; label: string; detail: string }[] = [
  { id: "split", label: "Imagen dividida", detail: "Imagen y mensaje en equilibrio" },
  { id: "classic", label: "Clásica", detail: "Invitación centrada" },
  { id: "banner", label: "Compacta", detail: "Mensaje breve y directo" },
];

function PopupCard({ template, onClose, closeRef }: { template: Template; onClose?: () => void; closeRef?: React.Ref<HTMLButtonElement> }) {
  const split = template === "split";
  return <div className={`relative grid overflow-hidden rounded-3xl border border-white/15 bg-background text-foreground shadow-2xl ${split ? "md:grid-cols-2" : ""}`}>
    {split && <div role="img" aria-label={demoPopup.imageAlt} className="min-h-52 bg-cover bg-center md:min-h-96" style={{ backgroundImage: `url(${JSON.stringify(demoPopup.imageUrl)})` }} />}
    <div className={template === "banner" ? "p-6 sm:p-8" : "p-7 sm:p-10"}>
      {onClose && <button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar aviso de prueba" className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground focus-visible:outline-2 focus-visible:outline-primary"><X aria-hidden="true" className="size-5" /></button>}
      {!split && <div role="img" aria-label={demoPopup.imageAlt} className={`mb-6 rounded-2xl bg-cover bg-center ${template === "banner" ? "h-28" : "h-44"}`} style={{ backgroundImage: `url(${JSON.stringify(demoPopup.imageUrl)})` }} />}
      <p className="section-tag">{demoPopup.eyebrow}</p>
      <h3 id={onClose ? "demo-popup-title" : undefined} className={`mt-4 pr-8 font-display font-black leading-tight ${template === "banner" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>{demoPopup.title}</h3>
      <p className="mt-4 leading-relaxed text-foreground/80">{demoPopup.message}</p>
      <a href={`/${demoPopup.ctaHref}`} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{demoPopup.ctaLabel} ↗</a>
    </div>
  </div>;
}

export function DemoPopup() {
  const [template, setTemplate] = useState<Template>(demoPopup.template);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
    if (event.key !== "Tab") return;
    const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(270px,.65fr)]">
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/15 bg-surface p-5 sm:p-7"><p className="section-tag">Tres formas de presentar el mismo mensaje</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{templates.map((item) => <button key={item.id} type="button" aria-pressed={template === item.id} onClick={() => setTemplate(item.id)} className={`min-h-20 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${template === item.id ? "border-primary bg-primary/15 text-foreground" : "border-white/15 bg-background text-muted hover:border-primary/60 hover:text-foreground"}`}><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs">{item.detail}</span></button>)}</div></div>
      <PopupCard template={template} />
      <button type="button" onClick={() => setOpen(true)} className="min-h-12 rounded-full border border-white/30 px-6 text-sm font-bold hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Abrir como pop-up real ↗</button>
    </div>
    <aside className="space-y-5"><div className="rounded-3xl border border-primary/30 bg-primary/10 p-6"><p className="section-tag">Configuración de muestra</p><h2 className="mt-3 font-display text-2xl font-black">Un mensaje, el momento correcto.</h2><p className="mt-3 text-sm leading-relaxed text-foreground/75">El panel permite decidir dónde aparece, cuándo se activa y cuánto tiempo pasa antes de repetirlo.</p></div><dl className="rounded-3xl border border-white/15 bg-surface p-6 text-sm">{[["Página", "Inicio"], ["Activador", `Después de ${demoPopup.delaySeconds} segundos`], ["Frecuencia", `Cada ${demoPopup.frequencyDays} días`], ["Imagen", "Foto del equipo"], ["Destino", "Reserva de clase de prueba"]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-white/10 py-3 first:pt-0 last:border-0 last:pb-0"><dt className="font-semibold text-muted">{label}</dt><dd className="text-right font-bold">{value}</dd></div>)}</dl><p className="text-xs leading-relaxed text-muted">El enlace del botón abre el flujo real de reserva. Este aviso de muestra no se ha publicado como campaña.</p></aside>
    {open && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="demo-popup-title" onKeyDown={onKeyDown} className={`max-h-[90dvh] w-full overflow-y-auto ${template === "split" ? "max-w-3xl" : template === "banner" ? "max-w-2xl" : "max-w-lg"}`}><PopupCard template={template} onClose={() => setOpen(false)} closeRef={closeRef} /></section></div>}
  </div>;
}
