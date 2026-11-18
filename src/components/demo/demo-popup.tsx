"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { demoPopup } from "@/lib/demo/examples";

export function DemoPopup() {
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

  return <>
    <div className="rounded-3xl border border-white/15 bg-surface p-7 sm:p-10">
      <p className="section-tag">Plantilla · Imagen dividida</p>
      <h2 className="mt-4 font-display text-3xl font-black">{demoPopup.title}</h2>
      <p className="mt-3 max-w-xl text-muted">{demoPopup.message}</p>
      <button type="button" onClick={() => setOpen(true)} className="mt-8 min-h-12 rounded-full bg-primary px-6 font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Abrir pop-up de prueba</button>
    </div>
    {open && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="demo-popup-title" onKeyDown={onKeyDown} className="relative grid max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-background shadow-2xl md:grid-cols-2">
        <div role="img" aria-label={demoPopup.imageAlt} className="min-h-52 bg-cover bg-center md:min-h-96" style={{ backgroundImage: `url(${JSON.stringify(demoPopup.imageUrl)})` }} />
        <div className="p-7 sm:p-10"><button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Cerrar aviso de prueba" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background text-foreground focus-visible:outline-2 focus-visible:outline-primary"><X className="size-5" /></button><p className="section-tag">{demoPopup.eyebrow}</p><h2 id="demo-popup-title" className="mt-4 pr-8 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{demoPopup.title}</h2><p className="mt-4 text-foreground/80">{demoPopup.message}</p><span className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground">{demoPopup.ctaLabel}</span><p className="mt-5 text-xs text-muted">Botón desactivado en esta muestra.</p></div>
      </section>
    </div>}
  </>;
}
