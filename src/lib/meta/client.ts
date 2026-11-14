"use client";

export const CONSENT_COOKIE = "accion_meta_consent";

type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: Pixel; loaded?: boolean; version?: string };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }

export function hasMetaConsent(): boolean {
  return document.cookie.split("; ").some((item) => item === `${CONSENT_COOKIE}=granted`);
}

export function setMetaConsent(granted: boolean) {
  document.cookie = `${CONSENT_COOKIE}=${granted ? "granted" : "denied"}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  if (!granted) window.fbq?.("consent", "revoke");
}

export function startPixel(pixelId: string) {
  if (!/^\d{5,25}$/.test(pixelId) || !hasMetaConsent()) return;
  if (window.fbq) { window.fbq("consent", "grant"); return; }
  const queue: unknown[][] = [];
  const pixel = ((...args: unknown[]) => {
    if (pixel.callMethod) pixel.callMethod(...args);
    else queue.push(args);
  }) as Pixel;
  pixel.queue = queue;
  pixel.push = pixel;
  pixel.loaded = true;
  pixel.version = "2.0";
  window.fbq = window._fbq = pixel;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  // Evitar capturas automáticas de campos; solo emitimos los eventos explícitos.
  pixel("set", "autoConfig", false, pixelId);
  pixel("init", pixelId);
  pixel("track", "PageView");
}

export function trackLead(eventId: string) {
  if (hasMetaConsent() && window.fbq && /^[a-f0-9-]{36}$/i.test(eventId)) {
    window.fbq("track", "Lead", {}, { eventID: eventId });
  }
}
