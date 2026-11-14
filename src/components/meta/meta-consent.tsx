"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { hasMetaConsent, setMetaConsent, startPixel } from "@/lib/meta/client";

function getChoice() {
  const value = document.cookie.split("; ").find((item) => item.startsWith("accion_meta_consent="))?.split("=")[1];
  return value === "granted" || value === "denied" ? value : "settings";
}
function subscribe(callback: () => void) {
  window.addEventListener("meta-consent-change", callback);
  return () => window.removeEventListener("meta-consent-change", callback);
}

export function MetaConsent({ pixelId }: { pixelId: string }) {
  const choice = useSyncExternalStore(subscribe, getChoice, () => "unknown");
  const [editing, setEditing] = useState(false);
  useEffect(() => { if (choice === "granted" && hasMetaConsent()) startPixel(pixelId); }, [choice, pixelId]);
  if (!/^\d{5,25}$/.test(pixelId) || choice === "unknown") return null;
  function choose(granted: boolean) {
    setMetaConsent(granted);
    if (granted) startPixel(pixelId);
    setEditing(false);
    window.dispatchEvent(new Event("meta-consent-change"));
  }
  return choice === "settings" || editing ? (
    <aside aria-label="Preferencias de publicidad" className="fixed bottom-4 left-4 z-[100] max-w-sm rounded-2xl border border-white/20 bg-neutral-950 p-5 text-sm text-white shadow-xl">
      <p>Con tu permiso, usamos herramientas de Meta para medir publicidad. Puedes cambiar tu decisión cuando quieras.</p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose(true)} className="rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground">Aceptar</button>
        <button type="button" onClick={() => choose(false)} className="rounded-lg border border-white/40 px-4 py-2">Rechazar</button>
      </div>
    </aside>
  ) : <button type="button" onClick={() => setEditing(true)} className="fixed bottom-1 right-1 z-40 rounded bg-neutral-950 px-2 py-1 text-xs text-white">Preferencias de publicidad</button>;
}
