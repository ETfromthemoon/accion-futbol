import { CONTACT, ENROLLMENT_INCLUDES, PILLARS, PROGRAMS, PRORATED_NOTE } from "@/lib/site";

export type KnowledgeTopic = "Primer paso" | "Programas" | "Entrenamiento" | "Pagos" | "Sede";
export type KnowledgeEntry = {
  id: string;
  topic: KnowledgeTopic;
  question: string;
  answer: string;
  keywords: string;
};

const program = (id: string) => {
  const match = PROGRAMS.find((item) => item.id === id);
  if (!match) throw new Error(`Falta el programa ${id} para la base de conocimiento`);
  return match;
};

// Respuestas acotadas a los datos del sitio. Aquí se amplía la base cuando el cliente confirma información nueva.
export const KNOWLEDGE_BASE: readonly KnowledgeEntry[] = [
  { id: "prueba-gratis", topic: "Primer paso", question: "¿La clase de prueba tiene costo?", answer: "No. Tu primera clase es gratis y sin compromiso. El equipo debe confirmar tu cupo antes de que vengas.", keywords: "gratis gratuita precio costo probar primera clase" },
  { id: "agendar", topic: "Primer paso", question: "¿Cómo agendo mi primera clase?", answer: "Completa la solicitud de clase de prueba en esta página o escríbenos por WhatsApp. El equipo confirmará contigo el día y el cupo.", keywords: "reservar inscribirme empezar whatsapp contacto agenda cupo" },
  { id: "experiencia", topic: "Primer paso", question: "¿Necesito experiencia previa para comenzar?", answer: "No necesitas haber entrenado antes. La academia organiza grupos por edad y nivel para encontrar un punto de partida adecuado.", keywords: "principiante nuevo nunca jugué nivel primera vez" },
  { id: "metodo", topic: "Entrenamiento", question: "¿Cómo es la metodología de entrenamiento?", answer: PILLARS[0].description, keywords: "método sesiones técnica táctica físico ejercicios práctica plan" },
  { id: "grupos", topic: "Entrenamiento", question: "¿Cómo se forman los grupos?", answer: PILLARS[1].description, keywords: "edad nivel categoría compañeros principiantes avanzados" },
  { id: "kids", topic: "Programas", question: "¿Qué edades y horarios tiene Kids?", answer: `Kids recibe a niños y niñas de ${program("kids").ages}. ${program("kids").scheduleSlots?.join(". ")}.`, keywords: "niños niñas hijo hija infantil sábados escuela pequeños" },
  { id: "adultos-am", topic: "Programas", question: "¿Cuándo entrena AM Adultos?", answer: `AM Adultos es para ${program("am-adultos").ages}. Horario publicado: ${program("am-adultos").schedule}.`, keywords: "mañana temprano lunes martes miercoles jueves adultos horario" },
  { id: "adultos-pm", topic: "Programas", question: "¿Cuándo entrena PM Adultos?", answer: `PM Adultos es para ${program("pm-adultos").ages}. Horario publicado: ${program("pm-adultos").schedule}.`, keywords: "tarde noche después trabajo adultos horario" },
  { id: "femenino", topic: "Programas", question: "¿Hay un programa femenino?", answer: `Sí. Femenino es para ${program("femenino").ages} y entrena ${program("femenino").schedule}.`, keywords: "mujeres mujer chicas horario sábado" },
  { id: "pro", topic: "Programas", question: "¿Cómo se entra al programa Pro?", answer: "Pro Jóvenes contempla una prueba de selección. Los requisitos de edad y los detalles vigentes deben confirmarse directamente con la academia.", keywords: "jóvenes juvenil cadetes selección prueba rendimiento edad" },
  { id: "precios", topic: "Pagos", question: "¿Cuáles son los valores de inscripción y mensualidad?", answer: "Los valores dependen de la categoría. Escríbenos para recibir la información vigente del programa que te interesa.", keywords: "precio precios costo cuesta dinero tarifa valor mensual cuota" },
  { id: "proporcional", topic: "Pagos", question: "¿Qué pasa si entro a mitad de mes?", answer: PRORATED_NOTE, keywords: "prorrateo proporcional pago mensualidad fecha comienzo" },
  { id: "equipacion", topic: "Pagos", question: "¿Qué incluye la inscripción?", answer: ENROLLMENT_INCLUDES, keywords: "uniforme camiseta shorts medias ropa kit indumentaria" },
  { id: "sede", topic: "Sede", question: "¿Dónde entrenan?", answer: `Entrenamos en ${CONTACT.address}. Kids usa la cancha 7; AM Adultos y Pro Jóvenes, la 16; PM Adultos y Femenino, la 17.`, keywords: "ubicación dirección mapa las condes llegar club oriente cancha" },
];

export const KNOWLEDGE_TOPICS: readonly KnowledgeTopic[] = ["Primer paso", "Programas", "Entrenamiento", "Pagos", "Sede"];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, " ").trim();
const STOP_WORDS = new Set(["que", "como", "para", "con", "los", "las", "una", "uno", "del", "por", "hay", "tiene", "tienen", "donde", "quiero", "pasa", "cuando", "cuanto"]);
const matchesTerm = (text: string, term: string) => text.includes(term) || (term.length > 4 && term.endsWith("s") && text.includes(term.slice(0, -1)));

export function searchKnowledge(query: string, topic: KnowledgeTopic | "Todas" = "Todas"): KnowledgeEntry[] {
  const available = topic === "Todas" ? KNOWLEDGE_BASE : KNOWLEDGE_BASE.filter((entry) => entry.topic === topic);
  const normalized = normalize(query.slice(0, 120));
  if (!normalized) return [...available];
  const terms = normalized.split(" ").filter((term) => term.length > 2 && !STOP_WORDS.has(term));
  if (!terms.length) return [...available];
  return available
    .map((entry) => {
      const question = normalize(entry.question);
      const keywords = normalize(entry.keywords);
      const answer = normalize(entry.answer);
      const score = terms.reduce((total, term) => total + (matchesTerm(question, term) ? 3 : 0) + (matchesTerm(keywords, term) ? 2 : 0) + (matchesTerm(answer, term) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}
