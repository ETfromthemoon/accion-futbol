import { ArrowUpRight, ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { CONTACT, NAV_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="premium-footer relative overflow-hidden border-t border-border">
      <div className="footer-glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="footer-glass-grid grid gap-5 rounded-[1.75rem] p-4 sm:p-6 md:grid-cols-[1.15fr_0.8fr_1fr]">
          <div className="p-4 sm:p-5">
            <p className="font-display text-xl font-extrabold tracking-tight">
              ACCIÓN<span className="text-primary">FÚTBOL</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Academia de fútbol con metodología profesional en Las Condes.
              Despierta con pasión.
            </p>
          <a href="#inscripcion" className="footer-primary-cta mt-7 flex max-w-xs items-center justify-between rounded-2xl px-5 py-4 font-display font-bold text-white">
            <span><small className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Tu primer entrenamiento</small>Reserva tu clase gratis</span>
            <ArrowUpRight className="size-6" />
          </a>
        </div>

        <nav aria-label="Secciones" className="footer-glass-panel flex flex-col gap-2 rounded-2xl p-4 text-sm sm:p-5">
          <p className="mb-2 font-display font-bold">Explora</p>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="footer-glass-link group flex min-h-11 items-center justify-between rounded-xl px-3 text-foreground/70 transition-all hover:text-foreground"
            >
              {link.label}
              <ArrowUpRight className="size-3.5 opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        <div className="footer-glass-panel flex flex-col gap-2 rounded-2xl p-4 text-sm sm:p-5">
          <p className="mb-2 font-display font-bold">Contacto</p>
          <span className="flex items-start gap-2.5 text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {CONTACT.address}
          </span>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="footer-glass-link flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-foreground/70 hover:text-foreground"
          >
            <Phone className="size-4 shrink-0 text-primary" />
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="footer-glass-link flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-foreground/70 hover:text-foreground"
          >
            <Mail className="size-4 shrink-0 text-primary" />
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-glass-link flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-foreground/70 hover:text-foreground"
          >
            <ExternalLink className="size-4 shrink-0 text-primary" />
            Instagram @accionfutbol.cl
          </a>
        </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-6 text-xs text-muted sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} Acción Fútbol · Club Oriente, Las Condes.</span>
          <span>Entrena. Juega. Pertenece.</span>
        </div>
      </div>
    </footer>
  );
}
