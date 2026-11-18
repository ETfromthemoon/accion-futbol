"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { PopupDefinition } from "@/lib/popups/schema";

function shouldShow(popup: PopupDefinition) {
  try {
    const seen = Number(localStorage.getItem(`accion-futbol:popup:${popup.id}`));
    return !seen || Date.now() - seen >= popup.frequencyDays * 86_400_000;
  } catch { return false; }
}

export function CampaignPopup() {
  const pathname = usePathname();
  const [popup, setPopup] = useState<PopupDefinition | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    if (path === "/formularios" || path === "/muestras" || path.startsWith("/muestras/")) return;
    let cancelled = false;
    let cleanupTrigger = () => {};
    fetch(`/api/popups?path=${encodeURIComponent(path)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { popups: [] })
      .then(({ popups }: { popups: PopupDefinition[] }) => {
        if (cancelled) return;
        const next = popups.find(shouldShow);
        if (!next) return;
        const show = () => { if (!cancelled) setPopup(next); };
        if (next.trigger === "delay") {
          const timer = window.setTimeout(show, next.delaySeconds * 1000);
          cleanupTrigger = () => window.clearTimeout(timer);
        } else if (next.trigger === "scroll") {
          const onScroll = () => {
            const available = document.documentElement.scrollHeight - window.innerHeight;
            if (available > 0 && window.scrollY / available * 100 >= next.scrollPercent) {
              window.removeEventListener("scroll", onScroll);
              show();
            }
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
          cleanupTrigger = () => window.removeEventListener("scroll", onScroll);
        } else {
          const onExit = (event: MouseEvent) => {
            if (event.clientY <= 0 && !event.relatedTarget) {
              document.removeEventListener("mouseout", onExit);
              show();
            }
          };
          document.addEventListener("mouseout", onExit);
          cleanupTrigger = () => document.removeEventListener("mouseout", onExit);
        }
      }).catch(() => {});
    return () => { cancelled = true; cleanupTrigger(); };
  }, [pathname]);

  useEffect(() => {
    if (!popup) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [popup]);

  function dismiss() {
    if (popup) {
      try { localStorage.setItem(`accion-futbol:popup:${popup.id}`, String(Date.now())); } catch { /* Cierre disponible sin almacenamiento. */ }
    }
    setPopup(null);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!popup) return null;
  const external = popup.ctaHref.startsWith("https://");
  const hasImage = Boolean(popup.imageUrl);
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="popup-title" tabIndex={-1} onKeyDown={onKeyDown}
      className={`relative grid w-full max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/15 bg-background text-foreground shadow-2xl ${popup.template === "split" ? "max-w-3xl md:grid-cols-2" : popup.template === "banner" ? "max-w-2xl" : "max-w-lg"}`}>
      {popup.template === "split" && hasImage && <div role="img" aria-label={popup.imageAlt || popup.title} className="min-h-52 bg-cover bg-center md:min-h-96" style={{ backgroundImage: `url(${JSON.stringify(popup.imageUrl)})` }} />}
      <div className={popup.template === "banner" ? "p-6 sm:p-8" : "p-7 sm:p-10"}>
        <button ref={closeRef} type="button" onClick={dismiss} aria-label="Cerrar aviso" className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background/80 text-foreground transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><X aria-hidden="true" className="size-5" /></button>
        {popup.template !== "split" && hasImage && <div role="img" aria-label={popup.imageAlt || popup.title} className="mb-5 h-36 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(popup.imageUrl)})` }} />}
        {popup.eyebrow && <p className="section-tag">{popup.eyebrow}</p>}
        <h2 id="popup-title" className={`mt-4 pr-8 font-display font-extrabold leading-tight ${popup.template === "banner" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>{popup.title}</h2>
        <p className="mt-4 text-foreground/80">{popup.message}</p>
        <a href={popup.ctaHref} onClick={dismiss} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{popup.ctaLabel}</a>
      </div>
    </section>
  </div>;
}
