# Acción Fútbol — Sitio web

Landing cinematográfica de la academia **Acción Fútbol** (Club Oriente, Las Condes).
Rediseño orientado a captar datos de clientes y agendar clases de prueba.

Stack: **Next.js 16** (App Router) · **Tailwind v4** · **motion** · **TypeScript** · **Postgres**.

Documentación del proyecto: [plan de implementación](specs/001-academia-web-operacion-y-captacion/plan.md) · [feedback del cliente y transcripción revisada](docs/feedback-cliente-2026-11-12.md) · [transcripción automática original](docs/feedback-cliente-2026-11-12-whisper.txt).

---

## Correr en tu computador

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Compilar para producción

```bash
npm run build && npm start
```

---

## Dónde llegan las inscripciones (tu base de datos)

El formulario de inscripción envía los datos a `/api/inscripciones`, que los guarda
en tu propia base de datos Postgres.

1. Crea una base de datos Postgres (Neon, Supabase, Vercel Postgres, etc.).
2. Copia su cadena de conexión y guárdala como variable de entorno `DATABASE_URL`:

   - **Local:** crea un archivo `.env.local` en la raíz con:
     ```
     DATABASE_URL="postgres://usuario:clave@host/basedatos?sslmode=require"
     ```
   - **En Vercel:** ve a *Settings → Environment Variables* y agrega `DATABASE_URL`.

3. La tabla `inscripciones` se crea sola la primera vez que llega una inscripción.

> Si **no** hay `DATABASE_URL` configurada, el sitio sigue funcionando en modo demo:
> el formulario responde en modo demo y registra la inscripción en el log del servidor;
> **no se guarda en una base persistente**. Configura la base antes de captar datos reales.

### Ver las inscripciones guardadas

```sql
SELECT created_at, name, phone, email, program, participant_age, message
FROM inscripciones
ORDER BY created_at DESC;
```

---

## Volver a publicar cambios

El sitio está conectado a Vercel: **cada vez que subes un cambio a GitHub, se publica solo.**

```bash
git add .
git commit -m "describe tu cambio"
git push
```

---

## Integraciones en preparación

Meta Pixel requiere `NEXT_PUBLIC_META_PIXEL_ID`. Para Conversion API también se necesitan `META_CAPI_ACCESS_TOKEN` y `META_GRAPH_API_VERSION` (por ejemplo, una versión compatible de Graph API). La medición se activa únicamente con el consentimiento del visitante; el evento de solicitud se envía tras guardar la inscripción en la base de datos. Las credenciales se configuran en el entorno del servidor, nunca en el repositorio. Comprobar la configuración y los eventos en la cuenta del cliente antes de producción.

El newsletter está desactivado por defecto. Su contrato de integración y requisitos pendientes están descritos en `src/lib/newsletter/README.md`. Los formularios cuentan con rutas públicas y un panel protegido, cerrado mientras falte la configuración de acceso. La migración todavía no se ha ejecutado; consulta `src/lib/forms/README.md` antes de habilitarlos.

## Editar contenido rápido

Casi todo el texto, los programas, precios, horarios y testimonios viven en un solo archivo:

```
src/lib/site.ts
```

Las imágenes están en `public/images/` (formato WebP optimizado).
Para optimizar imágenes nuevas: ponlas en `public/images/` y corre
`node scripts/optimize-images.mjs`.

### Metodología y base de conocimiento

Las cuatro fases de la pizarra interactiva de «Cómo funciona» se editan en `METHOD_STEPS` de `src/lib/site.ts`. Las preguntas, respuestas, temas y palabras relacionadas del buscador están en `src/lib/knowledge-base.ts`. Cada respuesta debe basarse en información confirmada; el buscador local solo recupera entradas de esa base y muestra contacto directo cuando no encuentra una coincidencia. No genera respuestas con IA ni consulta servicios externos. Al cambiar horarios o programas, revisa también las entradas relacionadas y ejecuta `npm test`.
