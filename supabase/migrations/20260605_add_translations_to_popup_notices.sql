-- Add translations JSONB column to popup_notices.
-- Shape: { "en": { "title": "...", "content": "...", "linkText": "..." }, "fr": {...}, "es": {...} }
-- Source-language (zh) text continues to live in title / content / link_text columns.

ALTER TABLE popup_notices
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS popup_notices_translations_gin
  ON popup_notices USING GIN (translations);
