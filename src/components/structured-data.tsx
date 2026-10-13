import { CONTACT, PROGRAMS, SEDES } from "@/lib/site";

const SITE_URL = "https://accionfutbol.cl";

// Ficha de negocio local para buscadores (schema.org), armada desde site.ts.
function buildSchema() {
  const sede = SEDES[0];
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Acción Fútbol",
    description:
      "Academia de fútbol con metodología profesional en Club Oriente, Las Condes. Programas para adultos, niños, jóvenes y mujeres.",
    url: SITE_URL,
    image: `${SITE_URL}/images/hero-night.webp`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    sport: "Fútbol",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nueva Bilbao 9495",
      addressLocality: sede.comuna,
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    geo: { "@type": "GeoCoordinates", latitude: sede.lat, longitude: sede.lon },
    sameAs: [CONTACT.instagram],
    makesOffer: PROGRAMS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: `${p.ages} · ${p.schedule}`,
    })),
  };
}

export function StructuredData() {
  // JSON estático del propio sitio; se escapa "<" para que no cierre el <script>.
  const json = JSON.stringify(buildSchema()).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
