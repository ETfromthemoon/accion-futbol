import type { FormDefinition } from "@/lib/forms/schema";
import type { NewsPost } from "@/lib/news/schema";
import type { PopupDefinition } from "@/lib/popups/schema";

// Datos ficticios versionados para mostrar el producto sin crear leads ni contactos reales.
export const demoForm: FormDefinition = {
  slug: "muestra-clase-de-prueba", title: "Reserva tu clase de prueba", version: 1, status: "draft",
  fields: [
    { id: "nombre", label: "Nombre y apellido", type: "text", required: true },
    { id: "correo", label: "Correo electrónico", type: "email", required: true },
    { id: "telefono", label: "Teléfono de contacto", type: "tel", required: true },
    { id: "programa", label: "Programa de interés", type: "select", required: true, options: [
      { value: "kids", label: "Kids · niños y niñas" }, { value: "adultos", label: "Adultos" }, { value: "femenino", label: "Femenino" },
    ] },
    { id: "mensaje", label: "¿Qué te gustaría contarnos?", type: "textarea", required: false },
    { id: "contacto", label: "Acepto que me contacten para coordinar la clase", type: "checkbox", required: true },
  ],
};

export const demoAnswers: Record<string, string | boolean> = {
  nombre: "Camila Ejemplo", correo: "camila@example.com", telefono: "+56 9 0000 0000",
  programa: "kids", mensaje: "Me gustaría conocer los horarios disponibles.", contacto: true,
};

export const demoNews: NewsPost = {
  id: "00000000-0000-4000-8000-000000000001", slug: "muestra-noticia-entrenamiento",
  title: "Una tarde para descubrir el fútbol en equipo",
  summary: "Así podría verse una noticia de la academia en la portada y en la página de publicaciones.",
  body: "En Acción Fútbol creemos que cada entrenamiento es una oportunidad para aprender, compartir y disfrutar la cancha. Esta publicación es una muestra de cómo se presentarán las novedades de la academia.\n\nAquí se podrán contar actividades, fechas importantes y experiencias de la comunidad. El equipo podrá actualizar el título, la imagen, el resumen y el contenido desde el panel de administración.\n\nEste texto es únicamente de demostración; no anuncia una actividad ni una fecha real.",
  coverImage: "/images/kids-joy.webp", coverAlt: "Niños disfrutando de una jornada de fútbol",
  status: "draft", publishedAt: null, createdAt: "2026-11-17T12:00:00.000Z", updatedAt: "2026-11-17T12:00:00.000Z",
};

export const demoPopup: PopupDefinition = {
  name: "Muestra · clase de prueba", status: "draft", template: "split", path: "/",
  trigger: "delay", delaySeconds: 5, scrollPercent: 50, frequencyDays: 7,
  startsAt: "", endsAt: "", eyebrow: "ACCIÓN FÚTBOL", title: "Tu próximo momento empieza en la cancha",
  message: "Conoce cómo se vería una invitación con imagen, mensaje y botón. Esta es una vista de prueba.",
  imageUrl: "/images/group-team.webp", imageAlt: "Equipo de fútbol reunido en la cancha",
  ctaLabel: "Conocer los programas", ctaHref: "#programas",
};

export const demoNewsletter = {
  subject: "Novedades desde la cancha · edición de muestra",
  preheader: "Un vistazo de cómo podría verse un correo de Acción Fútbol.",
  heading: "El fútbol se vive en equipo",
  body: "Hola, Camila. Este es un ejemplo visual de una futura comunicación por correo. Aquí podrían compartirse noticias de la academia, actividades y enlaces útiles para la comunidad.",
  email: "camila@example.com",
} as const;
