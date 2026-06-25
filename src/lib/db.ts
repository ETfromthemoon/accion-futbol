import "server-only";
import postgres from "postgres";

/*
  Capa de base de datos para las inscripciones / clases de prueba.

  Conecta a TU propia base de datos Postgres definiendo la variable de entorno
  DATABASE_URL (Neon, Supabase, Vercel Postgres, RDS, etc.). Si no hay
  DATABASE_URL configurada, el sitio sigue funcionando en modo demo: registra
  el lead en el log del servidor y responde con éxito, sin perder la captura.
*/

export type Lead = {
  name: string;
  email: string;
  phone: string;
  program: string;
  participantAge?: string;
  message?: string;
  source?: string;
};

const connectionString = process.env.DATABASE_URL;

// Singleton del cliente postgres (evita abrir conexiones por cada request).
let sql: ReturnType<typeof postgres> | null = null;
let schemaReady = false;

function getClient() {
  if (!connectionString) return null;
  if (!sql) {
    sql = postgres(connectionString, {
      ssl: "require",
      max: 1,
      idle_timeout: 20,
    });
  }
  return sql;
}

async function ensureSchema(client: ReturnType<typeof postgres>) {
  if (schemaReady) return;
  await client`
    CREATE TABLE IF NOT EXISTS inscripciones (
      id            BIGSERIAL PRIMARY KEY,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT NOT NULL,
      program       TEXT NOT NULL,
      participant_age TEXT,
      message       TEXT,
      source        TEXT
    )
  `;
  schemaReady = true;
}

export type SaveResult = { stored: "db" | "log" };

export async function saveLead(lead: Lead): Promise<SaveResult> {
  const client = getClient();

  if (!client) {
    // Modo demo: sin base de datos conectada todavía.
    console.info("[inscripcion:demo] lead capturado (sin DB):", {
      ...lead,
      email: lead.email,
    });
    return { stored: "log" };
  }

  await ensureSchema(client);
  await client`
    INSERT INTO inscripciones
      (name, email, phone, program, participant_age, message, source)
    VALUES
      (${lead.name}, ${lead.email}, ${lead.phone}, ${lead.program},
       ${lead.participantAge ?? null}, ${lead.message ?? null}, ${lead.source ?? null})
  `;
  return { stored: "db" };
}
