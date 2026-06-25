// Datos del sitio Acción Fútbol. Editar aquí actualiza toda la landing.

export const CONTACT = {
  phone: "+56 9 2093 4768",
  phoneRaw: "56920934768",
  email: "contacto@accionfutbol.cl",
  address: "Club Oriente · Nueva Bilbao 9495, Las Condes",
  whatsappUrl:
    "https://wa.me/56920934768?text=Hola%2C%20quiero%20agendar%20una%20clase%20de%20prueba%20en%20Acci%C3%B3n%20F%C3%BAtbol",
  instagram: "https://instagram.com/accionfutbol.cl",
} as const;

export type NavLink = { label: string; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "El método", href: "#metodo" },
  { label: "Programas", href: "#programas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Sede", href: "#sede" },
];

export type Metric = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export const METRICS: readonly Metric[] = [
  { value: 6, suffix: "", label: "Programas para cada edad y nivel" },
  { value: 350, prefix: "+", label: "Jugadores entrenando cada semana" },
  { value: 10, suffix: " años", label: "Formando jugadores en Las Condes" },
  { value: 100, suffix: "%", label: "Entrenadores con carrera profesional" },
];

export type Pillar = { title: string; description: string };

export const PILLARS: readonly Pillar[] = [
  {
    title: "Metodología profesional",
    description:
      "Planificamos cada sesión como un club de verdad: técnica, táctica y físico medido sesión a sesión, no improvisado.",
  },
  {
    title: "Grupos por nivel real",
    description:
      "Entrenas con gente de tu edad y tu punto de partida. Sin sentirte fuera de lugar, sin frenar al resto.",
  },
  {
    title: "Comunidad que engancha",
    description:
      "Pasión, respeto y ganas de volver cada semana. La cancha también es donde haces amigos.",
  },
];

export type Program = {
  id: string;
  name: string;
  tagline: string;
  ages: string;
  schedule: string;
  enrollment: string;
  monthly: string;
  court: string;
  image: string;
};

export const PROGRAMS: readonly Program[] = [
  {
    id: "am-adultos",
    name: "AM Adultos",
    tagline: "Arranca el día jugando",
    ages: "25 años en adelante",
    schedule: "Lun/Mié o Mar/Jue · 6:30 a 7:45 AM",
    enrollment: "$45.000 (incluye uniforme)",
    monthly: "$59.000 mensual",
    court: "Cancha 16",
    image: "/images/dribble.webp",
  },
  {
    id: "pm-adultos",
    name: "PM Adultos",
    tagline: "Cierra el día en la cancha",
    ages: "25 años en adelante",
    schedule: "Lun/Jue · 8:30 a 9:30 PM",
    enrollment: "$45.000 (incluye uniforme)",
    monthly: "$69.500 mensual",
    court: "Cancha 17",
    image: "/images/balls-rain.webp",
  },
  {
    id: "kids",
    name: "Kids Niños/as",
    tagline: "Donde empieza la pasión",
    ages: "4 a 8 y 9 a 14 años",
    schedule: "Sábados · 9:00 a 11:50 AM por edad",
    enrollment: "$45.000 (incluye uniforme)",
    monthly: "$47.500 mensual",
    court: "Cancha 7",
    image: "/images/ball-sunset.webp",
  },
  {
    id: "pro-jovenes",
    name: "Pro Jóvenes",
    tagline: "Camino al alto rendimiento",
    ages: "13 a 18 años",
    schedule: "Lun a Vie · 6:15 a 7:45 PM",
    enrollment: "$45.000 (incluye uniforme)",
    monthly: "Consultar plan",
    court: "Cancha 16",
    image: "/images/boots.webp",
  },
  {
    id: "femenino",
    name: "Femenino",
    tagline: "La cancha también es nuestra",
    ages: "25 años en adelante",
    schedule: "Sábados · 9:00 a 10:20 AM",
    enrollment: "$45.000 (incluye uniforme)",
    monthly: "$50.000 mensual",
    court: "Cancha 17",
    image: "/images/femenino.webp",
  },
];

export type Step = { number: string; title: string; description: string };

export const STEPS: readonly Step[] = [
  {
    number: "01",
    title: "Agenda tu clase de prueba",
    description:
      "Déjanos tus datos y el programa que te interesa. Te coordinamos día y hora por WhatsApp en menos de 24 horas.",
  },
  {
    number: "02",
    title: "Entrena gratis con nosotros",
    description:
      "Vienes a Club Oriente, conoces a tu entrenador y al grupo, y vives una sesión completa sin pagar nada.",
  },
  {
    number: "03",
    title: "Inscríbete y sigue jugando",
    description:
      "Si te enganchaste —y va a pasar— formalizas tu inscripción y quedas dentro de la comunidad Acción Fútbol.",
  },
];

export type Testimonial = { quote: string; name: string; role: string };

// NOTA: testimonios de muestra para la demo. Reemplazar por reseñas reales antes de publicar.
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "Llevaba años sin jugar y pensé que ya estaba viejo para esto. El grupo AM me devolvió las ganas de entrenar y de cuidarme.",
    name: "Rodrigo M.",
    role: "AM Adultos",
  },
  {
    quote:
      "Mi hija espera el sábado toda la semana. No es solo fútbol: aprendió a perder, a ganar y a trabajar en equipo.",
    name: "Carolina V.",
    role: "Apoderada · Kids",
  },
  {
    quote:
      "El nivel de exigencia del Pro me preparó para las pruebas de cadetes. Se entrena como en un club grande.",
    name: "Matías R.",
    role: "Pro Jóvenes",
  },
];

// Opciones del formulario de inscripción / clase de prueba.
export const PROGRAM_OPTIONS = PROGRAMS.map((p) => ({
  value: p.id,
  label: p.name,
}));
