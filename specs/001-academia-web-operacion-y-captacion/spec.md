# Especificación inicial: operación y captación del sitio de Acción Fútbol

> Borrador de alcance, pendiente de entrevista con Sergio y validación contra el documento de alcance adicional anunciado. No asumir las opciones aún no acordadas.

## Contexto confirmado

- El proyecto es el sitio de la Academia de Fútbol para Ignacio López.
- La cotización contempla diseño responsive con material audiovisual; programas y categorías; sedes y canchas; captación mediante formulario y WhatsApp; contenido institucional; newsletter y publicación con herramienta/gestión por definir; administración asistida por IA y capacitación; evaluación de un panel si se delega la administración; enlaces a portales existentes sin reconstruirlos; implementación con dominio y materiales provistos; y 2–3 rondas de ajustes.
- La cotización fija $400.000 netos + $76.000 de IVA = $476.000 total. Hosting es un costo separado.
- La solicitud actual agrega una función para crear formularios y páginas/enlaces públicos propios que reciban respuestas y las incorporen al sistema, además de preparar arquitectura para integrar Meta Pixel.
- El repositorio existente usa Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Motion, Postgres y Vercel. Ya tiene landing, categorías, mapa/sede, FAQ, contacto por WhatsApp, un flujo de reserva de prueba y `POST /api/inscripciones`.
- A la fecha de este borrador no existe panel administrativo, constructor de formularios, sistema de newsletter ni integración de Meta Pixel en el código revisado.

## Objetivo

Convertir la landing existente en una experiencia coherente de información y captación, con una arquitectura acordada para formularios públicos administrables, recepción y consulta segura de respuestas, medición Meta preparada para los eventos aprobados y una ruta de publicación/capacitación que respete la cotización.

## Alcance de producto

1. Revisar y armonizar el sitio existente: diseño responsive, material audiovisual, contenido institucional, programas/categorías, sedes/canchas, datos de contacto y llamadas a la acción.
2. Aclarar en la reserva qué fechas son propuestas y cuándo una clase queda confirmada; alinear edades, categorías, precios, horarios y condiciones con datos aprobados por el cliente.
3. Mantener el formulario de contacto/reserva y el acceso a WhatsApp como vías de captación.
4. Diseñar e implementar un mecanismo para crear formularios reutilizables, publicar cada uno en una página/enlace propio, validar y recibir sus respuestas y almacenarlas en el sistema existente o su evolución acordada.
5. Preparar integración de Meta Pixel con configuración segura, consentimiento/privacidad y eventos acordados. La activación depende de recibir identificadores y definición de eventos.
6. Incluir newsletter/publicación en el plan de decisión y puesta en marcha; plataforma, contenido, frecuencia y operación siguen por definir en la cotización.
7. Incluir un panel para que el cliente administre formularios y respuestas, además de administración delegada de newsletter, asistencia de IA y capacitación. Los permisos y límites concretos están pendientes.
8. Enlazar portales existentes sin replicar sus funcionalidades.
9. Implementar usando dominio y materiales proporcionados; considerar 2–3 rondas de ajustes.

## No incluido / condicionado

- Hosting y sus cargos recurrentes: cotizados por separado.
- Reconstrucción de portales de terceros existentes.
- Plataforma/envíos de newsletter: la administración delegada está confirmada; elegir plataforma, frecuencia y responsabilidades antes de implementarla.
- Activación de Meta Pixel y Conversion API en producción hasta contar con Pixel ID, eventos acordados, credenciales y decisión de consentimiento.

## Requisitos de aceptación preliminares

- El contenido de cada programa, sede, horario, edad y precio coincide con la fuente aprobada por el cliente.
- Los enlaces a portales llevan al destino correcto y comunican que se trata de sistemas externos.
- Un formulario publicado tiene URL propia, acepta solo campos configurados, valida entradas y guarda respuestas asociadas al formulario.
- El flujo informa claramente el resultado del envío y no presenta una solicitud como reserva confirmada cuando requiere coordinación manual.
- Las respuestas pueden consultarse solo por los usuarios autorizados que se acuerden; reglas de retención, exportación y borrado quedan definidas antes del lanzamiento.
- La medición envía únicamente los eventos y datos aprobados, con comportamiento conforme a la decisión de consentimiento y privacidad.
- La entrega incluye capacitación acordada y cubre las 2–3 rondas de ajustes cotizadas.

## Decisiones abiertas

- Quién crea y administra formularios; campos/tipos, edición, publicación, borrado y destinatarios de notificaciones.
- Qué datos persisten, quién accede, notificaciones, exportación, retención y borrado.
- Panel confirmado para el cliente: perfiles, roles, acciones, campos y permisos de respuestas.
- Newsletter delegado: proveedor, formulario de suscripción, consentimiento, listas, frecuencia, contenidos, responsables y capacitación.
- Meta Pixel + Conversion API confirmados: Pixel ID, eventos, credenciales CAPI, consentimiento/cookies, deduplicación y responsable de las cuentas.
- Lista y destinos de portales existentes; dominio y materiales definitivos.
- Fuente aprobada y vigencia de horarios, precios, categorías, métricas y testimonios.
- Contenido del documento de alcance adicional pendiente de compartir.
