import type { FormDefinition } from "@/lib/forms/schema";
import type { NewsPost } from "@/lib/news/schema";
import type { PopupDefinition } from "@/lib/popups/schema";

// Piezas ficticias, versionadas y compatibles con los modelos reales del panel.
export const demoForm: FormDefinition = {
  slug: "muestra-clase-kids",
  title: "Tu primera clase en Acción Fútbol Kids",
  description: "Cuéntanos un poco sobre tu futuro jugador o jugadora. Nuestro equipo te contactará para coordinar su primera experiencia en la cancha.",
  coverImage: "/images/kids-joy.webp",
  coverAlt: "Niños y niñas disfrutando juntos de un entrenamiento de fútbol",
  version: 1,
  status: "draft",
  fields: [
    { id: "apoderado", label: "Nombre de madre, padre o apoderado", type: "text", required: true },
    { id: "correo", label: "Correo electrónico de contacto", type: "email", required: true },
    { id: "telefono", label: "Teléfono o WhatsApp", type: "tel", required: true },
    { id: "jugador", label: "Nombre del niño o niña", type: "text", required: true },
    { id: "edad", label: "Tramo de edad", type: "select", required: true, options: [
      { value: "cuatro-ocho", label: "4 a 8 años" },
      { value: "nueve-catorce", label: "9 a 14 años" },
    ] },
    { id: "experiencia", label: "Experiencia previa", type: "select", required: true, options: [
      { value: "primera-vez", label: "Será su primera experiencia" },
      { value: "recreativo", label: "Juega de forma recreativa" },
      { value: "equipo", label: "Ha entrenado en un equipo" },
    ] },
    { id: "objetivo", label: "¿Qué le gustaría desarrollar en la cancha?", type: "textarea", required: false },
    { id: "origen", label: "¿Cómo conociste la academia?", type: "select", required: false, options: [
      { value: "recomendacion", label: "Recomendación" },
      { value: "redes", label: "Redes sociales" },
      { value: "buscador", label: "Búsqueda en internet" },
      { value: "otro", label: "Otro medio" },
    ] },
    { id: "contacto", label: "Acepto que el equipo me contacte para coordinar la clase de prueba", type: "checkbox", required: true },
  ],
};

export const demoAnswers: Record<string, string | boolean> = {
  apoderado: "Camila Ejemplo",
  correo: "camila@example.com",
  telefono: "+56 9 0000 0000",
  jugador: "Tomás Ejemplo",
  edad: "nueve-catorce",
  experiencia: "recreativo",
  objetivo: "Que gane confianza, disfrute entrenar y aprenda a trabajar en equipo.",
  origen: "recomendacion",
  contacto: true,
};

export const demoNews: NewsPost = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "muestra-la-cancha-donde-empieza-la-confianza",
  title: "La cancha donde empieza la confianza",
  summary: "Un entrenamiento puede ser el comienzo de algo grande: movimiento, amistades y la seguridad de atreverse a jugar.",
  body: "No todos llegan a la cancha de la misma manera. Algunos corren hacia la pelota sin pensarlo; otros necesitan unos minutos para mirar, respirar y descubrir que también tienen un lugar en el equipo. En Acción Fútbol, cada primer paso cuenta.\n\nEn los entrenamientos Kids, el juego abre espacio para aprender a escuchar, compartir y tomar decisiones. El balón es el punto de partida, pero lo que sucede alrededor también importa: celebrar un pase, volver a intentarlo y acompañar a quien está aprendiendo.\n\nEl programa recibe a niños y niñas de 4 a 14 años en Club Oriente, Las Condes. Los grupos de 4 a 8 y de 9 a 14 años entrenan los sábados en horarios diferenciados. Así cada etapa puede vivir el fútbol a su ritmo.\n\n¿Quieres conocer la experiencia de cerca? En el sitio puedes explorar los programas y solicitar una clase de prueba. El equipo confirmará los detalles contigo antes del entrenamiento.",
  coverImage: "/images/kids-joy.webp",
  coverAlt: "Niños y niñas celebrando juntos durante un entrenamiento de fútbol",
  status: "draft",
  publishedAt: null,
  createdAt: "2026-11-17T12:00:00.000Z",
  updatedAt: "2026-11-17T12:00:00.000Z",
};

export const demoPopup: PopupDefinition = {
  name: "Muestra · primera clase Kids",
  status: "draft",
  template: "split",
  path: "/",
  trigger: "delay",
  delaySeconds: 8,
  scrollPercent: 50,
  frequencyDays: 7,
  startsAt: "",
  endsAt: "",
  eyebrow: "TU PRIMER ENTRENAMIENTO",
  title: "Hay un lugar para ti en la cancha",
  message: "Conoce los programas de Acción Fútbol y solicita una clase de prueba. Nuestro equipo te ayudará a encontrar tu lugar para empezar.",
  imageUrl: "/images/group-team.webp",
  imageAlt: "Jugadores de Acción Fútbol reunidos después de entrenar",
  ctaLabel: "Solicitar clase de prueba",
  ctaHref: "#inscripcion",
};

// Concepto editorial: el módulo de newsletter aún no administra ni envía campañas.
export const demoNewsletter = {
  subject: "La cancha nos reúne · una mirada a Acción Fútbol",
  preheader: "Historias, programas y nuevas razones para salir a jugar.",
  heading: "El fútbol se vive mejor en equipo.",
  introduction: "Cada entrenamiento trae una oportunidad distinta: aprender un movimiento, conocer a alguien o simplemente volver a disfrutar el juego. Queremos compartir contigo lo que pasa dentro y fuera de la cancha.",
  featureTitle: "Una cancha para cada momento",
  featureBody: "Desde las primeras jugadas de Kids hasta los entrenamientos de adultos y femenino, hay distintas maneras de vivir Acción Fútbol.",
  featureHref: "/#programas",
  storyTitle: demoNews.title,
  storyBody: demoNews.summary,
  storyHref: "/muestras/noticia",
  email: "camila@example.com",
} as const;
