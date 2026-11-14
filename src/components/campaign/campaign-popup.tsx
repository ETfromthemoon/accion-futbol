"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { CAMPAIGN, isCampaignActive, isSafeCampaignHref } from "@/lib/campaign/config";

const STORAGE_KEY = "accion-futbol:campaign-seen-at";

function canShowCampaign(now: number): boolean {
  try {
    const seenAt = Number(window.localStorage.getItem(STORAGE_KEY));
    const frequencyMs = Math.max(0, CAMPAIGN.frequencyDays) * 24 * 60 * 60 * 1000;
    return !Number.isFinite(seenAt) || seenAt <= 0 || now - seenAt >= frequencyMs;
  } catch {
    // If storage is unavailable, don't interrupt the visitor with repeated popups.
    return false;
  }
}

export function CampaignPopup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const ctaHref = isSafeCampaignHref(CAMPAIGN.ctaHref) ? CAMPAIGN.ctaHref : "#inscripcion";
  const external = ctaHref.startsWith("https://");

  useEffect(() => {
    const now = Date.now();
    if (!isCampaignActive(CAMPAIGN, new Date(now)) || !canShowCampaign(now)) return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      dismiss();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // The popup still closes for this visit if storage is unavailable.
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-title"
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-background p-7 text-foreground shadow-2xl sm:p-10"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={dismiss}
          aria-label="Cerrar promoción"
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-foreground/70 transition hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <p className="section-tag">Acción Fútbol</p>
        <h2 id="campaign-title" className="mt-4 pr-8 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {CAMPAIGN.title}
        </h2>
        <p className="mt-4 text-foreground/75">{CAMPAIGN.message}</p>
        <a
          href={ctaHref}
          onClick={dismiss}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {CAMPAIGN.ctaLabel}
        </a>
      </section>
    </div>
  );
}
