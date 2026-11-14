-- Ejecutar mediante el proceso de migraciones acordado antes de habilitar formularios.
CREATE TABLE IF NOT EXISTS form_definitions (
  slug TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  definition JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (slug, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS form_definitions_one_published
  ON form_definitions (slug) WHERE status = 'published';

CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGSERIAL PRIMARY KEY,
  form_slug TEXT NOT NULL,
  form_version INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (form_slug, form_version) REFERENCES form_definitions (slug, version)
);

-- Entrega durable a Sheets. Mantiene el payload pendiente si el proveedor falla o
-- aún no está configurado; nunca guarda secretos del proveedor.
CREATE TABLE IF NOT EXISTS form_sheet_sync (
  id BIGSERIAL PRIMARY KEY,
  submission_id BIGINT NOT NULL UNIQUE REFERENCES form_submissions(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'synced')),
  last_result TEXT NOT NULL DEFAULT 'pending' CHECK (last_result IN ('pending', 'not_configured', 'failed', 'synced')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced_at TIMESTAMPTZ
);

ALTER TABLE form_sheet_sync ADD COLUMN IF NOT EXISTS last_result TEXT NOT NULL DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS form_sheet_sync_pending ON form_sheet_sync (created_at) WHERE status = 'pending';
