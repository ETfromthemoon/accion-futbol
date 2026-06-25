# Acción Fútbol — Sitio web

Landing cinematográfica de la academia **Acción Fútbol** (Club Oriente, Las Condes).
Rediseño orientado a captar datos de clientes y agendar clases de prueba.

Stack: **Next.js 16** (App Router) · **Tailwind v4** · **motion** · **TypeScript** · **Postgres**.

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
> el formulario responde con éxito y registra la inscripción en el log del servidor,
> sin perder ningún dato de prueba. Conecta la base cuando quieras empezar a guardarlas.

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

## Editar contenido rápido

Casi todo el texto, los programas, precios, horarios y testimonios viven en un solo archivo:

```
src/lib/site.ts
```

Las imágenes están en `public/images/` (formato WebP optimizado).
Para optimizar imágenes nuevas: ponlas en `public/images/` y corre
`node scripts/optimize-images.mjs`.
