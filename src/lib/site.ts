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

function validatedHttpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

// Optional player portal URL. Invalid or non-HTTPS values stay hidden.
export const PLAYER_PORTAL_URL = validatedHttpsUrl(process.env.NEXT_PUBLIC_PLAYER_PORTAL_URL);

// Enlace a WhatsApp con un mensaje precargado.
export function whatsappLink(text: string) {
  return `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(text)}`;
}

// Condiciones comunes a todos los programas (fuente: accionfutbol.cl).
export const ENROLLMENT_INCLUDES = "Pago único. Incluye camiseta, shorts y medias del equipo.";
export const PRORATED_NOTE = "Tu primera mensualidad es proporcional a la fecha en que entras.";

export type NavLink = { label: string; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "El método", href: "#metodo" },
  { label: "Categorías", href: "#programas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Dónde jugamos", href: "#sede" },
];

export type Metric = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export const METRICS: readonly Metric[] = [
  { value: 5, suffix: "", label: "Programas para cada edad y nivel" },
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

// Sesión semanal de un programa. days: 0 = domingo … 6 = sábado.
// ages: tramo de edad cuando el programa divide grupos (Kids).
export type Session = {
  days: readonly number[];
  start: string; // "HH:MM", hora de Santiago
  end: string;
  ages?: readonly [number, number];
};

export type Program = {
  id: string;
  name: string;
  tagline: string;
  ages: string;
  schedule: string;
  // Horarios por tramo de edad, cuando el programa tiene más de uno.
  scheduleSlots?: readonly string[];
  // Las 3 cosas que propone cada programa (sitio actual).
  promises: readonly [string, string, string];
  // Edad mínima y máxima (inclusive) y sesiones, para el flujo de reserva.
  ageRange: readonly [number, number];
  sessions: readonly Session[];
  // Condición especial del programa (p. ej. selección del Pro).
  note?: string;
  enrollment: string;
  monthly: string;
  court: string;
  image: string;
  video?: string;
  poster?: string;
};

export const PROGRAMS: readonly Program[] = [
  {
    id: "am-adultos",
    name: "AM Adultos",
    tagline: "Arranca el día jugando",
    ages: "25 años en adelante",
    schedule: "Lun/Mié o Mar/Jue · 6:30 a 7:45 AM",
    ageRange: [25, 99],
    sessions: [{ days: [1, 2, 3, 4], start: "06:30", end: "07:45" }],
    promises: [
      "Despierta con pasión",
      "Entrena como un profesional, con metodología y motivación",
      "Mejora tu rendimiento futbolístico y deportivo",
    ],
    enrollment: "$45.000 (camiseta, shorts y medias)",
    monthly: "$59.000 mensual",
    court: "Cancha 16",
    image: "/images/poster-am.webp",
    video: "/images/video-am.mp4",
    poster: "/images/poster-am.webp",
  },
  {
    id: "pm-adultos",
    name: "PM Adultos",
    tagline: "Cierra el día en la cancha",
    ages: "25 años en adelante",
    schedule: "Lun/Jue · 8:30 a 9:30 PM",
    ageRange: [25, 99],
    sessions: [{ days: [1, 4], start: "20:30", end: "21:30" }],
    promises: [
      "Termina tu día de excelente forma",
      "Entrena como un profesional, con metodología y motivación",
      "Mejora tu rendimiento futbolístico y deportivo",
    ],
    enrollment: "$45.000 (camiseta, shorts y medias)",
    monthly: "$69.500 mensual",
    court: "Cancha 17",
    image: "/images/poster-pm.webp",
    video: "/images/video-pm.mp4",
    poster: "/images/poster-pm.webp",
  },
  {
    id: "kids",
    name: "Kids Niños/as",
    tagline: "Donde empieza la pasión",
    ages: "4 a 8 y 9 a 14 años",
    schedule: "Sábados · 9:00 a 11:50 AM por edad",
    ageRange: [4, 14],
    sessions: [
      { days: [6], start: "09:00", end: "10:20", ages: [4, 8] },
      { days: [6], start: "10:30", end: "11:50", ages: [9, 14] },
    ],
    scheduleSlots: ["Sábados · 4 a 8 años · 9:00 a 10:20 AM", "Sábados · 9 a 14 años · 10:30 a 11:50 AM"],
    promises: [
      "Aprende fútbol con pasión",
      "Entrena con metodología",
      "Una cultura deportiva llena de hábitos positivos",
    ],
    enrollment: "$45.000 (camiseta, shorts y medias)",
    monthly: "$47.500 mensual",
    court: "Cancha 7",
    image: "/images/poster-kids.webp",
    video: "/images/video-kids.mp4",
    poster: "/images/poster-kids.webp",
  },
  {
    id: "pro-jovenes",
    name: "Pro Jóvenes",
    tagline: "Camino al alto rendimiento",
    ages: "Edad por confirmar",
    schedule: "Lun a Vie · 6:15 a 7:45 PM",
    ageRange: [13, 18],
    sessions: [{ days: [1, 2, 3, 4, 5], start: "18:15", end: "19:45" }],
    promises: [
      "Herramientas para el alto rendimiento",
      "Mejora técnica, táctica, física y psicológica",
      "Posibilidad real de probarte en equipos profesionales",
    ],
    note: "Ingreso con prueba de selección. Según decisión técnica: pruebas masivas, contacto con directores deportivos o pruebas específicas.",
    // Valores pendientes de confirmación para esta categoría.
    enrollment: "",
    monthly: "",
    court: "Cancha 16",
    image: "/images/youth-huddle.webp",
  },
  {
    id: "femenino",
    name: "Femenino",
    tagline: "La cancha también es nuestra",
    ages: "25 años en adelante",
    schedule: "Sábados · 9:00 a 10:20 AM",
    ageRange: [25, 99],
    sessions: [{ days: [6], start: "09:00", end: "10:20" }],
    promises: [
      "Mejora tu rendimiento",
      "Entrena como una profesional",
      "Una comunidad deportiva que te espera cada sábado",
    ],
    enrollment: "$45.000 (camiseta, shorts y medias)",
    monthly: "$50.000 mensual",
    court: "Cancha 17",
    image: "/images/poster-femenino.webp",
    video: "/images/video-femenino.mp4",
    poster: "/images/poster-femenino.webp",
  },
];

// Sedes y canchas. Fuente: accionfutbol.cl (canchas y horarios) y
// OpenStreetMap (ubicación y plano). Para sumar una sede, agregar un objeto
// aquí: aparece como pin en el mapa de Santiago automáticamente.
export type Cancha = {
  id: string;
  label: string;
  programIds: readonly string[];
  // ids OSM de las canchas del plano (src/lib/geo/club-oriente.ts).
  pitchIds: readonly string[];
  // true cuando OSM no rotula la cancha: se marca el sector, no la cancha exacta.
  approximate?: boolean;
};

export type Sede = {
  id: string;
  name: string;
  comuna: string;
  address: string;
  lat: number;
  lon: number;
  mapsUrl: string;
  canchas: readonly Cancha[];
};

// Canchas sin número en OSM dentro de Club Oriente (sector de canchas 14 en adelante).
const SECTOR_NUMERACION_ALTA = [
  "1530497286",
  "1530497287",
  "1530497288",
  "1530497289",
  "1530497290",
  "1530497291",
  "113495922",
] as const;

export const SEDES: readonly Sede[] = [
  {
    id: "club-oriente",
    name: "Club Oriente",
    comuna: "Las Condes",
    address: "Nueva Bilbao 9495, Las Condes",
    lat: -33.4296321,
    lon: -70.5337559,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=-33.4296321,-70.5337559",
    canchas: [
      { id: "cancha-7", label: "Cancha 7", programIds: ["kids"], pitchIds: ["36878593"] },
      {
        id: "cancha-16",
        label: "Cancha 16",
        programIds: ["am-adultos", "pro-jovenes"],
        pitchIds: SECTOR_NUMERACION_ALTA,
        approximate: true,
      },
      {
        id: "cancha-17",
        label: "Cancha 17",
        programIds: ["pm-adultos", "femenino"],
        pitchIds: SECTOR_NUMERACION_ALTA,
        approximate: true,
      },
    ],
  },
];

export type MethodStep = {
  phase: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  imageAlt: string;
  cue: string;
};

// Relato visual del método ya descrito en PILLARS y en los programas.
export const METHOD_STEPS: readonly MethodStep[] = [
  {
    phase: "PUNTO DE PARTIDA",
    title: "Encuentra tu lugar",
    description: "Partimos por tu edad, experiencia y objetivos para ubicarte en el grupo que corresponde a tu momento.",
    detail: "Cada categoría reúne personas con una etapa y un punto de partida similares.",
    image: "/images/group-team.webp",
    imageAlt: "Grupo de jugadores de Acción Fútbol reunido en la cancha",
    cue: "GRUPO",
  },
  {
    phase: "TRABAJO CON INTENCIÓN",
    title: "Entrena cada recurso",
    description: "La sesión combina técnica y preparación física dentro de un plan, con desafíos adecuados para tu nivel.",
    detail: "Un entrenamiento con estructura permite trabajar habilidades concretas, no solo jugar un partido.",
    image: "/images/adults-dribble.webp",
    imageAlt: "Dos jugadores disputan el balón durante un entrenamiento",
    cue: "TÉCNICA",
  },
  {
    phase: "LECTURA DE JUEGO",
    title: "Decide en la cancha",
    description: "Llevas lo aprendido a situaciones de juego: leer espacios, elegir movimientos y coordinarte con tu equipo.",
    detail: "La táctica toma sentido cuando se practica junto a otras personas.",
    image: "/images/action-strike.webp",
    imageAlt: "Futbolista controla el balón en una acción de juego",
    cue: "TÁCTICA",
  },
  {
    phase: "PROGRESO COMPARTIDO",
    title: "Vuelve y sigue creciendo",
    description: "Cada sesión es una nueva oportunidad para entrenar, ajustar y disfrutar el fútbol con tu grupo.",
    detail: "El progreso se construye con continuidad, motivación y comunidad.",
    image: "/images/group-adults.webp",
    imageAlt: "Equipo de adultos de Acción Fútbol posando en la cancha",
    cue: "EQUIPO",
  },
];

export type Testimonial = { quote: string; name: string; role: string };

// Contenido aprobado por el responsable del sitio para este rediseño.
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
