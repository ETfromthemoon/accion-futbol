CREATE TABLE IF NOT EXISTS popup_campaigns (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  definition JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS popup_campaigns_published ON popup_campaigns (updated_at DESC) WHERE status = 'published';
