import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { CONTACT, NAV_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold tracking-tight">
            ACCIÓN<span className="text-primary">FÚTBOL</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Academia de fútbol con metodología profesional en Las Condes.
            Despierta con pasión.
          </p>
        </div>

        <nav aria-label="Secciones" className="flex flex-col gap-2 text-sm">
          <p className="mb-1 font-display font-bold">Navegación</p>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscripcion"
            className="text-primary transition-colors hover:text-foreground"
          >
            Clase de prueba gratis
          </a>
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <p className="mb-1 font-display font-bold">Contacto</p>
          <span className="flex items-start gap-2.5 text-muted">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {CONTACT.address}
          </span>
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="flex items-center gap-2.5 text-muted hover:text-foreground"
          >
            <Phone className="size-4 shrink-0 text-primary" />
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2.5 text-muted hover:text-foreground"
          >
            <Mail className="size-4 shrink-0 text-primary" />
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-muted hover:text-foreground"
          >
            <ExternalLink className="size-4 shrink-0 text-primary" />
            Instagram @accionfutbol.cl
          </a>
        </div>
      </div>

      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted sm:px-8">
        © {new Date().getFullYear()} Acción Fútbol · Club Oriente, Las Condes.
        Todos los derechos reservados.
      </div>
    </footer>
  );
}
