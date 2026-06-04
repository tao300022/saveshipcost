-- Add translations JSONB column to city_announcements.
-- Shape:
--   { "en": { "content": "...", "companyName": "..." },
--     "fr": { "content": "...", "companyName": "..." },
--     "es": { "content": "...", "companyName": "..." } }
-- Source-language (zh) text continues to live in the existing `content` and `company_name` columns.

ALTER TABLE city_announcements
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- GIN index lets us query "rows missing a given language" efficiently for the backfill button.
CREATE INDEX IF NOT EXISTS city_announcements_translations_gin
  ON city_announcements USING GIN (translations);
