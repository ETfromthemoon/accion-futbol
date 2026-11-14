# Plan de implementación: sitio Acción Fútbol

## Iteración de feedback del 12 de noviembre de 2026

Fuente y transcripción consultable: [feedback del cliente](../../docs/feedback-cliente-2026-11-12.md). La implementación de esta iteración se limita a funciones que pueden construirse sin las hojas, formularios, enlaces, cuentas, fotografías o aprobaciones que debe entregar el cliente. No se publicará una campaña de verano de ejemplo ni se inventarán precios, horarios o edades definitivas.

### Arquitectura y orden de trabajo

1. **Diseño:** cambiar tokens y estados del sistema visual actual a rosado y negro, conservando contraste y componentes responsive. Dejar la paleta ajustable cuando llegue la guía de marca.
2. **Captura:** cerrar el flujo de definiciones versionadas, publicación por slug, páginas públicas y respuestas persistidas. El panel del cliente necesita una frontera de autenticación y autorización antes de exponer edición o datos. Las plantillas de clase de prueba y selección Pro son solo orientativas hasta recibir los formularios actuales.
3. **Sheets:** definir un adaptador de entrega posterior al guardado local, con configuración de credenciales solo en servidor, identificadores de hoja/pestaña y mapeo por formulario. Un fallo de Sheets debe quedar registrado/recuperable y no afirmar entrega exitosa. La conexión real espera la hoja y acceso del cliente.
4. **Programas:** ocultar valores de Pro; mantener Kids 4–14. Modelar Proyección como pendiente de ficha aprobada, sin publicarla con horarios/precios inventados. Mantener 13–18 de Pro como dato de la web hasta confirmar el rango aproximado 10–19 mencionado en el audio. Mensajes para apoderados y jóvenes pueden prepararse sin nuevos assets.
5. **Campañas:** componente de promoción con control de publicación, fechas, CTA y frecuencia por visitante; inactivo por defecto. La campaña de verano requiere texto, fecha, formulario y aprobación.
6. **Portal/pagos:** preparar la ubicación del enlace al portal externo cuando llegue URL. El pago de inscripción sigue fuera del sistema según la intención expresada en el audio.

### Criterios para dar esta iteración por terminada

- El sitio conserva navegación y reserva existentes, con identidad rosada/negra consistente.
- Un formulario publicado se puede abrir por URL y enviar con validación; la gestión y las respuestas no son públicas.
- Las respuestas se guardan localmente con errores visibles y contrato de exportación/sincronización preparado; no se promete Sheets sin credenciales verificadas.
- Pro no publica valores. No aparecen programas, edades, cupos, precios ni promociones no aprobados.
- Las campañas permanecen apagadas hasta configurarse. Los controles emergentes son accesibles y permiten cerrar.
- Pasan las pruebas y verificaciones relevantes del proyecto; se revisa el diff incluyendo archivos nuevos y cambios locales preexistentes.

### Pendientes del cliente

- Formularios actuales de entrenamiento de prueba y prueba de jugadores, campos, textos legales y destino de cada respuesta.
- ID/URL de Google Sheet, pestañas, acceso de servicio y decisión sobre si reemplazar Google Forms o mantenerlo en algún flujo.
- Ficha aprobada de Proyección; rango exacto Pro; programas, horarios, precios y criterios de selección vigentes.
- URL/nombre del portal del jugador y, si aplica, flujo externo de inscripción pagada.
- Logo/fotos/videos definitivos, guía exacta de rosado, textos/fechas/CTA de campaña de verano.
- Reunión de aprobación y operación con Sergio, Rodrigo, Carlos y Camilo.

### Estado de implementación

Implementado en el checkout local: paleta rosada/negra, ocultación de valores Pro, enlace opcional al portal, campaña configurable apagada, formularios públicos versionados, panel administrativo cerrado sin configuración, almacenamiento Postgres y cola durable para Sheets. Aún no se ejecutó la migración ni se conectó una hoja real. Los componentes de Meta Pixel/CAPI y newsletter siguen sujetos a sus propias credenciales, proveedor y configuración; el audio no aporta esas decisiones.

> **Estado: plan de trabajo actualizado con el feedback del audio.** Basado en la cotización PDF, las respuestas de Sergio y el feedback del cliente. El documento adicional de alcance anunciado sigue pendiente. Este repositorio no trae `.specify/memory/constitution.md`; las instrucciones de `AGENTS.md` se toman como reglas de trabajo, sin inventar una constitución de producto.

## Contexto técnico

- Next.js 16.2.9 con App Router, React 19, TypeScript y Tailwind CSS 4; animaciones con Motion.
- Postgres vía `postgres`; `src/lib/db.ts` guarda inscripciones en `inscripciones` y admite modo demo sin persistencia real.
- Captura existente: `src/app/api/inscripciones/route.ts`; interfaz de reserva en `src/components/sections/booking/` y `src/components/sections/enroll-form.tsx`.
- Catálogo, contacto, horarios y sedes centralizados parcialmente en `src/lib/site.ts`; reglas de fechas en `src/lib/booking.ts`.
- La landing se ensambla en `src/app/page.tsx`; metadatos y Analytics de Vercel están en `src/app/layout.tsx`.
- README indica publicación automática desde GitHub a Vercel; debe verificarse dominio, proyecto y variables al preparar despliegue. Hosting se cobra aparte según la cotización.
- Desde la primera versión del plan se agregaron bases de formularios, newsletter y Meta Pixel/CAPI; su habilitación depende de configuración y comprobaciones de cada integración. El panel administrativo y la entrega real a Google Sheets siguen pendientes de cierre operativo.

## Decisiones de arquitectura propuestas (por validar)

1. Modelar formularios publicados como entidades con slug/URL, definición versionada de campos y estado borrador/publicado/archivado; guardar respuestas separadas y relacionadas con el formulario. No permitir que una definición arbitraria ejecute código.
2. Construir el panel solicitado para el cliente y separar endpoints públicos de envío de formularios de las operaciones privadas de creación, edición y consulta. No exponer datos de leads ni gestión sin autenticación y autorización; elegir solución de acceso antes de construirlo.
3. Reutilizar validación con esquemas tipados y persistencia Postgres existente, diseñando migraciones compatibles con `inscripciones`. Definir antispam, límites y manejo de errores para los formularios públicos.
4. Crear una capa de analítica para Pixel + Conversion API, con eventos explícitos (por ejemplo, envío exitoso y clic a WhatsApp), consentimiento, deduplicación navegador/servidor y protección de credenciales. No incluir datos personales en eventos salvo que se defina y autorice expresamente un flujo compatible.
5. Mantener proveedor de newsletter desacoplado hasta que se apruebe uno; definir volumen, consentimiento, plantillas y operación delegada antes de integrar envíos.
6. Centralizar los datos operativos de programas para evitar divergencia entre textos visibles y disponibilidad calculada. La reserva debe distinguir solicitud, confirmación manual y eventual disponibilidad conectada a una fuente real.

## Fases

### 0. Cerrar alcance y fuentes

- Entrevistar a Sergio sobre campos, respuestas y permisos del panel, eventos/consentimiento/credenciales de Meta, proveedor y operación de newsletter, IA, portales y entrega.
- Incorporar el documento adicional de alcance cuando se comparta.
- Confirmar con el cliente la fuente de verdad para contenido, precios, horarios, cupos y condiciones de reserva.
- Confirmar dominio, materiales, responsable de publicación, usuarios y capacitación.

**Salida:** alcance aprobado, decisiones y dependencias anotadas; cotización y hosting separados claramente.

### 1. Coherencia de la experiencia actual

- Revisar la jerarquía de información, accesos a programas/sedes/contacto y consistencia entre landing, FAQ, ficha de categoría y reserva.
- Ajustar lenguaje para diferenciar clase solicitada de clase confirmada; aclarar disponibilidad y respuesta del equipo.
- Revisar categorías/edades límite, incluida la coexistencia Kids/Pro a los 13–14 años y el tramo sin programa publicado de 19–24.
- Verificar precios, métricas y testimonios con aprobación del cliente.
- Preservar diseño responsive y material audiovisual cotizados.

**Salida:** contenido y criterios UX aprobados antes de cambios estructurales.

### 2. Captación y formularios dinámicos

- Definir los campos admitidos, tipos de formulario, estados, slugs, páginas públicas, vista previa y ciclo de publicación.
- Diseñar esquema/migración de formularios y respuestas, conservando el flujo actual de inscripciones.
- Implementar validación, antispam, límites de envío, confirmación al visitante y notificaciones según canales aprobados.
- Implementar interfaz de gestión solo para los perfiles y tareas aprobadas; aplicar autenticación/autorización antes de exponer gestión o respuestas.
- Definir exportación, retención y borrado de datos; hacer visible al visitante el uso de sus datos y contacto de seguimiento.

**Salida:** formularios publicados por URL propia y respuestas consultables por personas autorizadas.

### 3. Preparación e integración de Meta

- Definir Pixel ID, cuenta responsable, eventos de conversión y consentimiento requerido para Pixel + Conversion API.
- Implementar carga condicionada por consentimiento/configuración y eventos minimizados, sin información personal identificable.
- Proteger credenciales y definir deduplicación de eventos navegador/servidor.
- Verificar eventos con modo de prueba de Meta antes de activar producción.

**Salida:** medición aprobada, verificable y respetuosa de la elección de consentimiento.

### 4. Newsletter, portales y operación

- Elegir proveedor/canal y flujo de consentimiento para suscripciones; definir listas, frecuencia, responsable y plantillas para la administración delegada.
- Acordar qué tareas de administración se harán con asistencia de IA y límites de revisión humana.
- Añadir enlaces de acceso a portales existentes; validar destinos y texto sin reconstruir sus funciones.
- Delimitar roles, usuarios y permisos del panel de administración confirmado.

**Salida:** decisiones operativas implementadas o pendientes explícitas con responsable, sin asumir plataformas/costos.

### 5. Verificación, publicación y entrega

- Verificar flujos de navegación y formularios en móvil/escritorio, accesibilidad de controles, validación/errores, persistencia, permisos y eventos analíticos.
- Confirmar envíos de prueba y almacenamiento conectado; no confundir modo demo/log con almacenamiento persistente.
- Revisar dominio, DNS/SSL, variables de entorno, proveedor/hosting y configuración de producción con el responsable.
- Ejecutar 2–3 rondas de ajustes acordadas, registrar aceptación y capacitar al responsable en edición/publicación y operación.
- Entregar documentación breve de accesos, datos, Pixel, newsletter y soporte operativo.

**Salida:** sitio publicado en el dominio acordado, flujos comprobados y traspaso realizado. El hosting queda como costo separado.

## Riesgos y dependencias

- Sin autenticación existente, un panel de creación/consulta implica seleccionar e implementar un esquema de identidad/autorización antes de desplegarlo.
- La disponibilidad calculada desde horarios semanales no equivale a cupos confirmados; para disponibilidad real se necesita fuente de cupos y proceso operativo acordado.
- Pixel y newsletter dependen de cuentas, identificadores, consentimiento y proveedores aún no definidos.
- Los formularios podrían recoger datos personales; las reglas de acceso, conservación y borrado deben preceder al lanzamiento.
- La cotización menciona capacitación y administración asistida por IA, pero no define plataforma ni volumen; precisar esos límites con el cliente.
- Falta el documento adicional de alcance anunciado.

## Preguntas para cerrar con Sergio

1. ¿Qué tipos de campo y controles necesita el cliente para crear formularios? ¿Puede exportar respuestas, recibir avisos, editar y archivar formularios?
2. ¿Qué roles/usuarios acceden al panel y a las respuestas? ¿Qué retención, exportación o borrado de datos se acordó?
3. Para Pixel + Conversion API, ¿existen Pixel ID, cuenta/token CAPI y eventos requeridos? ¿Qué consentimiento de cookies y política de privacidad se usarán?
4. ¿Qué proveedor de newsletter, frecuencia, listas, contenido y responsable operativo se acordaron? ¿Qué incluye la capacitación y cómo se revisan envíos asistidos por IA?
5. ¿Cuáles son los portales existentes y URLs? ¿Qué dominio y materiales entregará el cliente y quién aprueba contenido?
6. ¿La clase de prueba se confirma manualmente por WhatsApp o hay una fuente real de cupos? ¿Horarios, edades, precios y datos del sitio están validados?
7. Comparte el documento adicional de alcance y confirma si las 2–3 rondas de ajustes aplican a todo el trabajo nuevo.
